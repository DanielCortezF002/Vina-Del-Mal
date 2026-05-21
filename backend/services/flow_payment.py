"""
Servicio de pagos con Flow.cl
Genera URLs de pago con firma HMAC-SHA256
"""

import hashlib
import hmac
import httpx
from core.config import settings


async def create_flow_payment(order) -> dict | None:
    """
    Crea un pago en Flow.cl sandbox.
    Retorna dict con 'url' y 'token' si exitoso, None si Flow no está configurado.
    """
    if not settings.FLOW_API_KEY or not settings.FLOW_SECRET_KEY:
        return None

    params = {
        "apiKey": settings.FLOW_API_KEY,
        "commerceOrder": str(order.id),
        "subject": f"Orden #{order.id} - Viña del Mal",
        "currency": "CLP",
        "amount": int(order.total),
        "email": order.customer_email,
        "urlConfirmation": f"{settings.CORS_ORIGINS[-1]}/api/flow/confirm",
        "urlReturn": f"{settings.CORS_ORIGINS[-1]}/checkout/success",
    }

    # Firmar la solicitud con HMAC-SHA256
    sorted_params = sorted(params.items())
    to_sign = "&".join(f"{k}={v}" for k, v in sorted_params)
    signature = hmac.new(
        settings.FLOW_SECRET_KEY.encode(),
        to_sign.encode(),
        hashlib.sha256,
    ).hexdigest()
    params["s"] = signature

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.FLOW_API_URL}/payment/create", data=params
            )
            if response.status_code == 200:
                return response.json()
    except Exception:
        pass

    return None
