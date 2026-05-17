from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, MetaData
from core.database import Base

# Para el schema per tenant, usamos un MetaData sin schema predefinido
# O definimos una clase base para los tenants
class TenantBase(Base):
    __abstract__ = True

class Category(TenantBase):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)

class Product(TenantBase):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    price = Column(Float, nullable=False)
    alcohol_percentage = Column(Float, nullable=True)
    image_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
