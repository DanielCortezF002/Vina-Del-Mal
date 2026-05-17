from pydantic import BaseModel, ConfigDict
from typing import Optional, List

class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    
    model_config = ConfigDict(from_attributes=True)

class ProductResponse(BaseModel):
    id: int
    category_id: Optional[int]
    name: str
    slug: str
    price: float
    alcohol_percentage: Optional[float]
    image_url: Optional[str]
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class ProductDetailResponse(ProductResponse):
    similar_products: List[ProductResponse] = []
