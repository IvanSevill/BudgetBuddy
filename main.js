// Variables globales
var listaCompra = new Set();

function addToList() {
    var inputText = document.getElementById('BotonInputProducto').value;
    var newElement = document.createElement('p'); // Crea un nuevo elemento <p>
    var linea = document.createElement('div');
    
    if (inputText != "" && !(listaCompra.has(inputText))){
        newElement.textContent = inputText; // Asigna el texto del input al nuevo elemento
        newElement.id = 'producto'; // Asigna un id al nuevo producto
        
        linea.style.display = 'flex'; // Añade estilo para que los elementos estén en la misma línea
        linea.style.width = "180px"; // Añade estilo para que los elementos estén en la misma línea 
        linea.id= "linea"
        linea.appendChild(newElement);
    
        // Añade el nuevo contenedor al contenedor principal
        document.getElementById('listaCompra').appendChild(linea);
    
        // Añade un evento de clic al botón para eliminar el contenedor del producto
        newElement.addEventListener('click', function() {
            linea.remove();
            listaCompra.delete(inputText);
            console.log(listaCompra)
        });
        } 
    }

// Función para agregar elementos a la lista
function addListaCompra() {
    // Obtener el valor del input
    var item = document.getElementById('BotonInputProducto').value;
    if (item != "" && !(listaCompra.has(item))){
        // Agregar el valor al set
        listaCompra.add(item);

        // Crear un nuevo elemento de lista
        var newElement = document.createElement('p');
        newElement.textContent = item; // Asigna el texto del input al nuevo elemento
        newElement.id = 'producto'; // Asigna un id al nuevo producto

        var linea = document.createElement('div');
        linea.style.display = 'flex'; // Añade estilo para que los elementos estén en la misma línea
        linea.style.width = "180px"; // Añade estilo para que los elementos estén en la misma línea 
        linea.id= "linea"
        linea.appendChild(newElement);

        // Añade el nuevo contenedor al contenedor principal
        document.getElementById('listaCompra').appendChild(linea);

        // Añade un evento de clic al botón para eliminar el contenedor del producto
        newElement.addEventListener('click', function() {
            linea.remove();
            listaCompra.delete(item);
            console.log(listaCompra);
        });

        // Limpiar el input
        document.getElementById('BotonInputProducto').value = '';

        // Actualizar la lista en el HTML
        console.log(listaCompra); // Para verificar en la consola
    }
    else{
        alert("Has intentado meter el mismo producto o un producto vacío")
    }
    return listaCompra;
}

document.addEventListener('DOMContentLoaded', (event) => {
    var inputElement = document.getElementById('BotonInputProducto');
    var addButton = document.getElementById('BotonAñadir'); // Asegúrate de que este es el ID correcto del botón "Añadir"
    // Comprueba si el elemento ya tiene un evento de escucha
    if (inputElement.getAttribute('listener') !== 'true') {
        inputElement.addEventListener('keyup', function(event) {
            // Número 13 es el código de tecla para la tecla Enter
            if (event.keyCode === 13) {
                // Cancela la acción predeterminada, si es necesario
                event.preventDefault();
                // Comprueba si el input está vacío
                if (inputElement.value.trim() !== '') {
                    // Llama a la función addListaCompra
                    addListaCompra();
                }
            }
        });
        // Añade un atributo para indicar que el elemento ya tiene un evento de escucha
        inputElement.setAttribute('listener', 'true');
    }

    // Comprueba si el botón "Añadir" ya tiene un evento de escucha
    if (addButton.getAttribute('listener') !== 'true') {
        addButton.addEventListener('click', function(event) {
            // Cancela la acción predeterminada, si es necesario
            event.preventDefault();
            // Comprueba si el input está vacío
            if (inputElement.value.trim() !== '') {
                // Llama a la función addListaCompra
                addListaCompra();
            }
        });
        // Añade un atributo para indicar que el botón "Añadir" ya tiene un evento de escucha
        addButton.setAttribute('listener', 'true');
    }
});

function removeAll() {
    var container = document.getElementById('listaCompra');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    listaCompra.clear();
    console.log(listaCompra);
};

function leeArchivo(){
    return new Promise((resolve, reject) => {
        var csvFile = document.getElementById('csvFile').files[0];
        var reader = new FileReader();

        reader.onload = function(event) {
            var csvData = event.target.result;
            var lineas = csvData.split('\n'); // Divide el CSV en líneas
            var array = []; // Array principal

            for(var i = 0; i < lineas.length; i++) {
                var linea = lineas[i].trim(); // Elimina los espacios en blanco y otros caracteres invisibles del principio y del final de la línea
                var campos = linea.split(','); // Divide la línea en campos

                // Elimina los espacios en blanco del principio y del final del segundo campo
                if (campos.length > 1) {
                    campos[1] = campos[1].trim();
                }

                // Parsea el último elemento a un número de punto flotante
                var ultimoElemento = campos[campos.length - 1];
                campos[campos.length - 1] = parseFloat(ultimoElemento);

                array.push(campos); // Añade el array de campos al array principal
            }
            arrayCsv = array;
            console.log(array);
            resolve(array); // Resuelve la promesa con el array principal
        };

        reader.onerror = function(event) {
            console.error('Error al leer el archivo CSV: ' + event.target.error);
            reject(event.target.error);
        };

        reader.readAsText(csvFile);
        
    });
}

var boton = document.querySelector('.continue-application');
var inputFile = document.getElementById('csvFile');

// Añade un event listener al botón
boton.addEventListener('click', function() {
  // Simula un clic en el input de archivo
  inputFile.click();
});

function buscaMasBarato() {
    leeArchivo().then(arrayCsv => {
        if (listaCompra.size == 0){
            alert("Debes añadir a la cesta de la compra algún producto antes de compararlo");
        } 
        else {
            console.log("Busca más barato se ha ejecutado.");
            // Iteras cada elemento de "listaCompra" y busco si se encuentra en "arrayCsv"
            var diccionario = {};

            for (let producto of listaCompra){
                for ( let array of arrayCsv){
                    if (producto == array[1]){
                        if (!(array[0] in diccionario)){
                            diccionario[array[0]] = array[2];
                        }
                        else{
                            diccionario[array[0]] = diccionario[array[0]] + array[2];
                        }
                    }
                }
            }

            // Encuentra la clave con el valor mínimo
            var claveMin = null;
            var valorMin = Infinity;
            for (let clave in diccionario) {
                if (diccionario[clave] < valorMin) {
                    claveMin = clave;
                    valorMin = diccionario[clave];
                }
            }

            // Formatea la respuesta
        if (claveMin !== null) {
    var respuesta = "Te recomiendo ir al supermercado " + claveMin + ": Te costará " + valorMin + "€ en lugar de ";
    for (let clave in diccionario) {
        if (clave !== claveMin) {
            respuesta += clave + " que costaría " + diccionario[clave] + "€ ";
        }
    }
    var contenedor = document.getElementById('containerBuscaBarato');
    respuesta.style = 'padding: 10px; border: 1px solid black; margin: 10px;'
    contenedor.innerHTML = respuesta;
    // Elimina la última coma y el espacio
    respuesta = respuesta.slice(0, -2);
    console.log(respuesta);
    var imgElement = document.querySelector('td img');
    imgElement.style.display = 'block';
}
        }
    }).catch(error => {
        console.error('Error al leer el archivo: ', error);
    });
}

