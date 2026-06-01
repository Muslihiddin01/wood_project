console.log("working!!!");

async function registerUser() {
  const username = document.getElementById("reg_username").value;

  const password = document.getElementById("reg_password").value;

  const response = await fetch("/register", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      username,
      password,
    }),
  });

  const result = await response.json();

  alert(result.message || result.error);
}

async function login() {
  const username = document.getElementById("login_username").value;

  const password = document.getElementById("login_password").value;

  const response = await fetch("/login", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      username,
      password,
    }),
  });

  const result = await response.json();

  if (result.success) {
    alert("Добро пожаловать!");

    document.querySelector(".auth").style.display = "none";
    document.getElementById("warehouse").style.display = "";

    loadProducts();
  } else {
    alert(result.message);
  }
}

function logout() {

    document.querySelector(".auth").style.display = "block"
    document.getElementById("warehouse").style.display = "none"

}

async function loadProducts() {
  const response = await fetch("/products");

  const products = await response.json();

  const list = document.getElementById("products");

  list.innerHTML = "";

  products.forEach((product) => {
    const item = document.createElement("li");

    item.innerText = `ID: ${product.id} | ${product.name} | Цена: ${product.cube_price} | Остаток: ${product.cubes} кубов`;

    list.appendChild(item);
  });
}

async function addProduct() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const cubes = document.getElementById("cubes").value;

  await fetch("/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      cube_price: Number(price),
      cubes: Number(cubes),
    }),
  });

  loadProducts();
}

async function sellProduct() {
  const id = document.getElementById("sell_id").value;
  const cubes = document.getElementById("sell_cubes").value;

  const response = await fetch("/sell", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: Number(id),
      cubes: Number(cubes),
    }),
  });

  const result = await response.json();

  alert(JSON.stringify(result));

  loadProducts();
}

document.getElementById("warehouse").style.display = "none";
