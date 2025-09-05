from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .database.core import engine, Base
from .entities.todo import Todo # Import model to register them
from .entities.user import User # Import model to register them
from .api import register_routes
from .logging import configure_logging, LogLevels

configure_logging(LogLevels.INFO)

app = FastAPI(title="Clean Architecture FastAPI", description="A todo app with clean architecture")

# # CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # In production, specify your frontend domain
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

""" Only uncomment below to create tables,
otherwise the tests will fail if not connected
"""
# Base.metadata.create_all(bind=engine)

register_routes(app)

# # Mount static files for frontend
# app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")