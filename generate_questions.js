import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questions = [
  // HTML - Multiple Choice
  { id: 1, category: "HTML", type: "multiple_choice", question: "¿Qué significa HTML?", options: ["HyperText Markup Language", "HighText Machine Language", "HyperLoop Machine Language", "None of the above"], correctIndex: 0 },
  { id: 2, category: "HTML", type: "multiple_choice", question: "¿Cuál es la etiqueta correcta para el encabezado más grande?", options: ["<head>", "<h6>", "<heading>", "<h1>"], correctIndex: 3 },
  { id: 3, category: "HTML", type: "multiple_choice", question: "¿Qué etiqueta se utiliza para insertar un salto de línea?", options: ["<lb>", "<br>", "<break>", "<tr>"], correctIndex: 1 },
  { id: 4, category: "HTML", type: "multiple_choice", question: "¿Cuál es el elemento HTML correcto para crear un hipervínculo?", options: ["<a name=''>A</a>", "<a>B</a>", "<a href='http://www.google.com'>Google</a>", "<link>"], correctIndex: 2 },
  { id: 5, category: "HTML", type: "multiple_choice", question: "¿Qué carácter se utiliza para indicar una etiqueta de cierre?", options: ["*", "^", "<", "/"], correctIndex: 3 },
  // HTML - True/False
  { id: 6, category: "HTML", type: "true_false", question: "El elemento <title> se debe colocar dentro de la sección <body>.", isTrue: false },
  { id: 7, category: "HTML", type: "true_false", question: "HTML5 es la última versión de HTML.", isTrue: true },
  { id: 8, category: "HTML", type: "true_false", question: "Los comentarios en HTML se escriben entre <!-- y -->.", isTrue: true },
  { id: 9, category: "HTML", type: "true_false", question: "El atributo 'alt' es obligatorio en la etiqueta <img>.", isTrue: true },
  { id: 10, category: "HTML", type: "true_false", question: "El elemento <section> se utiliza para definir un menú de navegación.", isTrue: false },
  // HTML - Ordering
  { id: 11, category: "HTML", type: "ordering", question: "Ordena la estructura básica de un documento HTML de arriba hacia abajo:", correctOrder: ["<!DOCTYPE html>", "<html>", "<head>", "<body>"] },
  { id: 12, category: "HTML", type: "ordering", question: "Ordena los encabezados de mayor a menor importancia:", correctOrder: ["<h1>", "<h2>", "<h3>", "<h4>"] },
  { id: 13, category: "HTML", type: "ordering", question: "Ordena las partes de una etiqueta HTML:", correctOrder: ["Símbolo menor que (<)", "Nombre de la etiqueta", "Atributos (si los hay)", "Símbolo mayor que (>)"] },
  { id: 14, category: "HTML", type: "ordering", question: "Ordena la creación de una lista desordenada:", correctOrder: ["Abrir etiqueta <ul>", "Crear elementos <li>", "Cerrar elementos <li>", "Cerrar etiqueta </ul>"] },
  { id: 15, category: "HTML", type: "ordering", question: "Estructura un artículo semántico:", correctOrder: ["<article>", "<header>", "<p>Contenido</p>", "<footer>"] },
  // HTML - Drag and Drop
  { id: 16, category: "HTML", type: "drag_and_drop", question: "Asocia la etiqueta con su función semántica:", pairs: [{term: "<nav>", definition: "Navegación"}, {term: "<header>", definition: "Encabezado principal"}, {term: "<footer>", definition: "Pie de página"}, {term: "<main>", definition: "Contenido principal"}] },
  { id: 17, category: "HTML", type: "drag_and_drop", question: "Asocia la etiqueta de lista con su tipo:", pairs: [{term: "<ul>", definition: "Lista con viñetas"}, {term: "<ol>", definition: "Lista numerada"}, {term: "<li>", definition: "Elemento de lista"}] },
  { id: 18, category: "HTML", type: "drag_and_drop", question: "Asocia el atributo de <img> con su propósito:", pairs: [{term: "src", definition: "Ruta de la imagen"}, {term: "alt", definition: "Texto alternativo"}, {term: "width", definition: "Ancho de la imagen"}] },
  { id: 19, category: "HTML", type: "drag_and_drop", question: "Asocia las etiquetas de texto con su estilo predeterminado:", pairs: [{term: "<strong>", definition: "Texto en negrita"}, {term: "<em>", definition: "Texto en cursiva"}, {term: "<u>", definition: "Texto subrayado"}] },
  { id: 20, category: "HTML", type: "drag_and_drop", question: "Asocia los elementos de formulario:", pairs: [{term: "<input>", definition: "Campo de entrada"}, {term: "<label>", definition: "Etiqueta para campo"}, {term: "<button>", definition: "Botón para enviar"}] },

  // CSS - Multiple Choice
  { id: 21, category: "CSS", type: "multiple_choice", question: "¿Qué significa CSS?", options: ["Cascading Style Sheets", "Colorful Style Sheets", "Computer Style Sheets", "Creative Style Sheets"], correctIndex: 0 },
  { id: 22, category: "CSS", type: "multiple_choice", question: "¿Qué propiedad se usa para cambiar el color de fondo?", options: ["bgcolor", "background-color", "color", "background"], correctIndex: 1 },
  { id: 23, category: "CSS", type: "multiple_choice", question: "¿Cómo se selecciona un elemento con id 'demo'?", options: [".demo", "demo", "#demo", "*demo"], correctIndex: 2 },
  { id: 24, category: "CSS", type: "multiple_choice", question: "¿Cómo se selecciona un elemento con clase 'test'?", options: ["#test", "*test", ".test", "test"], correctIndex: 2 },
  { id: 25, category: "CSS", type: "multiple_choice", question: "¿Qué propiedad cambia el tamaño del texto?", options: ["text-style", "font-size", "text-size", "font-style"], correctIndex: 1 },
  // CSS - True/False
  { id: 26, category: "CSS", type: "true_false", question: "La propiedad 'margin' afecta el espacio interior de una caja.", isTrue: false },
  { id: 27, category: "CSS", type: "true_false", question: "En el Box Model, el 'padding' rodea al contenido.", isTrue: true },
  { id: 28, category: "CSS", type: "true_false", question: "El selector '*' selecciona todos los elementos de la página.", isTrue: true },
  { id: 29, category: "CSS", type: "true_false", question: "'display: none' oculta el elemento pero mantiene su espacio en la página.", isTrue: false },
  { id: 30, category: "CSS", type: "true_false", question: "CSS se puede escribir directamente dentro de un archivo HTML usando la etiqueta <style>.", isTrue: true },
  // CSS - Ordering
  { id: 31, category: "CSS", type: "ordering", question: "Ordena las partes del Box Model desde el centro hacia afuera:", correctOrder: ["Contenido (Content)", "Relleno (Padding)", "Borde (Border)", "Margen (Margin)"] },
  { id: 32, category: "CSS", type: "ordering", question: "Ordena la especificidad de selectores de menor a mayor:", correctOrder: ["Etiqueta (ej. p)", "Clase (ej. .clase)", "ID (ej. #id)", "Estilo en línea (inline)"] },
  { id: 33, category: "CSS", type: "ordering", question: "Ordena la estructura de una regla CSS:", correctOrder: ["Selector", "Llave de apertura {", "Propiedad : Valor;", "Llave de cierre }"] },
  { id: 34, category: "CSS", type: "ordering", question: "Ordena los pasos para vincular un CSS externo:", correctOrder: ["Crear archivo .css", "Abrir el archivo HTML", "Ir a la sección <head>", "Añadir la etiqueta <link>"] },
  { id: 35, category: "CSS", type: "ordering", question: "Ordena los valores de margin para el atajo 'margin: 1px 2px 3px 4px;':", correctOrder: ["Arriba (Top: 1px)", "Derecha (Right: 2px)", "Abajo (Bottom: 3px)", "Izquierda (Left: 4px)"] },
  // CSS - Drag and Drop
  { id: 36, category: "CSS", type: "drag_and_drop", question: "Asocia el selector con su símbolo:", pairs: [{term: "ID", definition: "# (Hash)"}, {term: "Clase", definition: ". (Punto)"}, {term: "Todas las etiquetas", definition: "* (Asterisco)"}] },
  { id: 37, category: "CSS", type: "drag_and_drop", question: "Asocia la propiedad Flexbox con su función:", pairs: [{term: "justify-content", definition: "Alineación horizontal (main axis)"}, {term: "align-items", definition: "Alineación vertical (cross axis)"}, {term: "flex-direction", definition: "Dirección de los elementos"}] },
  { id: 38, category: "CSS", type: "drag_and_drop", question: "Asocia el tipo de posicionamiento:", pairs: [{term: "relative", definition: "Relativo a su posición original"}, {term: "absolute", definition: "Relativo a su contenedor padre posicionado"}, {term: "fixed", definition: "Fijo respecto a la ventana del navegador"}] },
  { id: 39, category: "CSS", type: "drag_and_drop", question: "Asocia los colores en CSS:", pairs: [{term: "Hexadecimal", definition: "#FF0000"}, {term: "RGB", definition: "rgb(255, 0, 0)"}, {term: "Nombre clave", definition: "red"}] },
  { id: 40, category: "CSS", type: "drag_and_drop", question: "Asocia las unidades de medida:", pairs: [{term: "px", definition: "Píxeles fijos"}, {term: "%", definition: "Porcentaje relativo al padre"}, {term: "rem", definition: "Relativo al tamaño de fuente raíz (html)"}] },

  // JavaScript - Multiple Choice
  { id: 41, category: "JavaScript", type: "multiple_choice", question: "¿Dentro de qué etiqueta HTML ponemos el JavaScript?", options: ["<javascript>", "<scripting>", "<js>", "<script>"], correctIndex: 3 },
  { id: 42, category: "JavaScript", type: "multiple_choice", question: "¿Dónde es el lugar correcto para insertar un JavaScript?", options: ["La sección <head>", "La sección <body>", "Ambas secciones son válidas"], correctIndex: 2 },
  { id: 43, category: "JavaScript", type: "multiple_choice", question: "¿Cómo se escribe 'Hello World' en un cuadro de alerta?", options: ["alertBox('Hello World');", "msg('Hello World');", "alert('Hello World');", "msgBox('Hello World');"], correctIndex: 2 },
  { id: 44, category: "JavaScript", type: "multiple_choice", question: "¿Cómo se crea una función en JavaScript?", options: ["function = myFunction()", "function myFunction()", "function:myFunction()"], correctIndex: 1 },
  { id: 45, category: "JavaScript", type: "multiple_choice", question: "¿Cómo se llama una función llamada 'myFunction'?", options: ["call myFunction()", "call function myFunction()", "myFunction()"], correctIndex: 2 },
  // JavaScript - True/False
  { id: 46, category: "JavaScript", type: "true_false", question: "JavaScript es lo mismo que Java.", isTrue: false },
  { id: 47, category: "JavaScript", type: "true_false", question: "Se puede declarar una variable usando la palabra clave 'let'.", isTrue: true },
  { id: 48, category: "JavaScript", type: "true_false", question: "console.log() se usa para imprimir mensajes en la consola del navegador.", isTrue: true },
  { id: 49, category: "JavaScript", type: "true_false", question: "En JavaScript, los arreglos (arrays) comienzan con el índice 1.", isTrue: false },
  { id: 50, category: "JavaScript", type: "true_false", question: "'const' se usa para definir variables cuyo valor nunca cambiará.", isTrue: true },
  // JavaScript - Ordering
  { id: 51, category: "JavaScript", type: "ordering", question: "Ordena los pasos para cambiar el texto de un elemento HTML con JS:", correctOrder: ["Añadir id al elemento HTML", "Usar document.querySelector o getElementById", "Acceder a la propiedad textContent o innerHTML", "Asignar el nuevo valor (ej. = 'Nuevo texto')"] },
  { id: 52, category: "JavaScript", type: "ordering", question: "Ordena la creación de un bucle 'for' básico:", correctOrder: ["Palabra clave 'for'", "Inicializar variable (let i = 0;)", "Condición (i < 5;)", "Incremento (i++)"] },
  { id: 53, category: "JavaScript", type: "ordering", question: "Ordena la creación de un evento Click:", correctOrder: ["Seleccionar el botón", "Escribir .addEventListener", "Pasar 'click' como primer argumento", "Pasar la función callback como segundo argumento"] },
  { id: 54, category: "JavaScript", type: "ordering", question: "Ordena la estructura de un condicional 'if':", correctOrder: ["Palabra clave 'if'", "Condición entre paréntesis ()", "Bloque de código verdadero {}", "Palabra clave 'else' (opcional)"] },
  { id: 55, category: "JavaScript", type: "ordering", question: "Ordena la declaración de un Array:", correctOrder: ["Palabra clave let o const", "Nombre del array (ej. frutas)", "Signo igual (=)", "Corchetes con los elementos (ej. ['manzana', 'pera'])"] },
  // JavaScript - Drag and Drop
  { id: 56, category: "JavaScript", type: "drag_and_drop", question: "Asocia el tipo de variable con su descripción:", pairs: [{term: "var", definition: "Antigua forma de declarar variables"}, {term: "let", definition: "Variable que puede cambiar su valor"}, {term: "const", definition: "Variable cuyo valor es constante"}] },
  { id: 57, category: "JavaScript", type: "drag_and_drop", question: "Asocia el operador lógico:", pairs: [{term: "&&", definition: "AND lógico (ambas verdaderas)"}, {term: "||", definition: "OR lógico (al menos una verdadera)"}, {term: "!", definition: "NOT lógico (negación)"}] },
  { id: 58, category: "JavaScript", type: "drag_and_drop", question: "Asocia el tipo de dato:", pairs: [{term: "String", definition: "'Hola Mundo'"}, {term: "Number", definition: "42"}, {term: "Boolean", definition: "true o false"}, {term: "Array", definition: "[1, 2, 3]"}] },
  { id: 59, category: "JavaScript", type: "drag_and_drop", question: "Asocia el método de consola:", pairs: [{term: "console.log()", definition: "Imprime un mensaje general"}, {term: "console.error()", definition: "Imprime un mensaje de error"}, {term: "console.warn()", definition: "Imprime un mensaje de advertencia"}] },
  { id: 60, category: "JavaScript", type: "drag_and_drop", question: "Asocia los métodos de Array:", pairs: [{term: ".push()", definition: "Añade al final del array"}, {term: ".pop()", definition: "Elimina el último elemento"}, {term: ".length", definition: "Obtiene la cantidad de elementos"}] }
];

const content = "export const defaultQuizQuestions = " + JSON.stringify(questions, null, 2) + ";";
fs.writeFileSync(path.join(__dirname, 'src', 'data', 'quizQuestions.js'), content);
