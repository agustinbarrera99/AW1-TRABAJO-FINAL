const REGEX_DNI = /^\d{7,8}$/;
const REGEX_NOMBRE = /^\p{L}[\p{L}'.-]*(?: \p{L}[\p{L}'.-]*)+$/u;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LARGO_MAXIMO_NOMBRE = 80;

const generarNumeroPedido = () => `DT-${Date.now().toString(36).toUpperCase()}`;

export const normalizarDatosComprador = ({ dni = '', nombre = '', email = '' }) => ({
    dni: dni.replace(/[.\s]/g, ''),
    nombre: nombre.trim().replace(/\s+/g, ' '),
    email: email.trim().toLowerCase()
});

export function validarDatosComprador({ dni, nombre, email }) {
    const errores = {};

    if (!REGEX_DNI.test(dni)) {
        errores.dni = 'Ingresá un DNI válido (7 u 8 dígitos, sin puntos).';
    }

    if (!REGEX_NOMBRE.test(nombre) || nombre.length > LARGO_MAXIMO_NOMBRE) {
        errores.nombre = 'Ingresá tu nombre y apellido completos.';
    }

    if (!REGEX_EMAIL.test(email)) {
        errores.email = 'Ingresá un email válido.';
    }

    return errores;
}

export function armarPedido(comprador, items, total) {
    return {
        numero: generarNumeroPedido(),
        fecha: new Date().toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }),
        comprador,
        items: items.map(item => ({ ...item, subtotal: item.precio * item.cantidad })),
        total
    };
}