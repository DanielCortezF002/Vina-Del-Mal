from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
import json

from core.database import get_db
from models.product import Product
from schemas.product import ProductResponse, ProductDetailResponse

router = APIRouter()

# TODO: Configurar conexión a Redis real
# Por ahora simulamos caché
mock_redis = {}

@router.get("/", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_active == True)

    # Nota: Filtros por tenant irían aquí, p. ej: .filter(Product.tenant_id == request.state.tenant_id)

    if category:
        # Simplificación: En un caso real haríamos join con Category
        # query = query.join(Category).filter(Category.slug == category)
        pass

    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_filter),
                Product.slug.ilike(search_filter)
            )
        )

    offset = (page - 1) * limit
    products = query.offset(offset).limit(limit).all()
    
    return products

@router.get("/{id}", response_model=ProductDetailResponse)
def get_product(id: int, db: Session = Depends(get_db)):
    # Intentar obtener de "Redis"
    cache_key = f"product:{id}"
    if cache_key in mock_redis:
        return json.loads(mock_redis[cache_key])

    product = db.query(Product).filter(Product.id == id, Product.is_active == True).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Obtener similares (misma categoría, excluyendo el actual, max 4)
    similar = db.query(Product).filter(
        Product.category_id == product.category_id,
        Product.id != id,
        Product.is_active == True
    ).limit(4).all()

    # Construir response manually to simulate cache logic
    response_data = ProductDetailResponse.model_validate(product)
    response_data.similar_products = [ProductResponse.model_validate(p) for p in similar]

    # Guardar en "Redis"
    mock_redis[cache_key] = response_data.model_dump_json()

    return response_data
