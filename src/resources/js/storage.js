export function guardarEnStorage(clave, valor) {
    try {
        localStorage.setItem(clave, JSON.stringify(valor));
        return true;
    } catch (error) {
        console.error(`No se pudo guardar "${clave}" en localStorage:`, error);
        return false;
    }
}

export function leerDeStorage(clave, valorPorDefecto = null) {
    try {
        const dato = localStorage.getItem(clave);
        return dato ? JSON.parse(dato) : valorPorDefecto;
    } catch (error) {
        console.error(`No se pudo leer "${clave}" de localStorage:`, error);
        return valorPorDefecto;
    }
}