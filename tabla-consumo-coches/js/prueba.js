// Alerta al pulsar el botón
const boton = document.querySelector("#miBoton");

boton.addEventListener("click", function() {
    alert("¡Has pulsado el botón!");
});

// Seleccionar las partes del formulario
const aniadir = document.querySelector("#envio");
const modeloFormulario = document.querySelector("#name");
const consumoFormulario = document.querySelector("#consumo");
const botonOrdenar = document.querySelector("#ordenarConsumo");


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
form.addEventListener("submit", function(event) {

    // Prevenir el envío del formulario
    event.preventDefault();

    // Obtener los valores del formulario
    const modelo = modeloFormulario.value.trim();
    const consumo = parseFloat(consumoFormulario.value.trim());
    const categoria = document.getElementById("categoria").value.trim().toLowerCase(); 
    
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

    const nuevoCoche = { modelo, consumo, categoria }; 
    coches.push(nuevoCoche);

    localStorage.setItem("coches", JSON.stringify(coches));
    renderCoches();

    // Limpiar formulario
    modeloFormulario.value = "";
    consumoFormulario.value = "";
    document.getElementById("categoria").value = "";

    // Mostrar mensaje de éxito
    console.log("Mensaje de éxito activado:", modelo);
    mostrarMensaje(`El modelo ${modelo} ha sido añadido a la tabla.`, "exito");
});

// Manejar el clic en el botón de ordenar
let ascendente = true;
botonOrdenar.addEventListener("click", function() {

    // Ordenar el array de coches por consumo
    coches.sort((a,b) => ascendente ? a.consumo - b.consumo : b.consumo - a.consumo);
    // Alternar el orden para la próxima vez
    ascendente = !ascendente;
    localStorage.setItem("coches", JSON.stringify(coches));
    renderCoches();
    mostrarMensaje("Tabla ordenada por consumo.", "exito");})

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
    // Limpiar las tablas
    tablaUtilitario.innerHTML = `<tr><th>Modelo</th><th>Consumo L/100km</th></tr>`;
    tablaCompacto.innerHTML = `<tr><th>Modelo</th><th>Consumo L/100km</th></tr>`;
    tablaSuv.innerHTML = `<tr><th>Modelo</th><th>Consumo L/100km</th></tr>`;
    
    coches.forEach(coche => {
        // Crear una nueva fila en la tabla correspondiente
        const fila = document.createElement("tr");

        // Crear una celda para el modelo
        const celdaModelo = document.createElement("td");
    
        // Asignar el valor del modelo a la celda
        celdaModelo.textContent = coche.modelo;

        //Crear una celda para el consumo
        const celdaConsumo = document.createElement("td");

        // Asignar el valor del consumo a la celda
        celdaConsumo.textContent = coche.consumo

        // Añadir las celdas a la fila
        fila.appendChild(celdaModelo);
        fila.appendChild(celdaConsumo);

        // Añadir la fila a la tabla correspondiente según la categoría
        const cat = String(coche.categoria || "").toLowerCase();
        if (cat === "suv") tablaSuv.appendChild(fila);
        else if (cat === "compacto") tablaCompacto.appendChild(fila);
        else tablaUtilitario.appendChild(fila);
    });    
}

