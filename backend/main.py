from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.products import router as products_router

app = FastAPI(title="Viña del Mal API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Modificar en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products_router, prefix="/api/v1/products", tags=["Products"])

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "API running"}

@app.get("/")
def read_root():
    return {"message": "Welcome to Viña del Mal API"}
