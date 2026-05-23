async function loadProducts() {

    const response = await fetch("/products")

    const products = await response.json()

    const list = document.getElementById("products")

    list.innerHTML = ""

    products.forEach(product => {

        const item = document.createElement("li")

        item.innerText =
            `ID: ${product.id} | ${product.name} | Цена: ${product.cube_price} | Остаток: ${product.cubes} кубов`

        list.appendChild(item)
    })
}


async function addProduct() {

    const name = document.getElementById("name").value
    const price = document.getElementById("price").value
    const cubes = document.getElementById("cubes").value

    await fetch("/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            cube_price: Number(price),
            cubes: Number(cubes)
        })
    })

    loadProducts()
}


async function sellProduct() {

    const id = document.getElementById("sell_id").value
    const cubes = document.getElementById("sell_cubes").value

    const response = await fetch("/sell", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            product_id: Number(id),
            cubes: Number(cubes)
        })
    })

    const result = await response.json()

    alert(JSON.stringify(result))

    loadProducts()
}


loadProducts()