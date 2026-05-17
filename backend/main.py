from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.products import router as products_router
from api.v1.auth.router import router as auth_router
from core.legal_hours import LegalHoursMiddleware

app = FastAPI(
    title="Viña del Mal API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Modificar en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# BE-5: Restricción horaria legal Chile (Ley 19.925)
app.add_middleware(LegalHoursMiddleware)

# Rutas
app.include_router(products_router, prefix="/api/v1/products", tags=["Productos"])
app.include_router(auth_router, prefix="/auth", tags=["Autenticación"])

@app.get("/health", tags=["Sistema"])
def health_check():
    return {"status": "ok", "message": "API running"}

@app.get("/", tags=["Sistema"])
def read_root():
    return {"message": "Welcome to Viña del Mal API v1.0.0"}

