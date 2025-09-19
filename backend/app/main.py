from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import auth, admin

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Define the list of allowed origins (your frontend's URL)
origins = [
    "http://localhost:5173",
]

# Add the CORS middleware to your application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)

# Include your API routers
app.include_router(auth.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the College Management Portal API"}