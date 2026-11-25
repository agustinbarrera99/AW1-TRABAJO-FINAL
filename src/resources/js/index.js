import {
  obtenerProductos,
  filtrarProductos,
  buscarProductoPorId,
} from "./productos.js";
import {
  obtenerCarrito,
  calcularUnidades,
  calcularTotal,
  agregarAlCarrito,
  quitarDelCarrito,
} from "./carrito.js";
import { RUTA_CHECKOUT } from "./constantes.js";
import {
  renderizadoProductos,
  renderizarMensaje,
  renderizarDetalle,
  renderCarrito,
  alternarPanel,
} from "./render.js";

const contenedorProductos = document.getElementById("contenedor-productos");
const buscador = document.getElementById("buscar-producto");
const nombreProducto = document.getElementById("nombre-producto");

let catalogo = [];

const actualizarCarrito = () =>
  renderCarrito(obtenerCarrito(), calcularUnidades(), calcularTotal());

function irACheckout() {
  if (obtenerCarrito().length === 0) return;
  window.location.href = RUTA_CHECKOUT;
}

function iniciarCarrito() {
  actualizarCarrito();
  document
    .querySelector("[data-abrir-carrito]")
    ?.addEventListener("click", () => alternarPanel());
  document
    .getElementById("fondo-carrito")
    ?.addEventListener("click", () => alternarPanel(false));
  document.querySelectorAll("[data-cerrar-carrito]").forEach((boton) => {
    boton.addEventListener("click", () => alternarPanel(false));
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") alternarPanel(false);
  });

  document.addEventListener("click", (evento) => {
    const botonAgregar = evento.target.closest("[data-agregar-id]");
    if (botonAgregar) {
      const id = parseInt(botonAgregar.dataset.agregarId, 10);
      agregarAlCarrito(buscarProductoPorId(catalogo, id), 1);
      actualizarCarrito();
      return;
    }

    const botonEliminar = evento.target.closest("[data-eliminar-id]");
    if (botonEliminar) {
      quitarDelCarrito(parseInt(botonEliminar.dataset.eliminarId, 10));
      actualizarCarrito();
    }
    if (evento.target.closest(".accion-finalizar")) {
      irACheckout();
    }
  });
}

function iniciarCatalogo() {
  if (!contenedorProductos) return;

  renderizadoProductos(contenedorProductos, catalogo);

  if (!buscador) return;

  buscador.addEventListener("input", () => {
    renderizadoProductos(
      contenedorProductos,
      filtrarProductos(catalogo, buscador.value),
    );
  });

  buscador.form?.addEventListener("submit", (evento) =>
    evento.preventDefault(),
  );
}

function iniciarDetalle() {
  if (!nombreProducto) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);
  const producto = buscarProductoPorId(catalogo, id) ?? catalogo[0];

  renderizarDetalle(producto);

  const formulario = document.querySelector(".detalle-producto form");
  const campoCantidad = document.getElementById("cantidad");

  formulario?.addEventListener("submit", (evento) => {
    evento.preventDefault();
    agregarAlCarrito(producto, parseInt(campoCantidad.value, 10) || 1);
    actualizarCarrito();
  });
}

async function iniciarApp() {
  renderizarMensaje(contenedorProductos, "Cargando productos...", "cargando");

  catalogo = await obtenerProductos();

  iniciarCarrito();

  if (catalogo.length === 0) {
    renderizarMensaje(
      contenedorProductos,
      "No pudimos cargar los productos. Intentá nuevamente más tarde.",
      "error-productos",
    );
    return;
  }

  iniciarCatalogo();
  iniciarDetalle();
}

const formularioContacto = document.getElementById("formulario-contacto");
const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");

formularioContacto?.addEventListener("submit", (event) => {
  event.preventDefault();

  mensajeConfirmacion.hidden = false;

  formularioContacto.reset();
});

iniciarApp();
