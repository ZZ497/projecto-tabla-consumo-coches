// ============================================
// MODELO - Gestión de datos y localStorage
// ============================================

const Modelo = {
  // Recuperar los coches del localStorage o inicializar con datos por defecto
  obtenerCoches() {
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
      id: coche.id || this.generarId(),
      modelo: coche.modelo || "",
      consumo: coche.consumo || 0,
      categoria: String(coche.categoria || "")
    }));

    return coches;
  },

  // Guardar los coches en la base de datos local
  guardarCoches(coches) {
    localStorage.setItem("coches", JSON.stringify(coches));
  },

  // Generar simple de id único
  generarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  },

  // Validar que el modelo no esté repetido
  existeModelo(coches, modelo) {
    return coches.some(c => c.modelo.toLowerCase() === modelo.toLowerCase());
  },

  // Crear nuevo coche con normalización de consumo a dos decimales
  crearCoche(modelo, consumo, categoria) {
    return {
      id: this.generarId(),
      modelo,
      consumo: Number(consumo.toFixed(2)),
      categoria
    };
  },

  // Eliminar coche por id del array
  eliminarCochePorId(coches, id) {
    return coches.filter(c => c.id !== id);
  },

  // Buscar coche por id y devolver el coche con su índice
  buscarCochePorId(coches, id) {
    const indice = coches.findIndex(c => c.id === id);
    // Mostrar error si hay un id negativo
    if (indice === -1) return null;
    return { coche: coches[indice], indice };
  },

  // Ordenar coches por categoría manteniendo las posiciones de otras categorías
  ordenarPorCategoria(coches, categoria, ascendente) {
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
      return ascendente ? a.consumo - b.consumo : b.consumo - a.consumo;
    });

    // Reemplazar los coches en sus posiciones originales
    indicesCategoria.forEach((indiceOriginal, i) => {
      coches[indiceOriginal] = cochesCategoria[i];
    });

    return coches;
  },

  // Obtener preferencia de modo oscuro guardada
  obtenerModoOscuro() {
    return localStorage.getItem("modoOscuro");
  },

  // Guardar preferencia en la base de datos local
  guardarModoOscuro(activo) {
    localStorage.setItem("modoOscuro", activo);
  }
};

// ============================================
// VISTA - Manipulación del DOM
// ============================================

const Vista = {
  // Seleccionar las partes del formulario y elementos del DOM
  elementos: {
    modeloFormulario: document.querySelector("#name"),
    consumoFormulario: document.querySelector("#consumo"),
    categoriaFormulario: document.getElementById("categoria"),
    form: document.querySelector("form"),
    mensaje: document.querySelector("#mensaje"),
    // Seleccionar los tbody de cada tabla
    tbodySuv: document.querySelector("#tabla-suv tbody"),
    tbodyCompacto: document.querySelector("#tabla-compacto tbody"),
    tbodyUtilitario: document.querySelector("#tabla-utilitario tbody"),
    // Seleccionar el toggle
    toggleModo: document.getElementById("modoOscuroToggle"),
    // Seleccionar el texto del modo
    textoModo: document.getElementById("modoTexto")
  },

  // Limpiar el formulario
  limpiarFormulario() {
    this.elementos.modeloFormulario.value = "";
    this.elementos.consumoFormulario.value = "";
    this.elementos.categoriaFormulario.value = "";
  },

  // Función para mostrar mensajes temporales
  mostrarMensaje(texto, tipo) {
    // Seleccionar el mensaje
    const mensaje = this.elementos.mensaje;
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
  },

  // Función para mostrar mensaje con opción de deshacer
  mostrarMensajeConUndo(texto, onUndo, duracion = 4000) {
    const mensaje = this.elementos.mensaje;
    mensaje.innerHTML = ''; // limpiar
    mensaje.textContent = texto; // establecer texto

    // Crear botón undo
    const undoBtn = document.createElement("button");
    undoBtn.className = "undo"; // clase para estilos
    undoBtn.textContent = "Deshacer"; // texto del botón

    // Manejar click en deshacer
    undoBtn.addEventListener("click", onUndo);

    // Añadir botón dentro del mensaje
    mensaje.appendChild(undoBtn);
    mensaje.classList.add("mostrar");

    // Ocultar el mensaje al terminar duración (si aún está)
    setTimeout(() => {
      mensaje.classList.remove("mostrar");
      // Si no se hizo undo, la eliminación ya quedará confirmada por el timeout de eliminarCoche()
    }, duracion);
  },

  // Renderizar todas las tablas desde el array actualizado
  renderCoches(coches) {
    // Asegurar que el array coches siempre existe y es un array válido
    if (!Array.isArray(coches)) {
      // Crear un nuevo array si no existe
      coches = [];
    }

    // Limpiar filas existentes
    [this.elementos.tbodySuv, this.elementos.tbodyCompacto, this.elementos.tbodyUtilitario].forEach(tbody => {
      if (tbody) tbody.innerHTML = "";
    });

    // Recorrer el array y renderizar cada coche
    coches.forEach(coche => {
      // Validar que tenga datos válidos antes de pintarlo
      if (!coche.modelo || isNaN(coche.consumo) || !coche.categoria) return;
      
      this.renderCoche(coche);
    });
  },

  // Renderizar un coche individual en su tabla correspondiente
  renderCoche(coche) {
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
    if (cat === "suv" && this.elementos.tbodySuv) {
      this.elementos.tbodySuv.appendChild(fila);
    } else if (cat === "compacto" && this.elementos.tbodyCompacto) {
      this.elementos.tbodyCompacto.appendChild(fila);
    } else if (cat === "utilitario" && this.elementos.tbodyUtilitario) {
      this.elementos.tbodyUtilitario.appendChild(fila);
    }
  },

  // Marcar la fila visualmente si existe
  marcarFilaEliminando(id) {
    const btn = document.querySelector(`.btn-eliminar[data-id="${id}"]`);
    // Mostrar la fila si el botón existe y si no, ponerlo a nulo
    const fila = btn ? btn.closest("tr") : null;
    // Si fila es verdadero, mostrar eliminado
    if (fila) {
      fila.classList.add("eliminando");
    }
  },

  // Actualizar la flecha del botón
  actualizarIconoOrden(categoria, ascendente) {
    const boton = document.querySelector(`.ordenar[data-categoria="${categoria}"]`);
    if (!boton) return;
    
    const img = boton.querySelector("img");
    img.src = ascendente
      ? "./img/flecha-hacia-arriba.png"
      : "./img/flecha-hacia-abajo.png";
  },

  // Aplicar estilos y estado del modo oscuro
  aplicarModoOscuro(activo) {
    if (activo) {
      // Se añade la clase de modo oscuro
      document.body.classList.add("modo-oscuro");
      // Se valida el toggle
      this.elementos.toggleModo.checked = true;
      // Se pone el texto del span en "Modo oscuro"
      this.elementos.textoModo.textContent = "Modo oscuro";
    } else {
      document.body.classList.remove("modo-oscuro");
      this.elementos.toggleModo.checked = false;
      this.elementos.textoModo.textContent = "Modo claro";
    }
  }
};

// ============================================
// CONTROLADOR - Lógica de la aplicación
// ============================================

const Controlador = {
  coches: [],
  // Objeto para saber el estado de orden por categoría
  ordenAscendente: { utilitario: true, compacto: true, suv: true },
  // Variable que indica si el coche es el último eliminado
  ultimoEliminado: null,
  // Variable que indica si el tiempo del undo ha pasado
  undoTimeoutId: null,

  // Inicializar la aplicación
  init() {
    this.coches = Modelo.obtenerCoches();
    // Guardar los coches en la base de datos local
    Modelo.guardarCoches(this.coches);
    // Mostrar la tabla
    Vista.renderCoches(this.coches);
    this.configurarEventos();
    this.configurarModoOscuro();
  },

  // Configurar todos los event listeners
  configurarEventos() {
    // Manejar el envío del formulario
    // Evento en el formulario
    Vista.elementos.form.addEventListener("submit", (e) => this.manejarSubmit(e));

    // Agregar listeners a todos los botones de ordenar
    document.querySelectorAll(".ordenar").forEach(boton => {
      // Evento al pulsar el botón
      boton.addEventListener("click", () => this.ordenarPorConsumo(boton));
    });

    // Delegación de eventos para eliminar coches
    document.addEventListener("click", (e) => this.manejarEliminacion(e));

    // Cambiar modo al pulsar
    Vista.elementos.toggleModo.addEventListener("change", () => this.cambiarModoOscuro());
  },

  // Manejar el envío del formulario
  manejarSubmit(event) {
    // Prevenir el envío del formulario
    event.preventDefault();

    // Obtener los valores del formulario
    const modelo = Vista.elementos.modeloFormulario.value.trim();
    
    // Comprobar si hay un modelo repetido
    if (Modelo.existeModelo(this.coches, modelo)) {
      Vista.mostrarMensaje("Modelo repetido", "error");
      return;
    }

    // Poner comas en los consumos
    let consumo = parseFloat(Vista.elementos.consumoFormulario.value.trim().replace(",", "."));
    // Seleccionar la categoría y ponerla en minúscula
    const categoria = Vista.elementos.categoriaFormulario.value.trim().toLowerCase();

    // Validar el modelo
    if (modelo === "") {
      Vista.mostrarMensaje("Por favor, introduce un modelo de coche.", "error");
      return;
    }

    // Validar el consumo
    if (isNaN(consumo) || consumo < 0) {
      Vista.mostrarMensaje("Por favor, introduce un consumo válido.", "error");
      return;
    }

    // Validar la categoría
    if (!["suv", "compacto", "utilitario"].includes(categoria)) {
      Vista.mostrarMensaje("Por favor, selecciona una categoría válida.", "error");
      return;
    }

    // Crear el nuevo coche
    const nuevoCoche = Modelo.crearCoche(modelo, consumo, categoria);

    // Añadir el coche al array principal
    this.coches.push(nuevoCoche);

    // Guardar en localStorage
    Modelo.guardarCoches(this.coches);

    // Renderizar todas las tablas desde el array actualizado
    Vista.renderCoches(this.coches);

    // Limpiar el formulario
    Vista.limpiarFormulario();

    // Mostrar mensaje de éxito
    Vista.mostrarMensaje(`El modelo ${modelo} ha sido añadido a la tabla.`, "exito");
  },

  // Ordenar por consumo individualmente por categoría
  ordenarPorConsumo(boton) {
    // Buscar la categoría
    const categoria = boton.getAttribute("data-categoria");

    // Ordenar coches de la categoría
    this.coches = Modelo.ordenarPorCategoria(
      this.coches,
      categoria,
      this.ordenAscendente[categoria]
    );

    // Cambiar el estado para la próxima pulsación
    this.ordenAscendente[categoria] = !this.ordenAscendente[categoria];

    // Actualizar la flecha del botón
    Vista.actualizarIconoOrden(categoria, this.ordenAscendente[categoria]);

    // Guardar en localStorage y mostrar filas
    Modelo.guardarCoches(this.coches);
    Vista.renderCoches(this.coches);

    // Mostrar mensaje
    Vista.mostrarMensaje(`Tabla ${categoria.toUpperCase()} ordenada por consumo.`, "exito");
  },

  // Manejar eliminación de coches
  manejarEliminacion(e) {
    // Buscar el botón más cercano al clic que tenga la clase .btn-eliminar
    const btn = e.target.closest(".btn-eliminar");
    if (!btn) return; // si no hay botón, se sale

    // Obtener el ID del coche del atributo data-id
    const id = btn.dataset.id;
    if (!id) return;

    // Ejecutar la función de eliminación
    this.eliminarCoche(id);
  },

  // Función que elimina un coche por su id
  eliminarCoche(id) {
    // Mostrar error si no hay id
    if (!id) return;

    // Buscar el índice del coche
    const resultado = Modelo.buscarCochePorId(this.coches, id);
    if (!resultado) return;

    // Referencia al objeto y al tr correspondiente
    const { coche, indice } = resultado;

    // Marcar la fila visualmente
    Vista.marcarFilaEliminando(id);

    // Guardar temporalmente el coche eliminado para posible undo
    this.ultimoEliminado = { coche, indice };

    // Quitar temporalmente del array y re-renderizar para que no aparezca
    this.coches = Modelo.eliminarCochePorId(this.coches, id);
    Vista.renderCoches(this.coches);

    // Mostrar mensaje con opción "Deshacer"
    Vista.mostrarMensajeConUndo(
      `Coche ${coche.modelo} eliminado.`,
      () => this.deshacerEliminacion(),
      4000
    );

    // Programar la "confirmación" definitiva (si no se deshace)
    clearTimeout(this.undoTimeoutId);
    this.undoTimeoutId = setTimeout(() => {
      // Confirmación definitiva: guardar en localStorage y limpiar temporal
      Modelo.guardarCoches(this.coches);
      // Poner las variables temporales en null, ya que se ha realizado el borrado
      this.ultimoEliminado = null;
      this.undoTimeoutId = null;
      // Mostrar mensaje final
      Vista.mostrarMensaje('Eliminación confirmada', 'exito');
    }, 4000);
  },

  // Deshacer eliminación
  deshacerEliminacion() {
    // Si hay undo programado, cancelar
    if (this.undoTimeoutId) {
      clearTimeout(this.undoTimeoutId);
      // Cancelar el undo
      this.undoTimeoutId = null;
    }

    // Reinsertar el coche en su posición original
    if (this.ultimoEliminado) {
      this.coches.splice(this.ultimoEliminado.indice, 0, this.ultimoEliminado.coche); // reinsertar
      // Guardar y mostrar la tabla de coches con el valor reinsertado
      Modelo.guardarCoches(this.coches);
      Vista.renderCoches(this.coches);
      Vista.mostrarMensaje(`Se ha recuperado ${this.ultimoEliminado.coche.modelo}`, "exito");
      // Poner la variable en nulo, ya que se ha cancelado la operación
      this.ultimoEliminado = null;
    }
  },

  // Configurar modo oscuro
  configurarModoOscuro() {
    // Comprobar preferencia guardada
    const modoGuardado = Modelo.obtenerModoOscuro();
    
    // Si el modo es verdadero, se pone el modo oscuro
    if (modoGuardado === "true") {
      Vista.aplicarModoOscuro(true);
    } else if (modoGuardado === null) {
      // Detectar el modo del sistema por defecto
      // Detectar si la ventana es oscura, ponerla en modo oscuro
      const sistemaOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
      // Si no hay modo guardado y el sistema del usuario es oscuro, añadir la clase de modo oscuro y poner el toggle a verdadero
      if (sistemaOscuro) {
        Vista.aplicarModoOscuro(true);
      }
    }
  },

  // Cambiar modo oscuro
  cambiarModoOscuro() {
    // Se selecciona el modo oscuro
    document.body.classList.toggle("modo-oscuro");
    // Crear una variable que contenga el estado del modo oscuro (boolean)
    const modoActivo = document.body.classList.contains("modo-oscuro");
    // Cambiar si está el modo oscuro activo o no
    Vista.elementos.textoModo.textContent = modoActivo ? "Modo oscuro" : "Modo claro";

    // Guardar preferencia en la base de datos local
    Modelo.guardarModoOscuro(modoActivo);
  }
};

// Inicializar la aplicación cuando el DOM esté listo
Controlador.init();