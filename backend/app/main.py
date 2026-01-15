from fastapi import FastAPI

app = FastAPI(title="Nisse Neumann Learning Viz Backend")

@app.get("/")
def read_root():
    return {"message": "Welcome to Nisse Neumann Interactive Learning Viz API"}
