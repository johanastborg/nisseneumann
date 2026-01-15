from fastapi import FastAPI
from .api.endpoints import router as dspy_router

app = FastAPI(title="Nisse Neumann Learning Viz Backend")

app.include_router(dspy_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to Nisse Neumann Interactive Learning Viz API"}
