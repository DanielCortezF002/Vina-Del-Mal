"""
Seed script — Poblar la base de datos con datos iniciales.
Ejecutar: python seed.py

Crea:
  - Tenant default 'vinadelmal'
  - Usuario admin (admin@vinadelmal.cl / Admin123!)
  - 12 productos del catálogo
"""

from core.database import SessionLocal, Base, engine
from models.tenant import Tenant
from models.user import User
from models.product import Category, Product

# Aseguramos importar Order/OrderItem para que se registren
from models.order import Order, OrderItem  # noqa: F401

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

PRODUCTS = [
    {"name": "Whisky Johnnie Walker Blue Label", "slug": "jw-blue", "price": 215000, "category": "Whisky", "abv": 40, "image": "https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=600&auto=format&fit=crop"},
    {"name": "Vino Don Melchor Cabernet Sauvignon", "slug": "don-melchor", "price": 120000, "category": "Vinos", "abv": 14.5, "image": "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop"},
    {"name": "Gin Hendrick's", "slug": "hendricks", "price": 35000, "category": "Gin", "abv": 41.4, "image": "https://images.unsplash.com/photo-1609951651556-5334e2706168?q=80&w=600&auto=format&fit=crop"},
    {"name": "Vodka Grey Goose", "slug": "grey-goose", "price": 42000, "category": "Vodka", "abv": 40, "image": "https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=600&auto=format&fit=crop"},
    {"name": "Tequila Don Julio 1942", "slug": "don-julio-1942", "price": 185000, "category": "Tequila", "abv": 38, "image": "https://images.unsplash.com/photo-1516535794938-6063878f08cc?q=80&w=600&auto=format&fit=crop"},
    {"name": "Vodka Absolut", "slug": "absolut", "price": 18000, "category": "Vodka", "abv": 40, "image": "https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=600&auto=format&fit=crop"},
    {"name": "Jack Daniel's Old No. 7", "slug": "jack-daniels", "price": 28000, "category": "Whisky", "abv": 40, "image": "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=600&auto=format&fit=crop"},
    {"name": "Espumante Moët & Chandon Brut", "slug": "moet-brut", "price": 72000, "category": "Espumante", "abv": 12, "image": "https://images.unsplash.com/photo-1559329007-40df8a9345d8?q=80&w=600&auto=format&fit=crop"},
    {"name": "Ron Bacardi Carta Blanca", "slug": "bacardi-blanca", "price": 12000, "category": "Ron", "abv": 37.5, "image": "https://images.unsplash.com/photo-1562601579-599dec564e06?q=80&w=600&auto=format&fit=crop"},
    {"name": "Whisky Johnnie Walker Black Label", "slug": "jw-black", "price": 38000, "category": "Whisky", "abv": 40, "image": "https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=600&auto=format&fit=crop"},
    {"name": "Vino Casillero del Diablo Reserva", "slug": "casillero-reserva", "price": 9500, "category": "Vinos", "abv": 13.5, "image": "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop"},
    {"name": "Gin Tanqueray London Dry", "slug": "tanqueray", "price": 28000, "category": "Gin", "abv": 43.1, "image": "https://images.unsplash.com/photo-1609951651556-5334e2706168?q=80&w=600&auto=format&fit=crop"},
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Crear tenant default
        tenant = db.query(Tenant).filter(Tenant.slug == "vinadelmal").first()
        if not tenant:
            tenant = Tenant(slug="vinadelmal", name="Viña del Mal")
            db.add(tenant)
            db.flush()
            print(f"✅ Tenant creado: {tenant.name} (id={tenant.id})")
        else:
            print(f"ℹ️  Tenant ya existe: {tenant.name} (id={tenant.id})")

        # 2. Crear usuario admin
        admin = db.query(User).filter(User.email == "admin@vinadelmal.cl").first()
        if not admin:
            admin = User(
                tenant_id=tenant.id,
                email="admin@vinadelmal.cl",
                hashed_password=pwd_context.hash("Admin123!"),
                full_name="Administrador VdM",
                rut="11111111-1",
                is_admin=True,
            )
            db.add(admin)
            print("✅ Admin creado: admin@vinadelmal.cl / Admin123!")
        else:
            print("ℹ️  Admin ya existe")

        # 3. Crear categorías y productos
        categories_created = 0
        products_created = 0

        for p_data in PRODUCTS:
            cat_name = p_data["category"]
            cat_slug = cat_name.lower().replace(" ", "-")

            category = db.query(Category).filter(Category.slug == cat_slug).first()
            if not category:
                category = Category(name=cat_name, slug=cat_slug)
                db.add(category)
                db.flush()
                categories_created += 1

            product = db.query(Product).filter(Product.slug == p_data["slug"]).first()
            if not product:
                product = Product(
                    category_id=category.id,
                    name=p_data["name"],
                    slug=p_data["slug"],
                    price=p_data["price"],
                    alcohol_percentage=p_data["abv"],
                    image_url=p_data["image"],
                    is_active=True,
                )
                db.add(product)
                products_created += 1

        db.commit()
        print(f"✅ {categories_created} categorías creadas")
        print(f"✅ {products_created} productos creados")
        print("\n🎉 Seed completado exitosamente!")

    except Exception as e:
        db.rollback()
        print(f"❌ Error en seed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
