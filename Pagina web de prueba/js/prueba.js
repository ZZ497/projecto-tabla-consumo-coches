// Alerta al pulsar el botón
const boton = document.querySelector("#miBoton");

boton.addEventListener("click", function() {
    alert("¡Has pulsado el botón!");
});

// Seleccionar las partes del formulario
const aniadir = document.querySelector("#envio");
const modeloFormulario = document.querySelector("#name");
const consumoFormulario = document.querySelector("#consumo");

// Seleccionar las tablas de cada categoría
const tablaUtilitario = document.querySelector("#tabla-utilitario");
const tablaCompacto = document.querySelector("#tabla-compacto");
const tablaSuv = document.querySelector("#tabla-suv");

// Manejar el envío del formulario
const form = document.querySelector("form");
form.addEventListener("submit", function(event) {

    // Prevenir el envío del formulario
    event.preventDefault();

    // Obtener los valores del formulario
    const modelo = modeloFormulario.value.trim();
    const consumo = parseFloat(consumoFormulario.value.trim());

    // Validar el modelo y consumo
    if (modelo === "") {
        mostrarMensaje("Por favor, introduce un modelo de coche.", "error");
        return;
    }

    if (isNaN (consumo) || consumo < 0 ) {
        mostrarMensaje("Por favor, introduce un consumo válido.", "error");
        return;
    }

    // Crear una nueva fila en la tabla correspondiente
    const fila = document.createElement("tr");

    // Crear una celda para el modelo 
    const celdaModelo = document.createElement("td");

    // Asignar el valor del modelo a la celda
    celdaModelo.textContent = modelo;

    //Crear una celda para el consumo
    const celdaConsumo = document.createElement("td");

    // Asignar el valor del consumo a la celda
    celdaConsumo.textContent = consumo;

    // Añadir las celdas a la fila
    fila.appendChild(celdaModelo);
    fila.appendChild(celdaConsumo);

    // Añadir la fila a la tabla correspondiente según la categoría
    if (document.getElementById("categoria").value.toLowerCase() === "suv") {
        tablaSuv.appendChild(fila);
    }
     else if (document.getElementById("categoria").value.toLowerCase() === "compacto") {
        tablaCompacto.appendChild(fila);

    } else if (document.getElementById("categoria").value.toLowerCase() === "utilitario") {
        tablaUtilitario.appendChild(fila);

    } else {
        mostrarMensaje("Por favor, introduce una categoría válida.", "error");
        modeloFormulario.value = "";
        return;
    }
    
    // Limpiar formulario
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

