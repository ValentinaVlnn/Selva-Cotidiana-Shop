let carrito = [];
let productos = [];
const URL = "../db/data.json";

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

async function obtenerProductos() {
    try {
        const response = await fetch(URL);

        if (!response.ok) {
            throw new Error("No se pudieron cargar los productos");
        }

        const data = await response.json();
        productos = data;
        imprimirProductos(data);
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al cargar los productos.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}

obtenerProductos();
configurarBusquedaPorPrecio();
configurarOrdenAlfabetico();

function imprimirProductos(array) {
    const contenedor = document.getElementById("productos");

    contenedor.innerHTML = "";

    if (array.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.textContent = "No hay productos para ese precio.";
        contenedor.appendChild(mensaje);
        return;
    }

    for (const e of array) {
        const card = document.createElement("article");

        card.innerHTML = `
        <img class="producto-imagen" src="${e.imagen}" alt="${e.nombre}">
        <h3>${e.nombre}</h3>
        <p>${e.descripcion}</p>
        <p>${e.precio}</p>
        <button id="${e.nombre}${e.id}" class="card-boton">Agregar al carrito</button>
        `;
        
        contenedor.appendChild(card);

        const boton = document.getElementById(`${e.nombre}${e.id}`);
        boton.addEventListener("click", () => {
            Swal.fire({
                title: "Agregado!",
                text: "Agregaste el producto al carrito",
                icon: "success",
                confirmButtonText: "Aceptar"
            });
            AgregarAlCarrito(e);
        });
    }
}

function configurarBusquedaPorPrecio() {
    const formulario = document.querySelector("form");

    formulario.addEventListener("submit", (event) => {
        event.preventDefault();

        actualizarProductos(true);
    });
}

function configurarOrdenAlfabetico() {
    const selectorOrden = document.getElementById("orden-productos");

    selectorOrden.addEventListener("change", () => {
        actualizarProductos();
    });
}

function actualizarProductos(mostrarError = false) {
    const productosFiltrados = obtenerProductosFiltrados(mostrarError);

    if (!productosFiltrados) {
        return;
    }

    const productosOrdenados = ordenarProductos(productosFiltrados);
    imprimirProductos(productosOrdenados);
}

function obtenerProductosFiltrados(mostrarError) {
    const inputBusqueda = document.querySelector('input[type="text"]');
    const valorBusqueda = inputBusqueda.value.trim();

    if (!valorBusqueda) {
        return [...productos];
    }

    const precioBuscado = Number(valorBusqueda);

    if (Number.isNaN(precioBuscado)) {
        if (mostrarError) {
            Swal.fire({
                title: "Dato invalido",
                text: "Ingresa un numero para buscar por precio.",
                icon: "warning",
                confirmButtonText: "Aceptar"
            });
        }

        return null;
    }

    return productos.filter((producto) => {
        const precio = Number(producto.precio.replace(/[^\d]/g, ""));
        return precio === precioBuscado;
    });
}

function ordenarProductos(listaProductos) {
    const selectorOrden = document.getElementById("orden-productos");
    const productosOrdenados = [...listaProductos];

    if (selectorOrden.value === "asc") {
        productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (selectorOrden.value === "desc") {
        productosOrdenados.sort((a, b) => b.nombre.localeCompare(a.nombre));
    }

    return productosOrdenados;
}

function AgregarAlCarrito(producto) {
    try {
        carrito.push(producto);
        localStorage.setItem("carrito", JSON.stringify(carrito));
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: "No se pudo guardar el producto en el carrito.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}


