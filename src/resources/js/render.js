import { formatearPrecio } from './utilidades.js';

const ID_PANEL = 'panel-carrito';
const ID_FONDO = 'fondo-carrito';
const ID_CONTADOR = 'contador-carrito';
const SELECTOR_BOTON_CARRITO = '[data-abrir-carrito]';
const IDS_CHECKOUT = {
    cuerpo: 'checkout-cuerpo',
    total: 'checkout-total',
    tabla: 'checkout-tabla',
    vacio: 'checkout-vacio',
    estado: 'estado-checkout',
    seccionDatos: 'seccion-datos',
    seccionResumen: 'seccion-resumen',
    confirmacion: 'confirmacion'
};

const CAMPOS_FORMULARIO = ['dni', 'nombre', 'email'];

export function renderizarMensaje(contenedor, texto, clase = 'sin-productos') {
    if (!contenedor) return;
    contenedor.innerHTML = `<p class="${clase}">${texto}</p>`;
}

export function renderizadoProductos(contenedor, productos) {
    if (!contenedor) return;

    if (productos.length === 0) {
        renderizarMensaje(contenedor, 'No se encontraron productos para tu búsqueda.');
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
}

export function renderizarDetalle(producto) {
    document.title = `DoctaTech - ${producto.nombre}`;
    document.getElementById('nombre-producto').textContent = producto.nombre;

    const imagen = document.getElementById('imagen-producto');
    imagen.src = producto.imagen;
    imagen.alt = producto.nombre;

    document.getElementById('precio-producto').textContent = formatearPrecio(producto.precio);
    document.getElementById('descripcion-producto').textContent = producto.descripcion;
}

export function renderCarrito(items, unidades, total) {
    const panel = document.getElementById(ID_PANEL);
    const botonCarrito = document.querySelector(SELECTOR_BOTON_CARRITO);
    const contador = document.getElementById(ID_CONTADOR);

    if (!panel) return;

    const estaVacio = items.length === 0;

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
    items.forEach(item => {
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

export function alternarPanel(abrir) {
    const panel = document.getElementById(ID_PANEL);
    const fondo = document.getElementById(ID_FONDO);
    const botonCarrito = document.querySelector(SELECTOR_BOTON_CARRITO);

    if (!panel) return;

    const estadoAbierto = typeof abrir === 'boolean' ? abrir : !panel.classList.contains('abierto');
    panel.classList.toggle('abierto', estadoAbierto);
    fondo?.classList.toggle('abierto', estadoAbierto);
    botonCarrito?.setAttribute('aria-expanded', String(estadoAbierto));
    document.body.classList.toggle('carrito-abierto', estadoAbierto);
}

export function renderizarResumenCheckout(items, total) {
    const estaVacio = items.length === 0;

    document.getElementById(IDS_CHECKOUT.vacio).hidden = !estaVacio;
    document.getElementById(IDS_CHECKOUT.tabla).hidden = estaVacio;

    if (estaVacio) return;

    let filasHTML = '';
    items.forEach(item => {
        filasHTML += `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.cantidad}</td>
                <td>${formatearPrecio(item.precio)}</td>
                <td>${formatearPrecio(item.precio * item.cantidad)}</td>
            </tr>
        `;
    });

    document.getElementById(IDS_CHECKOUT.cuerpo).innerHTML = filasHTML;
    document.getElementById(IDS_CHECKOUT.total).textContent = formatearPrecio(total);
}

export function mostrarErroresFormulario(errores) {
    CAMPOS_FORMULARIO.forEach(campo => {
        const error = errores[campo] ?? '';
        document.getElementById(`error-${campo}`).textContent = error;
        document.getElementById(campo).setAttribute('aria-invalid', String(Boolean(error)));
    });

    const primerCampoConError = CAMPOS_FORMULARIO.find(campo => errores[campo]);
    document.getElementById(primerCampoConError)?.focus();
}

export function mostrarEstadoCheckout(texto, tipo = '') {
    const estado = document.getElementById(IDS_CHECKOUT.estado);
    estado.textContent = texto;
    estado.className = `estado-checkout ${tipo}`.trim();
}

export function mostrarConfirmacion(pedido) {
    const confirmacion = document.getElementById(IDS_CHECKOUT.confirmacion);

    document.getElementById(IDS_CHECKOUT.seccionDatos).hidden = true;
    document.getElementById(IDS_CHECKOUT.seccionResumen).hidden = true;

    confirmacion.querySelector('#confirmacion-numero').textContent = pedido.numero;
    confirmacion.querySelector('#confirmacion-email').textContent = pedido.comprador.email;
    confirmacion.hidden = false;
    confirmacion.focus();
}