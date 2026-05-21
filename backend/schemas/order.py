from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional, List
from datetime import datetime


# ── Schemas para items de orden ──────────────────────────────────────────────

class OrderItemCreate(BaseModel):
    """Item individual dentro de una orden de compra."""
    product_id: int
    quantity: int


class OrderItemResponse(BaseModel):
    """Respuesta de un item de orden."""
    id: int
    order_id: int
    product_id: int
    quantity: int
    unit_price: float

    model_config = ConfigDict(from_attributes=True)


# ── Schemas para órdenes ─────────────────────────────────────────────────────

class OrderCreate(BaseModel):
    """Payload para crear una nueva orden de compra."""
    customer_name: str
    customer_email: EmailStr
    customer_phone: Optional[str] = None
    customer_rut: Optional[str] = None
    shipping_address: Optional[str] = None
    items: List[OrderItemCreate]


class OrderResponse(BaseModel):
    """Respuesta de una orden de compra."""
    id: int
    tenant_id: int
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    customer_rut: Optional[str] = None
    shipping_address: Optional[str] = None
    total: float
    status: str
    flow_token: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OrderDetailResponse(OrderResponse):
    """Respuesta detallada de una orden incluyendo sus items."""
    items: List[OrderItemResponse] = []


class OrderStatusUpdate(BaseModel):
    """Payload para actualizar el estado de una orden."""
    status: str
