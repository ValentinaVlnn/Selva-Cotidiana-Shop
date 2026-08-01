let carrito = [];

try {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];
} catch (error) {
    carrito = [];
    Swal.fire({
        title: "Error",
        text: "No se pudo leer el carrito guardado.",
        icon: "error",
        confirmButtonText: "Aceptar"
    });
}

function imprimirCarrito(carrito) {
    const contenedor = document.getElementById("carrito");
    contenedor.innerHTML = "";

    if (carrito.length === 0) {
        const mensajeVacio = document.createElement("p");
        mensajeVacio.textContent = "Tu carrito esta vacio.";
        contenedor.appendChild(mensajeVacio);
        return;
    }

    for (const item of carrito) {
        const producto = document.createElement("article");
        producto.innerHTML = `
        <img class="producto-imagen" src="${item.imagen}" alt="${item.nombre}">
        <h3>${item.nombre}</h3>
        <p>${item.descripcion}</p>
        <p>${item.precio}</p>
        `;
        contenedor.appendChild(producto);
    }

    const botonFinalizar = document.createElement("button");
    botonFinalizar.className = "card-boton";
    botonFinalizar.textContent = "Finalizar compra";
    botonFinalizar.addEventListener("click", finalizarCompra);
    contenedor.appendChild(botonFinalizar);
}

function finalizarCompra() {
    try {
        localStorage.removeItem("carrito");

        Swal.fire({
            title: "Compra finalizada!",
            text: "Gracias por comprar en La Selva en tu hogar.",
            icon: "success",
            confirmButtonText: "Aceptar"
        }).then(() => {
            imprimirCarrito([]);
        });
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: "No se pudo finalizar la compra.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}

imprimirCarrito(carrito);