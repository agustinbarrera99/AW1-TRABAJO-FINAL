import { RUTA_PRODUCTOS, CLAVE_PRODUCTOS } from './constantes.js';
import { guardarEnStorage, leerDeStorage } from './storage.js';

export async function obtenerProductos() {
    try {
        const respuesta = await fetch(RUTA_PRODUCTOS);
        if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);

        const productos = await respuesta.json();
        guardarEnStorage(CLAVE_PRODUCTOS, productos); 
        return productos;
    } catch (error) {
        console.error('No se pudieron obtener los productos:', error);
        return leerDeStorage(CLAVE_PRODUCTOS, []);
    }
}

export function filtrarProductos(productos, criterio) {
    const busqueda = criterio.trim().toLowerCase();
    if (!busqueda) return productos;
    return productos.filter(producto => producto.nombre.toLowerCase().includes(busqueda));
}

export const buscarProductoPorId = (productos, id) => productos.find(item => item.id === id);