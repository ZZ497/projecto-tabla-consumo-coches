// ============================================
// MODELO - Gestión de datos y localStorage (SIN CAMBIOS ESTRUCTURALES)
// ============================================

const Modelo = {
    // ... (El objeto Modelo se mantiene sin cambios estructurales)
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

    guardarCoches(coches) {
        localStorage.setItem("coches", JSON.stringify(coches));
    },

    generarId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    },

    existeModelo(coches, modelo) {
        return coches.some(c => c.modelo.toLowerCase() === modelo.toLowerCase());
    },

    crearCoche(modelo, consumo, categoria) {
        return {
            id: this.generarId(),
            modelo,
            consumo: Number(consumo.toFixed(2)),
            categoria
        };
    },

    eliminarCochePorId(coches, id) {
        return coches.filter(c => c.id !== id);
    },

    buscarCochePorId(coches, id) {
        const indice = coches.findIndex(c => c.id === id);
        if (indice === -1) return null;
        return { coche: coches[indice], indice };
    },

    // Función de ordenación base: extrae, ordena y reinserta una categoría
    ordenarPorCategoria(coches, categoria, clave, ascendente) {
        // 1. Clonar el array para evitar mutación directa si es necesario
        const cochesClon = [...coches];

        // 2. Extraer coches de la categoría y guardar sus índices originales
        let indicesCategoria = [];
        let cochesCategoria = [];

        cochesClon.forEach((c, index) => {
            if (c.categoria === categoria) {
                indicesCategoria.push(index);
                cochesCategoria.push(c);
            }
        });

        // 3. Ordenar solo los coches de esa categoría
        cochesCategoria.sort((a, b) => {
            if (clave === 'modelo') {
                const comparacion = a.modelo.localeCompare(b.modelo);
                return ascendente ? comparacion : -comparacion;
            } else if (clave === 'consumo') {
                return ascendente ? a.consumo - b.consumo : b.consumo - a.consumo;
            }
            return 0; // Sin cambios si la clave no es reconocida
        });

        // 4. Reemplazar los coches en sus posiciones originales
        indicesCategoria.forEach((indiceOriginal, i) => {
            cochesClon[indiceOriginal] = cochesCategoria[i];
        });

        return cochesClon;
    },

    obtenerModoOscuro() {
        return localStorage.getItem("modoOscuro");
    },

    guardarModoOscuro(activo) {
        localStorage.setItem("modoOscuro", activo);
    }
};

// ============================================
// VISTA - Manipulación del DOM (SIN CAMBIOS ESTRUCTURALES)
// ============================================

const Vista = {
    // ... (El objeto Vista se mantiene sin cambios)
    elementos: {
        modeloFormulario: document.querySelector("#name"),
        consumoFormulario: document.querySelector("#consumo"),
        categoriaFormulario: document.getElementById("categoria"),
        form: document.querySelector("form"),
        mensaje: document.querySelector("#mensaje"),
        tbodySuv: document.querySelector("#tabla-suv tbody"),
        tbodyCompacto: document.querySelector("#tabla-compacto tbody"),
        tbodyUtilitario: document.querySelector("#tabla-utilitario tbody"),
        toggleModo: document.getElementById("modoOscuroToggle"),
        textoModo: document.getElementById("modoTexto")
    },

    limpiarFormulario() {
        this.elementos.modeloFormulario.value = "";
        this.elementos.consumoFormulario.value = "";
        this.elementos.categoriaFormulario.value = "";
    },

    mostrarMensaje(texto, tipo) {
        const mensaje = this.elementos.mensaje;
        mensaje.textContent = texto;
        mensaje.style.backgroundColor =
            tipo === "error" ? "rgba(200, 0, 0, 0.95)" : "rgba(0, 200, 0, 0.95)";
        mensaje.classList.add("mostrar");

        setTimeout(() => {
            mensaje.classList.remove("mostrar");
        }, 3000);
    },

    mostrarMensajeConUndo(texto, onUndo, duracion = 4000) {
        const mensaje = this.elementos.mensaje;
        mensaje.innerHTML = '';
        mensaje.textContent = texto;

        const undoBtn = document.createElement("button");
        undoBtn.className = "undo";
        undoBtn.textContent = "Deshacer";

        undoBtn.addEventListener("click", onUndo);

        mensaje.appendChild(undoBtn);
        mensaje.classList.add("mostrar");

        setTimeout(() => {
            mensaje.classList.remove("mostrar");
        }, duracion);
    },

    renderCoches(coches) {
        if (!Array.isArray(coches)) {
            coches = [];
        }

        [this.elementos.tbodySuv, this.elementos.tbodyCompacto, this.elementos.tbodyUtilitario].forEach(tbody => {
            if (tbody) tbody.innerHTML = "";
        });

        coches.forEach(coche => {
            if (!coche.modelo || isNaN(coche.consumo) || !coche.categoria) return;
            this.renderCoche(coche);
        });
    },

    renderCoche(coche) {
        const fila = document.createElement("tr");

        const celdaModelo = document.createElement("td");
        celdaModelo.textContent = coche.modelo;

        const celdaConsumo = document.createElement("td");
        celdaConsumo.textContent = Number(coche.consumo)
            .toFixed(2)
            .replace(".", ",");

        const celdaAcciones = document.createElement("td");
        const btnEliminar = document.createElement("button");
        btnEliminar.className = "btn-eliminar";
        btnEliminar.dataset.id = coche.id;
        btnEliminar.setAttribute("aria-label", `Eliminar ${coche.modelo}`);
        btnEliminar.innerHTML = `<img src="./img/bin.png" alt="" aria-hidden="true" width="16" height="16" />`;

        btnEliminar.style.border = "none";
        btnEliminar.style.background = "transparent";
        btnEliminar.style.cursor = "pointer";

        celdaAcciones.appendChild(btnEliminar);
        fila.appendChild(celdaModelo);
        fila.appendChild(celdaConsumo);
        fila.appendChild(celdaAcciones);

        const cat = String(coche.categoria).toLowerCase();
        if (cat === "suv" && this.elementos.tbodySuv) {
            this.elementos.tbodySuv.appendChild(fila);
        } else if (cat === "compacto" && this.elementos.tbodyCompacto) {
            this.elementos.tbodyCompacto.appendChild(fila);
        } else if (cat === "utilitario" && this.elementos.tbodyUtilitario) {
            this.elementos.tbodyUtilitario.appendChild(fila);
        }
    },

    marcarFilaEliminando(id) {
        const btn = document.querySelector(`.btn-eliminar[data-id="${id}"]`);
        const fila = btn ? btn.closest("tr") : null;
        if (fila) {
            fila.classList.add("eliminando");
        }
    },

    // Método UNIFICADO para actualizar la flecha de CUALQUIER botón de ordenación
    actualizarIconoOrden(categoria, clave, ascendente) {
        // Seleccionamos el botón correcto basado en la clave (nombre o consumo)
        const claseBoton = clave === 'modelo' ? '.ordenar-nombre' : '.ordenar';
        const boton = document.querySelector(`${claseBoton}[data-categoria="${categoria}"]`);
        
        if (!boton) return;

        const img = boton.querySelector("img");
        img.src = ascendente
            ? "./img/flecha-hacia-arriba.png"
            : "./img/flecha-hacia-abajo.png";
    },

    aplicarModoOscuro(activo) {
        if (activo) {
            document.body.classList.add("modo-oscuro");
            this.elementos.toggleModo.checked = true;
            this.elementos.textoModo.textContent = "Modo oscuro";
        } else {
            document.body.classList.remove("modo-oscuro");
            this.elementos.toggleModo.checked = false;
            this.elementos.textoModo.textContent = "Modo claro";
        }
    }
};

// ============================================
// CONTROLADOR - Lógica de la aplicación (REFACTORIZADO)
// ============================================

const Controlador = {
    coches: [],
    // UNIFICAMOS el estado de ordenación para ambas claves (modelo y consumo)
    // El valor es { modelo: true, consumo: true } para cada categoría
    ordenEstado: { 
        utilitario: { modelo: true, consumo: true }, 
        compacto: { modelo: true, consumo: true }, 
        suv: { modelo: true, consumo: true } 
    },
    ultimoEliminado: null,
    undoTimeoutId: null,

    init() {
        this.coches = Modelo.obtenerCoches();
        Modelo.guardarCoches(this.coches);
        Vista.renderCoches(this.coches);
        this.configurarEventos();
        this.configurarModoOscuro();
    },

    // Configurar todos los event listeners
    configurarEventos() {
        // 1. ✅ CORRECCIÓN: Evento de envío del formulario (submit)
        Vista.elementos.form.addEventListener("submit", (e) => this.manejarSubmit(e)); 

        // 2. Delegación de eventos para eliminar coches
        document.addEventListener("click", (e) => this.manejarEliminacion(e));

        // 3. Modo oscuro
        Vista.elementos.toggleModo.addEventListener("change", () => this.cambiarModoOscuro());
        
        // 4. ASIGNACIÓN UNIFICADA para todos los botones de ORDENACIÓN
        document.querySelectorAll(".ordenar-nombre, .ordenar").forEach(boton => {
            boton.addEventListener("click", () => this.manejarOrdenacion(boton));
        });
    },

    // 🔹 MÉTODO UNIFICADO DE ORDENACIÓN 🔹
    manejarOrdenacion(boton) {
        const categoria = boton.dataset.categoria;
        
        // Determinar la CLAVE de ordenación según la clase del botón
        const clave = boton.classList.contains("ordenar-nombre") ? 'modelo' : 'consumo';

        // 1. Obtener el estado actual (true para ascendente, false para descendente)
        const esAscendente = this.ordenEstado[categoria][clave];
        
        // 2. Llamar a la función de ordenación del Modelo
        this.coches = Modelo.ordenarPorCategoria(this.coches, categoria, clave, esAscendente);

        // 3. Invertir el sentido de ordenación para la próxima vez
        this.ordenEstado[categoria][clave] = !esAscendente;

        // 4. Actualizar la vista (renderizar, guardar y cambiar icono)
        Modelo.guardarCoches(this.coches);
        Vista.renderCoches(this.coches);
        
        // Usar la función unificada de Vista
        Vista.actualizarIconoOrden(categoria, clave, this.ordenEstado[categoria][clave]); 
        
        // 5. Mostrar mensaje de confirmación
        Vista.mostrarMensaje(
            `Tabla ${categoria.toUpperCase()} ordenada por ${clave}.`,
            "exito"
        );
    },

    // Manejar el envío del formulario (Nuevo coche)
    manejarSubmit(e) {
        e.preventDefault();

        const modelo = Vista.elementos.modeloFormulario.value.trim();
        const consumo = parseFloat(Vista.elementos.consumoFormulario.value);
        const categoria = Vista.elementos.categoriaFormulario.value;

        // Validaciones
        if (!modelo || isNaN(consumo) || !categoria) {
            return Vista.mostrarMensaje("Por favor, rellena todos los campos.", "error");
        }
        if (Modelo.existeModelo(this.coches, modelo)) {
            return Vista.mostrarMensaje(`El modelo "${modelo}" ya existe.`, "error");
        }

        // Crear, agregar y guardar
        const nuevoCoche = Modelo.crearCoche(modelo, consumo, categoria);
        this.coches.push(nuevoCoche);
        Modelo.guardarCoches(this.coches);

        // Renderizar y limpiar
        Vista.renderCoches(this.coches);
        Vista.limpiarFormulario();
        Vista.mostrarMensaje(`Coche ${modelo} añadido con éxito.`, "exito");
    },
    
    // El resto de los métodos se mantienen igual o con ligeras mejoras de limpieza
    
    manejarEliminacion(e) {
        const btn = e.target.closest(".btn-eliminar");
        if (!btn) return;
        const id = btn.dataset.id;
        if (!id) return;
        this.eliminarCoche(id);
    },

    eliminarCoche(id) {
        if (!id) return;

        const resultado = Modelo.buscarCochePorId(this.coches, id);
        if (!resultado) return;

        const { coche, indice } = resultado;

        Vista.marcarFilaEliminando(id);
        this.ultimoEliminado = { coche, indice };

        this.coches = Modelo.eliminarCochePorId(this.coches, id);
        Vista.renderCoches(this.coches);

        Vista.mostrarMensajeConUndo(
            `Coche ${coche.modelo} eliminado.`,
            () => this.deshacerEliminacion(),
            4000
        );

        clearTimeout(this.undoTimeoutId);
        this.undoTimeoutId = setTimeout(() => {
            Modelo.guardarCoches(this.coches);
            this.ultimoEliminado = null;
            this.undoTimeoutId = null;
            Vista.mostrarMensaje('Eliminación confirmada', 'exito');
        }, 4000);
    },

    deshacerEliminacion() {
        if (this.undoTimeoutId) {
            clearTimeout(this.undoTimeoutId);
            this.undoTimeoutId = null;
        }

        if (this.ultimoEliminado) {
            this.coches.splice(this.ultimoEliminado.indice, 0, this.ultimoEliminado.coche);
            Modelo.guardarCoches(this.coches);
            Vista.renderCoches(this.coches);
            Vista.mostrarMensaje(`Se ha recuperado ${this.ultimoEliminado.coche.modelo}`, "exito");
            this.ultimoEliminado = null;
        }
    },

    configurarModoOscuro() {
        const modoGuardado = Modelo.obtenerModoOscuro();
        
        if (modoGuardado === "true") {
            Vista.aplicarModoOscuro(true);
        } else if (modoGuardado === null) {
            const sistemaOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
            if (sistemaOscuro) {
                Vista.aplicarModoOscuro(true);
            }
        }
    },

    cambiarModoOscuro() {
        document.body.classList.toggle("modo-oscuro");
        const modoActivo = document.body.classList.contains("modo-oscuro");
        Vista.elementos.textoModo.textContent = modoActivo ? "Modo oscuro" : "Modo claro";
        Modelo.guardarModoOscuro(modoActivo);
    }
};

// Inicializar la aplicación cuando el DOM esté listo
Controlador.init();