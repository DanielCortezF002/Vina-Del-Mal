"""
BE-5: Middleware de restricción horaria legal Chile

Bloquea ventas entre 02:00 y 10:00 CLT y todos los domingos.
Maneja correctamente el DST de Chile (cambia en abril y septiembre).

Configuración por tenant mediante campo JSONB en tabla tenants.
"""

from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from datetime import datetime, time
import pytz

# Timezone oficial de Chile continental con soporte DST automático
CHILE_TZ = pytz.timezone("America/Santiago")

# Rutas exentas de verificación horaria (no son ventas)
EXEMPT_PATHS = {
    "/",
    "/health",
    "/auth/register",
    "/auth/login",
    "/auth/refresh",
    "/docs",
    "/openapi.json",
    "/redoc",
}

# Horarios de venta permitidos por ley chilena
SALE_START = time(10, 0)   # 10:00 CLT
SALE_END   = time(2, 0)    # 02:00 CLT (del día siguiente → es noche)

# Configuración default (puede sobreescribirse por tenant en JSONB)
DEFAULT_RESTRICTIONS = {
    "block_sundays": True,
    "block_start_hour": 2,   # 02:00
    "block_end_hour": 10,    # 10:00
}


def is_sale_allowed(now_chile: datetime, restrictions: dict = DEFAULT_RESTRICTIONS) -> tuple[bool, str]:
    """
    Retorna (True, "") si la venta está permitida,
    o (False, "motivo") si está bloqueada.
    """
    # Bloqueo de domingos (weekday: 6 = domingo)
    if restrictions.get("block_sundays", True) and now_chile.weekday() == 6:
        return False, "Las ventas de alcohol están prohibidas los domingos según la Ley 19.925"

    # Bloqueo horario nocturno: entre block_start_hour y block_end_hour
    block_start = restrictions.get("block_start_hour", 2)
    block_end   = restrictions.get("block_end_hour", 10)
    current_hour = now_chile.hour

    # La restricción nocturna cruza medianoche (02:00 a 10:00)
    if block_start < block_end:
        # Rango normal: start < end (ej. 02:00-10:00)
        blocked = block_start <= current_hour < block_end
    else:
        # Rango que cruza medianoche (ej. 22:00-06:00)
        blocked = current_hour >= block_start or current_hour < block_end

    if blocked:
        return False, (
            f"Las ventas de alcohol están prohibidas entre las "
            f"{block_start:02d}:00 y las {block_end:02d}:00 (horario de Chile) "
            f"según la Ley 19.925"
        )

    return True, ""


class LegalHoursMiddleware(BaseHTTPMiddleware):
    """
    Middleware que intercepta rutas de ventas y verifica restricciones horarias legales.
    Las rutas de compra/carrito son bloqueadas si no es horario legal.
    """

    # Rutas que implican transacciones de venta
    SALE_ROUTES_PREFIXES = [
        "/api/v1/orders",
        "/api/v1/cart",
        "/api/v1/checkout",
    ]

    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        # Verificar si la ruta es de venta
        is_sale_route = any(path.startswith(prefix) for prefix in self.SALE_ROUTES_PREFIXES)

        if not is_sale_route or path in EXEMPT_PATHS:
            return await call_next(request)

        # Obtener hora actual en Chile (DST manejado automáticamente por pytz + America/Santiago)
        now_utc = datetime.now(pytz.utc)
        now_chile = now_utc.astimezone(CHILE_TZ)

        # TODO: Cargar restrictions desde tenant JSONB cuando esté disponible
        # tenant_id = request.state.tenant_id
        # restrictions = await get_tenant_restrictions(tenant_id)
        restrictions = DEFAULT_RESTRICTIONS

        allowed, reason = is_sale_allowed(now_chile, restrictions)

        if not allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "error": "LEGAL_HOURS_RESTRICTION",
                    "message": reason,
                    "current_time_chile": now_chile.strftime("%Y-%m-%d %H:%M:%S %Z"),
                    "next_allowed_time": "Hoy a las 10:00 hrs o el próximo día hábil",
                }
            )

        return await call_next(request)
