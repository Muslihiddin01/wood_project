from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import requests

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

API_URL = "https://6821ee2fb342dce8004c65e8.mockapi.io/products"

USERS_API = "https://6821ee2fb342dce8004c65e8.mockapi.io/users"

# ---------- MODELS ----------

class Product(BaseModel):
    name: str
    cube_price: float
    cubes: float


class Sale(BaseModel):
    product_id: int
    cubes: float
    

class User(BaseModel):
    username: str
    password: str
    


# ---------- FRONT ----------

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html"
    )


# ---------- PRODUCTS ----------

@app.get("/products")
def get_products():

    response = requests.get(API_URL)

    return response.json()


@app.post("/products")
def add_product(product: Product):

    response = requests.post(
        API_URL,
        json={
            "name": product.name,
            "cube_price": product.cube_price,
            "cubes": product.cubes
        }
    )

    return response.json()


# ---------- SALES ----------

@app.post("/sell")
def sell_product(sale: Sale):

    # Получаем товар
    response = requests.get(f"{API_URL}/{sale.product_id}")

    if response.status_code != 200:
        return {"error": "Товар не найден"}

    product = response.json()

    current_cubes = float(product["cubes"])

    # Проверка остатка
    if current_cubes < sale.cubes:
        return {"error": "Недостаточно товара"}

    # Новый остаток
    new_cubes = current_cubes - sale.cubes

    # Обновляем товар
    update_response = requests.put(
        f"{API_URL}/{sale.product_id}",
        json={
            "name": product["name"],
            "cube_price": product["cube_price"],
            "cubes": new_cubes
        }
    )

    total_price = float(product["cube_price"]) * sale.cubes

    return {
        "message": "Продажа выполнена",
        "product": product["name"],
        "sold_cubes": sale.cubes,
        "total_price": total_price,
        "remaining": new_cubes
    }
    

@app.post("/register")
def register(user: User):

    users = requests.get(USERS_API).json()

    for u in users:
        if u["username"] == user.username:
            return {"error": "Пользователь уже существует"}

    response = requests.post(
        USERS_API,
        json={
            "username": user.username,
            "password": user.password
        }
    )

    return {
        "message": "Регистрация успешна"
    }
    


@app.post("/login")
def login(user: User):

    users = requests.get(USERS_API).json()

    for u in users:

        if (
            u["username"] == user.username
            and
            u["password"] == user.password
        ):
            return {
                "success": True,
                "message": "Вход выполнен"
            }

    return {
        "success": False,
        "message": "Неверный логин или пароль"
    }