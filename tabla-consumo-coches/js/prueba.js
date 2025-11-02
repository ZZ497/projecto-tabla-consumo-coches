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
    id: coche.id || generarId(),
    modelo: coche.modelo || "",
    consumo: coche.consumo || 0,
    categoria: String(coche.categoria || "")
}));
// Guardar los coches en la base de datos local
localStorage.setItem("coches", JSON.stringify(coches));

// Manejar el envío del formulario
const form = document.querySelector("form");

// Evento en el formulario
form.addEventListener("submit", function (event) {
  // Prevenir el envío del formulario
  event.preventDefault();

  // Obtener los valores del formulario
  const modelo = modeloFormulario.value.trim();
  // Comprobar si hay un modelo repetido
  if (coches.some(c => c.modelo.toLowerCase === modelo.toLowerCase)){ 
  mostrarMensaje ("Modelo repetido", "error");
  return;
  }
  // Poner comas en los consumos
  let consumo = parseFloat(consumoFormulario.value.trim().replace(",", "."));
  // Seleccionar la categoría y ponerla en minúscula
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
  const nuevoCoche = { id: generarId(), modelo, consumo, categoria };

  // Añadir el coche al array principal
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
  // Seleccionar el mensaje
    const mensaje = document.querySelector("#mensaje");
    // Pedir al usuario que escriba un texto
    mensaje.textContent = texto;
    // Operador ternario para indicar si es color rojo o verde
    mensaje.style.backgroundColor = 
    tipo === "error" ? "rgba(200, 0, 0, 0.95)" : "rgba(0, 200, 0, 0.95)";
    // Añadir la clase mostrar
    mensaje.classList.add("mostrar");

// Animación que dura 3 segundos    
    setTimeout(() => {
        mensaje.classList.remove("mostrar");
    }, 3000);
}
function renderCoches() {
    // Asegurar que el array coches siempre existe y es un array válido
    if (!Array.isArray(coches)) {
      // Crear un nuevo array si no existe
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
        // Crear una nueva fila
        const fila = document.createElement("tr");
        // Crear una nueva columna y asignar el nombre del modelo a la celda
        const celdaModelo = document.createElement("td");
        celdaModelo.textContent = coche.modelo;
        // Crear una nueva columna y poner el número redondeado a dos y con comas
        const celdaConsumo = document.createElement("td");
        celdaConsumo.textContent = Number(coche.consumo)
            .toFixed(2)
            .replace(".", ",");

      // Celda con botón eliminar
      // Crear una nueva fila
      const celdaAcciones = document.createElement("td");
      // Crear un botón
      const btnEliminar = document.createElement("button");
      // Asignar la clase al botón
      btnEliminar.className = "btn-eliminar";
      // Asignar id del coche en el data-set del botón
      btnEliminar.dataset.id = coche.id;
      // Asignar el atributo de eliminar un coche
      btnEliminar.setAttribute("aria-label", `Eliminar ${coche.modelo}`);
      // Añadir la imagen al botón
      btnEliminar.innerHTML = `<img src="./img/bin.png" alt="" aria-hidden="true" width="16" height="16" />`;

        // Estilo opcional pequeño para no romper CSS existente
        btnEliminar.style.border = "none";
        btnEliminar.style.background = "transparent";
        btnEliminar.style.cursor = "pointer";
        // Añadir el botón de eliminar a la celda
        celdaAcciones.appendChild(btnEliminar);
        // Añadir el modelo a la fila
        fila.appendChild(celdaModelo);
        // Añadir el consumo a la fila
        fila.appendChild(celdaConsumo);
        // Añadir el botón
        fila.appendChild(celdaAcciones);
        // Añadir la fila según categoría
        const cat = String(coche.categoria).toLowerCase();
        if (cat === "suv" && tbodySuv) tbodySuv.appendChild(fila);
        else if (cat === "compacto" && tbodyCompacto) tbodyCompacto.appendChild(fila);
        else if (cat === "utilitario" && tbodyUtilitario) tbodyUtilitario.appendChild(fila);
    });
}
// Mostrar la tabla
renderCoches();

// Ordenar por consumo individualmente por categoría 

// Objeto para saber el estado de orden por categoría
let ordenAscendente = { utilitario: true, compacto: true, suv: true };

// Agregar listeners a todos los botones de ordenar
document.querySelectorAll(".ordenar").forEach(boton => {
  // Evento al pulsar el motón
  boton.addEventListener("click", () => {
    // Buscar la categoría
    const categoria = boton.getAttribute("data-categoria");

    // Crear un índice para saber qué posiciones ocupan los coches de esta categoría
    let indicesCategoria = [];
    coches.forEach((c, index) => {
      // Si un coche coincide con la categoría, se lanza el coche al índice de la categoría
      if (c.categoria === categoria) {
        indicesCategoria.push(index);
      }
    });

    // Extraer y ordenar solo los coches de esa categoría
    let cochesCategoria = indicesCategoria.map(i => coches[i]);
    // Ordenar los coches de mayor a menor con un operador ternario
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

    // Guardar en localStorage y mostrar filas
    localStorage.setItem("coches", JSON.stringify(coches));
    renderCoches();

    // Mostrar mensaje
    mostrarMensaje(`Tabla ${categoria.toLocaleUpperCase()} ordenada por consumo.`, "exito");
  });
});

// Modo oscuro
// Seleccionar el toogle
const toggleModo = document.getElementById("modoOscuroToggle");
// Seleccionar el texto del modo
const textoModo = document.getElementById("modoTexto");

// Comprobar preferencia guardada
const modoGuardado = localStorage.getItem("modoOscuro");
// Si el modo es verdadero, se pone el modo oscuro
if (modoGuardado === "true") {
  // Se añade la clase de modo oscuro
  document.body.classList.add("modo-oscuro");
  // Se valida el toggle
  toggleModo.checked = true;
  // Se pone el texto del span en "Modo oscuro"
  textoModo.textContent = "Modo oscuro";
}

// Cambiar modo al pulsar
toggleModo.addEventListener("change", () => {
  // Se selecciona el modo oscuro 
  document.body.classList.toggle("modo-oscuro");
  // Crear una variable que contenga el estado del modo oscuro (boolean)
  const modoActivo = document.body.classList.contains("modo-oscuro");
  // Cambiar si está el modo oscuro activo o no
  textoModo.textContent = modoActivo ? "Modo oscuro" : "Modo claro";

  // Guardar preferencia en la base de datos local
  localStorage.setItem("modoOscuro", modoActivo);
});

// Detectar el modo del sistema por defecto
// Detectar si la ventana es oscura, ponerla en modo oscuro
const sistemaOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
// Si no hay modo guardado y el sistema del usuario es oscuro, añadir la clase de modo oscuro y poner el toogle a verdadero
if (modoGuardado === null && sistemaOscuro) {
  document.body.classList.add("modo-oscuro");
  toggleModo.checked = true;
}


// Generar simple de id único
function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
// Función que elimina un coche por su id
// Variable que indica si el coche es el último eliminado
let ultimoEliminado = null;
// Variable que indica si el tiempo del undo ha pasado 
let undoTimeoutId = null;

// Mostrar error si no hay id
function eliminarCoche(id) {
  if (!id) {
    return;
}
  // Buscar el índice del coche
  const indice = coches.findIndex(c => c.id === id);
  // Mostrar error si hay un id negativo
  if (indice === -1){
     return;
  }

  // Referencia al objeto y al tr correspondiente
  const coche = coches[indice];

  // Marcar la fila visualmente si existe
  const btn = document.querySelector(`.btn-eliminar[data-id="${id}"]`);
  // Mostar la fila si el botón existe y si no, ponerlo a nulo
  const fila = btn ? btn.closest("tr") : null;
  // Si fila es verdadero, mostrar eliminado
  if (fila) {
    fila.classList.add("eliminando");
  }

  // Guardar temporalmente el coche eliminado para posible undo
  ultimoEliminado = { coche, indice };

  // Quitar temporalmente del array y re-renderizar para que no aparezca
  coches = coches.filter(c => c.id !== id);
  renderCoches();

  // Mostrar mensaje con opción "Deshacer"
  mostrarMensajeConUndo(`Coche ${coche.modelo} eliminado.`, 4000);
  
  // Programar la "confirmación" definitiva (si no se deshace)
  clearTimeout(undoTimeoutId);
  undoTimeoutId = setTimeout(() => {
    // Confirmación definitiva: guardar en localStorage y limpiar temporal
    localStorage.setItem("coches", JSON.stringify(coches));
    // Poner las variables temporales en null, ya que se ha realizado el borrado
    ultimoEliminado = null;
    undoTimeoutId = null;
    // Mostrar mensaje final
    mostrarMensaje('Eliminación confirmada', 'exito');
  }, 4000);
}

// Función para mostrar mensaje con opción de deshacer
function mostrarMensajeConUndo(texto, duracion = 3000) {
  const mensaje = document.querySelector("#mensaje");
  mensaje.innerHTML = ''; // limpiar
  mensaje.textContent = texto; // establecer texto

  // Crear botón undo
  const undoBtn = document.createElement("button");
  undoBtn.className = "undo"; // clase para estilos
  undoBtn.textContent = "Deshacer"; // texto del botón

  // Manejar click en deshacer
  undoBtn.addEventListener("click", () => {
    // Si hay undo programado, cancelar
    if (undoTimeoutId) {
      clearTimeout(undoTimeoutId);
      // Cancelar el undo
      undoTimeoutId = null;
    }
    // Reinsertar el coche en su posición original
    if (ultimoEliminado) {
      coches.splice(ultimoEliminado.indice, 0, ultimoEliminado.coche); // reinsertar
      // Guardar y mostrar la tabla de coches con el valor reinsertado
      localStorage.setItem("coches", JSON.stringify(coches));
      renderCoches();
      mostrarMensaje(`Se ha recuperado ${ultimoEliminado.coche.modelo}`, "exito");
      // Poner la variable en nulo, ya que se ha cancelado la operación
      ultimoEliminado = null;
    }
  });

  // Añadir botón dentro del mensaje
  mensaje.appendChild(undoBtn);
  mensaje.classList.add("mostrar");

  // Ocultar el mensaje al terminar duración (si aún está)
  setTimeout(() => {
    mensaje.classList.remove("mostrar");
    // Si no se hizo undo, la eliminación ya quedará confirmada por el timeout de eliminarCoche()
  }, duracion);
}


// Delegación de eventos para eliminar coches
document.addEventListener("click", function (e) {
  // Buscar el botón más cercano al clic que tenga la clase .btn-eliminar
  const btn = e.target.closest(".btn-eliminar");
  if (!btn) return; // si no hay botón, se sale

  // Obtener el ID del coche del atributo data-id
  const id = btn.dataset.id;
  if (!id) return;

  // Ejecutar la función de eliminación
  eliminarCoche(id);
});