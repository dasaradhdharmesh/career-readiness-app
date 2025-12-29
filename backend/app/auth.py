from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
import os
from db.database import get_connection


SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# simple in-memory user store for prototype
_users = {}

class UserInDB(BaseModel):
    email: str
    hashed_password: str
    name: Optional[str] = None

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_user(email, password, name=None):
    conn = get_connection()
    cur = conn.cursor()

    hashed = get_password_hash(password)

    try:
        cur.execute(
            "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
            (email, hashed, name),
        )
        conn.commit()
    except Exception:
        raise ValueError("User already exists")
    finally:
        conn.close()


def authenticate_user(email, password):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM users WHERE email = ?", (email,))
    row = cur.fetchone()
    conn.close()

    if not row:
        return None

    if not verify_password(password, row["password_hash"]):
        return None

    return row


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
