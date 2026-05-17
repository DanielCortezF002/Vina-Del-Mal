import re
from pydantic import BaseModel, EmailStr, field_validator, ConfigDict


def validate_rut(rut: str) -> str:
    """
    Valida formato RUT chileno: 12.345.678-9 o 12345678-9
    Returns cleaned rut or raises ValueError
    """
    # Limpiar puntos
    rut_clean = rut.replace(".", "").strip()
    # Validar formato base: digitos-verificador
    if not re.match(r"^\d{7,8}-[\dkK]$", rut_clean):
        raise ValueError("Formato de RUT inválido. Use: 12.345.678-9")

    body, dv = rut_clean.split("-")
    dv = dv.upper()

    # Calcular dígito verificador
    total = 0
    multiplier = 2
    for digit in reversed(body):
        total += int(digit) * multiplier
        multiplier = multiplier % 7 + 2

    remainder = 11 - (total % 11)
    expected_dv = {11: "0", 10: "K"}.get(remainder, str(remainder))

    if dv != expected_dv:
        raise ValueError("RUT inválido: dígito verificador incorrecto")

    return rut_clean


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    rut: str
    full_name: str

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")
        return v

    @field_validator("rut")
    @classmethod
    def rut_valid(cls, v: str) -> str:
        return validate_rut(v)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

    model_config = ConfigDict(from_attributes=True)
