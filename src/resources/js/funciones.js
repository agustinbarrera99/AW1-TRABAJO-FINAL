import { productos as catalogo } from './productos.js';

const formatearPrecio = valor => `$${valor.toLocaleString('es-AR')}`;

const renderizadoProductos = (contenedor, productos) => {
    if (!contenedor) return;

    if (productos.length === 0) {
        contenedor.innerHTML = '<p class="sin-productos">No se encontraron productos para tu búsqueda.</p>';
        return;
    }

    let productosHTML = '';
    productos.forEach(producto => {
        productosHTML += `
            <article class="producto">
                <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy" />
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p class="precio">${formatearPrecio(producto.precio)}</p>
                <span class="stock">Stock disponible</span>
                <div class="producto-acciones">
                    <a class="boton boton-secundario" href="producto.html?id=${producto.id}">Ver detalle</a>
                    <button class="boton" type="button" data-agregar-id="${producto.id}" aria-label="Agregar ${producto.nombre} al carrito">Agregar</button>
                </div>
            </article>
        `;
    });
    contenedor.innerHTML = productosHTML;
};

function filtrarProductos(productos, criterio) {
    const busqueda = criterio.trim().toLowerCase();
    if (!busqueda) return productos;
    return productos.filter(producto => producto.nombre.toLowerCase().includes(busqueda));
}

const productosSeleccionados = [];

const buscarProducto = id => catalogo.find(item => item.id === id);

const calcularUnidades = () => productosSeleccionados.reduce((acc, item) => acc + item.cantidad, 0);

const calcularTotal = () => productosSeleccionados.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

function agregarAlCarrito(id, cantidad = 1) {
    const producto = buscarProducto(id);
    if (!producto) return;

    const item = productosSeleccionados.find(item => item.id === producto.id);
    if (item) {
        item.cantidad += cantidad;
    } else {
        productosSeleccionados.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad
        });
    }

    renderCarrito();
}

function quitarDelCarrito(id) {
    const indice = productosSeleccionados.findIndex(item => item.id === id);
    if (indice !== -1) {
        productosSeleccionados.splice(indice, 1);
        renderCarrito();
    }
}

function renderCarrito() {
    const panel = document.getElementById('panel-carrito');
    const botonCarrito = document.querySelector('[data-abrir-carrito]');
    const contador = document.getElementById('contador-carrito');

    if (!panel) return;

    const unidades = calcularUnidades();
    const total = calcularTotal();
    const estaVacio = productosSeleccionados.length === 0;

    if (contador) {
        contador.textContent = unidades;
        contador.hidden = estaVacio;
    }

    if (botonCarrito) {
        botonCarrito.setAttribute('aria-label', estaVacio ? 'Abrir carrito (vacío)' : `Abrir carrito (${unidades} productos)`);
    }

    panel.querySelector('.carrito-vacio').hidden = !estaVacio;
    panel.querySelector('.contenedor-tabla-carrito').hidden = estaVacio;
    panel.querySelector('.resumen-carrito').hidden = estaVacio;
    panel.querySelector('.accion-finalizar').hidden = estaVacio;

    if (estaVacio) return;

    let filasHTML = '';
    productosSeleccionados.forEach(item => {
        filasHTML += `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.cantidad}</td>
                <td>${formatearPrecio(item.precio)}</td>
                <td class="celda-subtotal">
                    <span>${formatearPrecio(item.precio * item.cantidad)}</span>
                    <button class="boton-eliminar" type="button" data-eliminar-id="${item.id}" aria-label="Quitar ${item.nombre} del carrito">&#10005;</button>
                </td>
            </tr>
        `;
    });

    panel.querySelector('#tabla-carrito-cuerpo').innerHTML = filasHTML;
    panel.querySelector('#total-carrito').textContent = formatearPrecio(total);
    panel.querySelector('.importe-total').textContent = formatearPrecio(total);
}

function alternarPanel(abrir) {
    const panel = document.getElementById('panel-carrito');
    const fondo = document.getElementById('fondo-carrito');
    const botonCarrito = document.querySelector('[data-abrir-carrito]');

    if (!panel) return;

    const estadoAbierto = typeof abrir === 'boolean' ? abrir : !panel.classList.contains('abierto');
    panel.classList.toggle('abierto', estadoAbierto);
    fondo?.classList.toggle('abierto', estadoAbierto);
    botonCarrito?.setAttribute('aria-expanded', String(estadoAbierto));
    document.body.classList.toggle('carrito-abierto', estadoAbierto);
}

function iniciarCarrito() {
    renderCarrito();

    document.querySelector('[data-abrir-carrito]')?.addEventListener('click', () => alternarPanel());
    document.getElementById('fondo-carrito')?.addEventListener('click', () => alternarPanel(false));
    document.querySelectorAll('[data-cerrar-carrito]').forEach(boton => {
        boton.addEventListener('click', () => alternarPanel(false));
    });

    document.addEventListener('keydown', evento => {
        if (evento.key === 'Escape') alternarPanel(false);
    });

    document.addEventListener('click', evento => {
        const botonAgregar = evento.target.closest('[data-agregar-id]');
        if (botonAgregar) {
            agregarAlCarrito(parseInt(botonAgregar.dataset.agregarId, 10), 1);
            return;
        }

        const botonEliminar = evento.target.closest('[data-eliminar-id]');
        if (botonEliminar) {
            quitarDelCarrito(parseInt(botonEliminar.dataset.eliminarId, 10));
        }
    });
}

export {
    renderizadoProductos,
    filtrarProductos,
    formatearPrecio,
    agregarAlCarrito,
    quitarDelCarrito,
    iniciarCarrito
};