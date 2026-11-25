import { formatearPrecio, escaparHTML } from './utilidades.js';

const ESTILO_CELDA = 'padding:8px;border-bottom:1px solid #dde3e9;text-align:left;';
const ESTILO_ENCABEZADO = 'padding:8px;border-bottom:2px solid #1d6fb8;text-align:left;';

function construirResumenHTML(pedido) {
    const filas = pedido.items.map(item => `
        <tr>
            <td style="${ESTILO_CELDA}">${escaparHTML(item.nombre)}</td>
            <td style="${ESTILO_CELDA}">${item.cantidad}</td>
            <td style="${ESTILO_CELDA}">${formatearPrecio(item.precio)}</td>
            <td style="${ESTILO_CELDA}">${formatearPrecio(item.subtotal)}</td>
        </tr>
    `).join('');

    return `
        <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
            <thead>
                <tr>
                    <th style="${ESTILO_ENCABEZADO}">Producto</th>
                    <th style="${ESTILO_ENCABEZADO}">Cant.</th>
                    <th style="${ESTILO_ENCABEZADO}">Precio</th>
                    <th style="${ESTILO_ENCABEZADO}">Subtotal</th>
                </tr>
            </thead>
            <tbody>${filas}</tbody>
        </table>
    `;
}

export async function enviarResumenCompra(pedido) {
    const cuerpo = {
        service_id: EMAILJS.serviceId,
        template_id: EMAILJS.templateId,
        user_id: EMAILJS.publicKey,
        template_params: {
            numero_pedido: pedido.numero,
            fecha: pedido.fecha,
            nombre: pedido.comprador.nombre,
            dni: pedido.comprador.dni,
            email: pedido.comprador.email,
            resumen_html: construirResumenHTML(pedido),
            total: formatearPrecio(pedido.total)
        }
    };

    try {
        const respuesta = await fetch(EMAILJS.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cuerpo)
        });

        if (!respuesta.ok) {
            throw new Error(`EmailJS respondió ${respuesta.status}: ${await respuesta.text()}`);
        }

        return true;
    } catch (error) {
        console.error('No se pudo enviar el mail de resumen:', error);
        return false;
    }
}