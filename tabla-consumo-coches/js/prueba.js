// Seleccionar las partes del formulario
const modeloFormulario = document.querySelector("#name");
const consumoFormulario = document.querySelector("#consumo");



// Seleccionar las tablas de cada categoría
const tablaUtilitario = document.querySelector("#tabla-utilitario");
const tablaCompacto = document.querySelector("#tabla-compacto");
const tablaSuv = document.querySelector("#tabla-suv");

// Recuperar los coches del localStorage o inicializar con datos por defecto
    let coches = JSON.parse(localStorage.getItem("coches")) || [
    { modelo: "Ford Puma", consumo: 6.35, categoria: "suv" },
    { modelo: "Nissan Qashqai", consumo: 7.89, categoria: "suv" },
    { modelo: "Peugeot 2008", consumo: 8.22, categoria: "suv" },
    { modelo: "Toyota Corolla", consumo: 5.40, categoria: "compacto" },
    { modelo: "Honda Civic", consumo: 6.58, categoria: "compacto" },
    { modelo: "Mazda 3", consumo: 6.42, categoria: "compacto" },
    { modelo: "Renault Clio", consumo: 5.2, categoria: "utilitario" },
    { modelo: "Opel Corsa", consumo: 5.1, categoria: "utilitario" },
    { modelo: "Peugeot 208", consumo: 4.6, categoria: "utilitario" }
];

// Limpiar cualquier dato corrupto del localStorage
coches = coches.map(coche => ({
    modelo: coche.modelo || "",
    consumo: coche.consumo || 0,
    categoria: String(coche.categoria || "")
}));

// Manejar el envío del formulario
const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  // Prevenir el envío del formulario
  event.preventDefault();

  // Obtener los valores del formulario
  const modelo = modeloFormulario.value.trim();
  let consumo = parseFloat(consumoFormulario.value.trim().replace(",", "."));
  const categoria = document.getElementById("categoria").value.trim().toLowerCase();

  // Validar el modelo
  if (modelo === "") {
    mostrarMensaje("Por favor, introduce un modelo de coche.", "error");
    return;
  }

  // Validar el consumo
  if (isNaN(consumo) || consumo < 0) {
    mostrarMensaje("Por favor, introduce un consumo válido.", "error");
    return;
  }

  // Validar la categoría
  if (!["suv", "compacto", "utilitario"].includes(categoria)) {
    mostrarMensaje("Por favor, selecciona una categoría válida.", "error");
    return;
  }

  // Normalizar el valor del consumo a dos decimales
  consumo = Number(consumo.toFixed(2));

  // Crear el nuevo coche
  const nuevoCoche = { modelo, consumo, categoria };

  // Añadirlo al array principal
  coches.push(nuevoCoche);

  // Guardar en localStorage
  localStorage.setItem("coches", JSON.stringify(coches));

  // Renderizar todas las tablas desde el array actualizado
  renderCoches();

  // Limpiar el formulario
  modeloFormulario.value = "";
  consumoFormulario.value = "";
  document.getElementById("categoria").value = "";

  // Mostrar mensaje de éxito
  mostrarMensaje(`El modelo ${modelo} ha sido añadido a la tabla.`, "exito");
});


// Función para mostrar mensajes temporales
function mostrarMensaje(texto,tipo) {
    const mensaje = document.querySelector("#mensaje");
    mensaje.textContent = texto;
    mensaje.style.backgroundColor = 
    tipo === "error" ? "rgba(200, 0, 0, 0.95)" : "rgba(0, 200, 0, 0.95)";
    mensaje.classList.add("mostrar");

// Animación que dura 3 segundos    
    setTimeout(() => {
        mensaje.classList.remove("mostrar");
    }, 3000);
}
function renderCoches() {
    // Asegurar que el array coches siempre existe y es un array válido
    if (!Array.isArray(coches)) {
        coches = [];
        localStorage.setItem("coches", JSON.stringify([]));
    }

    // Seleccionar los tbody de cada tabla
    const tbodySuv = document.querySelector("#tabla-suv tbody");
    const tbodyCompacto = document.querySelector("#tabla-compacto tbody");
    const tbodyUtilitario = document.querySelector("#tabla-utilitario tbody");

    // Limpiar filas existentes
    [tbodySuv, tbodyCompacto, tbodyUtilitario].forEach(tbody => {
        if (tbody) tbody.innerHTML = "";
    });

    // Recorrer el array y renderizar cada coche
    coches.forEach(coche => {
        // Validar que tenga datos válidos antes de pintarlo
        if (!coche.modelo || isNaN(coche.consumo) || !coche.categoria) return;

        const fila = document.createElement("tr");

        const celdaModelo = document.createElement("td");
        celdaModelo.textContent = coche.modelo;

        const celdaConsumo = document.createElement("td");
        celdaConsumo.textContent = Number(coche.consumo)
            .toFixed(2)
            .replace(".", ",");

        fila.appendChild(celdaModelo);
        fila.appendChild(celdaConsumo);

        // Añadir la fila según categoría
        const cat = String(coche.categoria).toLowerCase();
        if (cat === "suv" && tbodySuv) tbodySuv.appendChild(fila);
        else if (cat === "compacto" && tbodyCompacto) tbodyCompacto.appendChild(fila);
        else if (cat === "utilitario" && tbodyUtilitario) tbodyUtilitario.appendChild(fila);
    });
}
renderCoches();

// Ordenar por consumo individualmente por categoría 

// Objeto para saber el estado de orden por categoría
let ordenAscendente = { utilitario: true, compacto: true, suv: true };

// Agregar listeners a todos los botones de ordenar
document.querySelectorAll(".ordenar").forEach(boton => {
  boton.addEventListener("click", () => {
    const categoria = boton.getAttribute("data-categoria");

    // Crear un índice para saber qué posiciones ocupan los coches de esta categoría
    let indicesCategoria = [];
    coches.forEach((c, index) => {
      if (c.categoria === categoria) {
        indicesCategoria.push(index);
      }
    });

    // Extraer y ordenar solo los coches de esa categoría
    let cochesCategoria = indicesCategoria.map(i => coches[i]);
    
    cochesCategoria.sort((a, b) => {
      return ordenAscendente[categoria]
        ? a.consumo - b.consumo
        : b.consumo - a.consumo;
    });

    // Cambiar el estado para la próxima pulsación
    ordenAscendente[categoria] = !ordenAscendente[categoria];

    // Actualizar la flecha del botón
    const img = boton.querySelector("img");
    img.src = ordenAscendente[categoria]
      ? "./img/flecha-hacia-arriba.png"
      : "./img/flecha-hacia-abajo.png";

    // Reemplazar los coches en sus posiciones originales
    indicesCategoria.forEach((indiceOriginal, i) => {
      coches[indiceOriginal] = cochesCategoria[i];
    });

    // Guardar en localStorage y renderizar filas
    localStorage.setItem("coches", JSON.stringify(coches));
    renderCoches();

    // Mostrar mensaje
    mostrarMensaje(`Tabla ${categoria.toLocaleUpperCase()} ordenada por consumo.`, "exito");
  });
});

// Modo oscuro
const toggleModo = document.getElementById("modoOscuroToggle");
const textoModo = document.getElementById("modoTexto");

// Comprobar preferencia guardada
const modoGuardado = localStorage.getItem("modoOscuro");
if (modoGuardado === "true") {
  document.body.classList.add("modo-oscuro");
  toggleModo.checked = true;
  textoModo.textContent = "Modo oscuro";
}

// Cambiar modo al pulsar
toggleModo.addEventListener("change", () => {
  document.body.classList.toggle("modo-oscuro");

  const modoActivo = document.body.classList.contains("modo-oscuro");
  textoModo.textContent = modoActivo ? "Modo oscuro" : "Modo claro";

  // Guardar preferencia
  localStorage.setItem("modoOscuro", modoActivo);
});
