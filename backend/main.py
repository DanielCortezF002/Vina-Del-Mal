from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.products import router as products_router
from api.v1.auth.router import router as auth_router
from api.v1.orders import router as orders_router
from core.config import settings
from core.legal_hours import LegalHoursMiddleware
from core.database import Base, engine

# Importar todos los modelos para que SQLAlchemy los registre
from models import Tenant, Category, Product, User, Order, OrderItem  # noqa: F401

app = FastAPI(
    title="Viña del Mal API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configurar CORS con orígenes permitidos
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# BE-5: Restricción horaria legal Chile (Ley 19.925)
app.add_middleware(LegalHoursMiddleware)

# Rutas
app.include_router(products_router, prefix="/api/v1/products", tags=["Productos"])
app.include_router(auth_router, prefix="/auth", tags=["Autenticación"])
app.include_router(orders_router, prefix="/api/v1/orders", tags=["Órdenes"])


@app.on_event("startup")
def on_startup():
    """Crea las tablas en la base de datos si no existen."""
    Base.metadata.create_all(bind=engine)


@app.get("/health", tags=["Sistema"])
def health_check():
    return {"status": "ok", "message": "API running", "version": "1.0.0"}


@app.get("/api/v1/health", tags=["Sistema"])
def health_check_v1():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "viña-del-mal-api",
    }


@app.get("/", tags=["Sistema"])
def read_root():
    return {"message": "Welcome to Viña del Mal API v1.0.0"}
