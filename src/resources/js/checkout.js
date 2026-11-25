import { obtenerCarrito, calcularTotal, vaciarCarrito } from './carrito.js';
import { normalizarDatosComprador, validarDatosComprador, armarPedido } from './pedido.js';
import { enviarResumenCompra } from './email.js';
import {
    renderizarResumenCheckout,
    mostrarErroresFormulario,
    mostrarEstadoCheckout,
    mostrarConfirmacion
} from './render.js';

const formulario = document.getElementById('formulario-checkout');
const botonConfirmar = document.getElementById('boton-confirmar');

async function manejarEnvio(evento) {
    evento.preventDefault();

    const items = obtenerCarrito();
    if (items.length === 0) {
        mostrarEstadoCheckout('Tu carrito está vacío.', 'error');
        return;
    }

    const datos = normalizarDatosComprador(Object.fromEntries(new FormData(formulario)));
    const errores = validarDatosComprador(datos);
    mostrarErroresFormulario(errores);
    if (Object.keys(errores).length > 0) return;

    const pedido = armarPedido(datos, items, calcularTotal());

    botonConfirmar.disabled = true;
    mostrarEstadoCheckout('Enviando el resumen de tu compra...');

    const enviado = await enviarResumenCompra(pedido);

    if (!enviado) {
        mostrarEstadoCheckout('No pudimos enviar el mail. Intentá nuevamente.', 'error');
        botonConfirmar.disabled = false;
        return;
    }

    vaciarCarrito();
    mostrarConfirmacion(pedido);
}

function iniciarCheckout() {
    const items = obtenerCarrito();

    renderizarResumenCheckout(items, calcularTotal());

    if (items.length === 0) {
        botonConfirmar.disabled = true;
        return;
    }

    formulario.addEventListener('submit', manejarEnvio);
}

iniciarCheckout();