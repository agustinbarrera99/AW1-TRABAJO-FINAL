import { CLAVE_CARRITO } from './constantes.js';
import { guardarEnStorage, leerDeStorage } from './storage.js';

const cargarCarrito = () => {
    const guardado = leerDeStorage(CLAVE_CARRITO, []);
    return Array.isArray(guardado) ? guardado : [];
};

const productosSeleccionados = cargarCarrito();

const guardarCarrito = () => guardarEnStorage(CLAVE_CARRITO, productosSeleccionados);

export const obtenerCarrito = () => [...productosSeleccionados];

export const calcularUnidades = () =>
    productosSeleccionados.reduce((acc, item) => acc + item.cantidad, 0);

export const calcularTotal = () =>
    productosSeleccionados.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

export function agregarAlCarrito(producto, cantidad = 1) {
    if (!producto) return;

    const unidades = Number.isInteger(cantidad) && cantidad > 0 ? cantidad : 1;
    const item = productosSeleccionados.find(item => item.id === producto.id);

    if (item) {
        item.cantidad += unidades;
    } else {
        productosSeleccionados.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: unidades
        });
    }

    guardarCarrito();
}

export function quitarDelCarrito(id) {
    const indice = productosSeleccionados.findIndex(item => item.id === id);
    if (indice === -1) return;

    productosSeleccionados.splice(indice, 1);
    guardarCarrito();
}

export function vaciarCarrito() {
    productosSeleccionados.length = 0;
    guardarCarrito();
}
