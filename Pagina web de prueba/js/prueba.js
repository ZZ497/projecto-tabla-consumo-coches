console.log("Hola Mundo")
const boton = document.querySelector("#miBoton");

boton.addEventListener("click", function() {
    alert("¡Has pulsado el botón!");
});

const aniadir = document.querySelector("#envio");
const modeloFormulario = document.querySelector("#name");
const consumoFormulario = document.querySelector("#consumo");

// Tablas de cada categoría
const tablaUtilitario = document.querySelector("#tabla-utilitario");
const tablaCompacto = document.querySelector("#tabla-compacto");
const tablaSuv = document.querySelector("#tabla-suv");

const form = document.querySelector("form");
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const modelo = modeloFormulario.value.trim();
    const consumo = parseFloat(consumoFormulario.value.trim());

    if (modelo === "") {
        alert("Por favor, introduce un modelo de coche.");
        return;
    }

    if (isNaN (consumo) || consumo < 0 ) {
        alert("Por favor, introduce un consumo válido.");
        return;
    }

    const fila = document.createElement("tr");
    const celdaModelo = document.createElement("td");
    celdaModelo.textContent = modelo;

    const celdaConsumo = document.createElement("td");
    celdaConsumo.textContent = consumo;

    fila.appendChild(celdaModelo);
    fila.appendChild(celdaConsumo);

    if (document.getElementById("categoria").value.toLowerCase() === "suv") {
        tablaSuv.appendChild(fila);
    }
     else if (document.getElementById("categoria").value.toLowerCase() === "compacto") {
        tablaCompacto.appendChild(fila);

    } else if (document.getElementById("categoria").value.toLowerCase() === "utilitario") {
        tablaUtilitario.appendChild(fila);

    } else {
        alert("Categoría no válida. Usa 'suv', 'compacto' o 'utilitario'.");
        modeloFormulario.value = "";
        return;
    }

    modeloFormulario.value = "";
    // Limpiar formulario
    modeloFormulario.value = "";
    consumoFormulario.value = "";
    document.getElementById("categoria").value = "";

    // Mostrar mensaje de éxito
    mostrarMensaje(`El modelo "${modelo}" ha sido añadido a la tabla.`, "green");
});

// Función para mostrar mensajes temporales
function mostrarMensaje(texto, color) {
    mensaje.textContent = texto;
    mensaje.style.color = color;
    mensaje.style.opacity = "1";

    // Desaparece después de 3 segundos
    setTimeout(() => {
        mensaje.style.opacity = "0";
    }, 3000);
}
