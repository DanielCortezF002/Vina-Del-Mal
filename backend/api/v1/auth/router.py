from fastapi import APIRouter, HTTPException, status
from schemas.auth import RegisterRequest, LoginRequest, TokenResponse
import os

router = APIRouter()

# Supabase client (lazy init to avoid import errors without env vars)
def get_supabase():
    from supabase import create_client
    url = os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL", "")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    if not url or not key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supabase no configurado. Agrega SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY"
        )
    return create_client(url, key)


# ── AUTH-1: POST /auth/register ──────────────────────────────────────────────
@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registro de nuevo usuario con validación de RUT chileno"
)
async def register(payload: RegisterRequest):
    """
    Registra un nuevo usuario.
    - Valida formato y dígito verificador del RUT chileno
    - Verifica email único por tenant
    - Integra con Supabase Auth
    - Retorna JWT + refresh_token + user info
    """
    supabase = get_supabase()

    try:
        # Intentar crear usuario en Supabase Auth
        response = supabase.auth.admin.create_user({
            "email": payload.email,
            "password": payload.password,
            "email_confirm": True,  # Auto-confirm en desarrollo
            "user_metadata": {
                "full_name": payload.full_name,
                "rut": payload.rut,
            }
        })
    except Exception as e:
        error_msg = str(e)
        if "already registered" in error_msg or "already exists" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Este email ya está registrado en este tenant"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear usuario: {error_msg}"
        )

    # Sign in to get tokens
    sign_in = supabase.auth.sign_in_with_password({
        "email": payload.email,
        "password": payload.password,
    })

    session = sign_in.session
    user = sign_in.user

    return TokenResponse(
        access_token=session.access_token,
        refresh_token=session.refresh_token,
        user={
            "id": str(user.id),
            "email": user.email,
            "full_name": payload.full_name,
            "rut": payload.rut,
        }
    )


# ── AUTH-2: POST /auth/login ─────────────────────────────────────────────────
@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login con email y contraseña — retorna JWT + refresh token"
)
async def login(payload: LoginRequest):
    """
    Autentica un usuario existente.
    - Retorna JWT (access_token) + refresh_token + user info
    - 401 en caso de credenciales incorrectas
    """
    supabase = get_supabase()

    try:
        response = supabase.auth.sign_in_with_password({
            "email": payload.email,
            "password": payload.password,
        })
    except Exception as e:
        error_msg = str(e).lower()
        if "invalid login credentials" in error_msg or "invalid_credentials" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas",
                headers={"WWW-Authenticate": "Bearer"},
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error de autenticación: {str(e)}"
        )

    session = response.session
    user = response.user
    metadata = user.user_metadata or {}

    return TokenResponse(
        access_token=session.access_token,
        refresh_token=session.refresh_token,
        user={
            "id": str(user.id),
            "email": user.email,
            "full_name": metadata.get("full_name", ""),
            "rut": metadata.get("rut", ""),
        }
    )
