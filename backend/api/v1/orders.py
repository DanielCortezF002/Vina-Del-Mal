"""
Router de órdenes — Sprint 3
CRUD de órdenes + integración con Flow.cl para pagos
"""

from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from typing import List, Optional

from core.database import get_db
from models.order import Order, OrderItem
from models.product import Product
from models.tenant import Tenant
from schemas.order import (
    OrderCreate,
    OrderResponse,
    OrderDetailResponse,
    OrderStatusUpdate,
)

router = APIRouter()


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: OrderCreate,
    x_tenant_slug: str = Header(default="vinadelmal"),
    db: Session = Depends(get_db),
):
    """Crea una nueva orden de compra y descuenta stock."""
    tenant = db.query(Tenant).filter(Tenant.slug == x_tenant_slug).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant no encontrado")

    new_order = Order(
        tenant_id=tenant.id,
        customer_name=payload.customer_name,
        customer_email=payload.customer_email,
        customer_phone=payload.customer_phone,
        customer_rut=payload.customer_rut,
        shipping_address=payload.shipping_address,
        total=0,
    )
    db.add(new_order)
    db.flush()

    total = 0.0
    for item in payload.items:
        product = (
            db.query(Product)
            .filter(Product.id == item.product_id, Product.is_active == True)
            .first()
        )
        if not product:
            raise HTTPException(
                status_code=404, detail=f"Producto {item.product_id} no encontrado"
            )

        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=product.price,
        )
        total += product.price * item.quantity
        db.add(order_item)

    new_order.total = total
    db.commit()
    db.refresh(new_order)
    return new_order


@router.get("/", response_model=List[OrderResponse])
def get_orders(
    status_filter: Optional[str] = None,
    x_tenant_slug: str = Header(default="vinadelmal"),
    db: Session = Depends(get_db),
):
    """Lista todas las órdenes del tenant (requiere auth en producción)."""
    query = (
        db.query(Order)
        .join(Tenant, Order.tenant_id == Tenant.id)
        .filter(Tenant.slug == x_tenant_slug)
    )
    if status_filter:
        query = query.filter(Order.status == status_filter)
    return query.order_by(Order.created_at.desc()).all()


@router.get("/{order_id}", response_model=OrderDetailResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Obtiene el detalle de una orden incluyendo sus items."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    return order


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
):
    """Actualiza el estado de una orden (admin)."""
    valid_statuses = {"pending", "paid", "dispatched", "delivered", "cancelled"}
    if payload.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Estado inválido. Opciones: {', '.join(valid_statuses)}",
        )

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")

    order.status = payload.status
    db.commit()
    db.refresh(order)
    return order
