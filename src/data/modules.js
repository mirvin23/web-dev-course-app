export const courseModules = [
  {
    id: 1,
    title: "1. La Estructura Base de la Web",
    description: "Conoce las etiquetas fundamentales que dan vida a cada sitio web.",
    theory: `
# El ADN de una Página Web
Toda página web necesita una estructura básica para que el navegador (como Chrome o Safari) la entienda correctamente.

## Etiquetas Esenciales
1. \`<!DOCTYPE html>\`: Le avisa al navegador que estamos usando la última versión (HTML5).
2. \`<html>\`: Envuelve absolutamente todo el contenido.
3. \`<head>\`: Contiene "metadatos", como el título de la pestaña. El usuario no ve esto directamente.
4. \`<body>\`: Aquí va todo lo visible: textos, imágenes, videos y botones.

### Ejemplo de Estructura:
\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>Mi Primera Web</title>
  </head>
  <body>
    ¡Hola Mundo!
  </body>
</html>
\`\`\`
    `,
    task: {
      title: "Desafío: Construye el ADN",
      instruction: "Arma la estructura básica de una página HTML5. Asegúrate de incluir el `DOCTYPE`, la etiqueta `<html>`, el `<head>` y el `<body>`.",
      initialCode: "<!-- Escribe tu código aquí -->\n\n\n",
      validationRules: [
        { pattern: "<!DOCTYPE html>", flags: "i", negated: false },
        { pattern: "<html>.*<\\/html>", flags: "si", negated: false },
        { pattern: "<head>.*<\\/head>", flags: "si", negated: false },
        { pattern: "<body>.*<\\/body>", flags: "si", negated: false }
      ],
      successMessage: "¡Perfecto! Has creado los cimientos de la web."
    }
  },
  {
    id: 2,
    title: "2. Textos y Formatos",
    description: "Aprende a escribir y dar formato al texto como en un procesador de palabras.",
    theory: `
# Escribiendo en la Web
Para que el texto tenga sentido, no podemos simplemente escribirlo suelto. Debemos indicarle al navegador qué tipo de texto es.

## Títulos y Párrafos
- \`<h1>\` al \`<h6>\`: Son los encabezados. \`<h1>\` es el título principal y más grande (solo debe haber uno por página). \`<h2>\` es el subtítulo, y así sucesivamente.
- \`<p>\`: Significa párrafo (paragraph). Se usa para bloques de texto normales.

## Dar Énfasis
- \`<strong>\`: Hace el texto **negrita** e indica que es importante.
- \`<em>\`: Pone el texto en *cursiva* para enfatizarlo.

### Ejemplo:
\`\`\`html
<h1>Mi Videojuego Favorito</h1>
<p>Me encanta jugar <strong>Minecraft</strong> porque me permite ser creativo y explorar <em>infinitos</em> mundos.</p>
\`\`\`
    `,
    task: {
      title: "Desafío: El Escritor",
      instruction: "Crea un título principal `<h1>` sobre tu animal favorito, un párrafo `<p>` describiéndolo, y usa `<strong>` para resaltar su característica más importante dentro del párrafo.",
      initialCode: "<!DOCTYPE html>\n<html>\n  <body>\n    <!-- Escribe tu código aquí -->\n\n  </body>\n</html>",
      validationRules: [
        { pattern: "<h1>.*<\\/h1>", flags: "si", negated: false },
        { pattern: "<p>.*<\\/p>", flags: "si", negated: false },
        { pattern: "<strong>.*<\\/strong>", flags: "si", negated: false }
      ],
      successMessage: "¡Genial! Ahora el texto tiene jerarquía y significado."
    }
  },
  {
    id: 3,
    title: "3. Enlaces e Imágenes",
    description: "Conecta la web e inserta contenido multimedia.",
    theory: `
# Navegando y Visualizando
¿Qué sería de internet sin los links para saltar de página en página, o sin imágenes?

## Enlaces (Links)
Usamos la etiqueta \`<a>\` (anchor). Necesita un "atributo" llamado \`href\` que le dice hacia dónde ir:
\`\`\`html
<a href="https://google.com">Ir a Google</a>
\`\`\`

## Imágenes
La etiqueta \`<img>\` no tiene etiqueta de cierre. Usa el atributo \`src\` (source) para la ruta de la imagen, y \`alt\` (texto alternativo) por si la imagen no carga o para lectores de pantalla.
\`\`\`html
<img src="gato.jpg" alt="Un gatito durmiendo">
\`\`\`
    `,
    task: {
      title: "Desafío: Tu Primer Enlace",
      instruction: "Crea un enlace (`<a>`) que dirija a 'https://wikipedia.org' con el texto 'Ir a Wikipedia'. Opcional: ¡Añade una imagen usando `<img>`!",
      initialCode: "<!DOCTYPE html>\n<html>\n  <body>\n    <!-- Crea el enlace aquí -->\n\n  </body>\n</html>",
      validationRules: [
        { pattern: "<a ", flags: "si", negated: false },
        { pattern: "href=['\"]https:\\/\\/wikipedia\\.org['\"]", flags: "si", negated: false }
      ],
      successMessage: "¡Excelente! Ahora tu página está conectada al mundo."
    }
  },
  {
    id: 4,
    title: "4. HTML5 Semántico: El Esqueleto",
    description: "Estructura la información como un profesional.",
    theory: `
# Semántica Web
"Semántico" significa "con significado". Antes los programadores agrupaban todo en cajas genéricas llamadas \`<div>\`. Hoy en día, HTML5 introdujo etiquetas que explican qué función cumple cada área.

## Zonas Principales
- \`<header>\`: El encabezado del sitio (suele contener el logo o un título principal).
- \`<nav>\`: El menú de navegación (lista de links a otras partes del sitio).
- \`<main>\`: El contenido principal y único de esa página específica.
- \`<footer>\`: El pie de página (derechos de autor, links legales).

Usar esto ayuda al posicionamiento en Google (SEO) y a las personas que usan lectores de pantalla por discapacidad visual.
    `,
    task: {
      title: "Desafío: Mejorando un sitio viejo",
      instruction: "Cambia las etiquetas genéricas `<div>` por sus alternativas semánticas correspondientes (`<header>`, `<main>` y `<footer>`).",
      initialCode: "<!DOCTYPE html>\n<html>\n  <body>\n    <div class=\"encabezado\">\n      <h1>Mi Blog</h1>\n    </div>\n    \n    <div class=\"principal\">\n      <p>Bienvenidos a mi primer post.</p>\n    </div>\n    \n    <div class=\"pie\">\n      <p>Derechos reservados 2026</p>\n    </div>\n  </body>\n</html>",
      validationRules: [
        { pattern: "<header>", flags: "si", negated: false },
        { pattern: "<div class=\"encabezado\">", flags: "si", negated: true },
        { pattern: "<main>", flags: "si", negated: false },
        { pattern: "<div class=\"principal\">", flags: "si", negated: true },
        { pattern: "<footer>", flags: "si", negated: false },
        { pattern: "<div class=\"pie\">", flags: "si", negated: true }
      ],
      successMessage: "¡Increíble! Acabas de modernizar el código."
    }
  },
  {
    id: 5,
    title: "5. Secciones y Artículos",
    description: "Organiza el contenido complejo dentro del Main.",
    theory: `
# Dividiendo el contenido principal
Dentro de nuestro \`<main>\` (contenido principal), a veces hay mucha información diferente. ¿Cómo la separamos con significado?

## Articles y Sections
- \`<article>\`: Contenido que tiene sentido por sí mismo. Si lo copias y lo pegas en otro sitio, se entendería perfecto (Ej: una noticia, un producto, una publicación de blog).
- \`<section>\`: Agrupa contenido relacionado dentro de la página. (Ej: Sección "Sobre nosotros", Sección "Contacto").
- \`<aside>\`: Contenido complementario que va a los lados, como barras laterales con anuncios o posts relacionados.

### Ejemplo
\`\`\`html
<main>
  <section>
    <h2>Noticias de Tecnología</h2>
    <article>
      <h3>Salió un nuevo celular</h3>
      <p>La nueva marca X lanzó su dispositivo...</p>
    </article>
    <article>
      <h3>Avances en IA</h3>
      <p>La inteligencia artificial ahora puede...</p>
    </article>
  </section>
</main>
\`\`\`
    `,
    task: {
      title: "Desafío: Tu Primera Noticia",
      instruction: "Crea una `<section>` y dentro de ella coloca un `<article>`. El artículo debe tener un título (`<h2>`) y un párrafo (`<p>`).",
      initialCode: "<!DOCTYPE html>\n<html>\n  <body>\n    <main>\n      <!-- Escribe aquí tu section y article -->\n\n    </main>\n  </body>\n</html>",
      validationRules: [
        { pattern: "<section>.*<\\/section>", flags: "si", negated: false },
        { pattern: "<article>.*<\\/article>", flags: "si", negated: false },
        { pattern: "<section>\\s*<article>", flags: "si", negated: false },
        { pattern: "<h2>.*<\\/h2>", flags: "si", negated: false }
      ],
      successMessage: "¡Eres un experto en Semántica! Google amará tu código."
    }
  },
  {
    id: 6,
    title: "6. Introducción a CSS",
    description: "La magia de los colores y estilos.",
    theory: `
# ¿Qué es CSS?
Si HTML es el esqueleto, **CSS (Cascading Style Sheets)** es la ropa, el maquillaje y el estilo de tu página web.

## Selectores Básicos
Para darle estilo a un elemento, primero debemos seleccionarlo. La sintaxis básica es:
\`\`\`css
selector {
  propiedad: valor;
}
\`\`\`

- **Selector de etiqueta:** Afecta a TODAS las etiquetas de ese tipo. Ej: \`h1 { color: red; }\`
- **Selector de clase (con un punto):** Afecta solo a las etiquetas con ese atributo \`class\`. Ej: \`.mi-titulo { color: blue; }\`
    `,
    task: {
      title: "Desafío: Pintando la Web",
      instruction: "En el bloque `<style>`, usa un selector de etiqueta para pintar todos los `<p>` de color rojo (`color: red;`), y usa un selector de clase para pintar el elemento con clase `.destacado` de color azul (`color: blue;`).",
      initialCode: "<!DOCTYPE html>\n<html>\n  <head>\n    <style>\n      /* Escribe tu CSS aquí */\n      \n    </style>\n  </head>\n  <body>\n    <p>Soy un párrafo normal.</p>\n    <p class=\"destacado\">Soy un párrafo destacado.</p>\n  </body>\n</html>",
      validationRules: [
        { pattern: "p\\s*{[\\s\\S]*?color:\\s*red\\s*;", flags: "si", negated: false },
        { pattern: "\\.destacado\\s*{[\\s\\S]*?color:\\s*blue\\s*;", flags: "si", negated: false }
      ],
      successMessage: "¡Excelente! Has dominado los selectores."
    }
  },
  {
    id: 7,
    title: "7. El Modelo de Caja",
    description: "Entiende cómo se calculan los tamaños en la web.",
    theory: `
# El Box Model
En CSS, **absolutamente todo es una caja rectangular**. Incluso si haces un círculo, por debajo es una caja.

## Las partes de la caja
1. **Content (Contenido):** El texto o imagen en sí.
2. **Padding (Relleno):** El espacio *interior* entre el contenido y el borde. (Es como el aire dentro de un globo).
3. **Border (Borde):** La línea exterior de la caja.
4. **Margin (Margen):** El espacio *exterior* que separa esta caja de las demás cajas. (Es la distancia social).

\`\`\`css
.caja {
  padding: 20px;
  border: 2px solid black;
  margin: 10px;
}
\`\`\`
    `,
    task: {
      title: "Desafío: Cajas que respiran",
      instruction: "Dale estilo a `.mi-caja`: ponle un `padding` de 20px, un `margin` de 30px y un `border` de `5px solid red`.",
      initialCode: "<!DOCTYPE html>\n<html>\n  <head>\n    <style>\n      .mi-caja {\n        background-color: lightgray;\n        /* Escribe aquí padding, margin y border */\n        \n      }\n    </style>\n  </head>\n  <body>\n    <div class=\"mi-caja\">\n      ¡Necesito espacio!\n    </div>\n  </body>\n</html>",
      validationRules: [
        { pattern: "padding:\\s*20px", flags: "si", negated: false },
        { pattern: "margin:\\s*30px", flags: "si", negated: false },
        { pattern: "border:\\s*5px solid red", flags: "si", negated: false }
      ],
      successMessage: "¡Perfecto! Ahora entiendes cómo funciona el espacio en CSS."
    }
  },
  {
    id: 8,
    title: "8. Tipografía",
    description: "Haz que tus textos luzcan profesionales.",
    theory: `
# Estilizando el Texto
Las páginas web modernas usan fuentes atractivas. Podemos cambiar casi todo acerca de las letras con CSS.

## Propiedades Clave
- \`font-family\`: Cambia el tipo de letra (Ej: \`Arial\`, \`sans-serif\`).
- \`font-size\`: Cambia el tamaño (Ej: \`24px\`).
- \`text-align\`: Alinea el texto (Ej: \`center\`, \`left\`, \`right\`).
- \`font-weight\`: Grosor de la letra (Ej: \`bold\`, \`normal\`).

### Ejemplo
\`\`\`css
h1 {
  font-family: sans-serif;
  font-size: 40px;
  text-align: center;
}
\`\`\`
    `,
    task: {
      title: "Desafío: El Diseñador Gráfico",
      instruction: "Modifica el `<h1>`: haz que use la familia `sans-serif`, tenga un tamaño de `30px` y esté centrado (`text-align: center`).",
      initialCode: "<!DOCTYPE html>\n<html>\n  <head>\n    <style>\n      h1 {\n        /* Escribe aquí las propiedades del texto */\n        \n      }\n    </style>\n  </head>\n  <body>\n    <h1>Texto Aburrido</h1>\n  </body>\n</html>",
      validationRules: [
        { pattern: "font-family:\\s*sans-serif", flags: "si", negated: false },
        { pattern: "font-size:\\s*30px", flags: "si", negated: false },
        { pattern: "text-align:\\s*center", flags: "si", negated: false }
      ],
      successMessage: "¡Genial! El diseño de texto es clave para una buena página."
    }
  },
  {
    id: 9,
    title: "9. Flexbox Básico",
    description: "El poder de alinear elementos fácilmente.",
    theory: `
# Layouts con Flexbox
Antes, alinear elementos uno al lado del otro era una pesadilla. Hoy usamos **Flexbox**, que hace todo flexible y fácil.

## ¿Cómo funciona?
Le aplicas \`display: flex;\` a la caja padre (contenedor), y los elementos hijos se pondrán uno al lado del otro automáticamente.

- \`justify-content\`: Alinea elementos en el eje horizontal (Ej: \`center\`, \`space-between\`).
- \`align-items\`: Alinea elementos en el eje vertical (Ej: \`center\`).

\`\`\`css
.contenedor {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`
    `,
    task: {
      title: "Desafío: Ordenando el Caos",
      instruction: "Convierte al `.contenedor` en un flexbox (`display: flex;`) y centra todo horizontalmente con `justify-content: center;`.",
      initialCode: "<!DOCTYPE html>\n<html>\n  <head>\n    <style>\n      .contenedor {\n        background-color: #f0f0f0;\n        height: 100px;\n        /* Escribe Flexbox aquí */\n        \n      }\n      .caja { background: purple; color: white; padding: 10px; margin: 5px; }\n    </style>\n  </head>\n  <body>\n    <div class=\"contenedor\">\n      <div class=\"caja\">Uno</div>\n      <div class=\"caja\">Dos</div>\n      <div class=\"caja\">Tres</div>\n    </div>\n  </body>\n</html>",
      validationRules: [
        { pattern: "display:\\s*flex", flags: "si", negated: false },
        { pattern: "justify-content:\\s*center", flags: "si", negated: false }
      ],
      successMessage: "¡Eres un maestro de Flexbox! Esta es la herramienta más usada en CSS."
    }
  },
  {
    id: 10,
    title: "10. Interactividad con :hover",
    description: "Dale vida a tus botones y enlaces.",
    theory: `
# Pseudoclases en CSS
Podemos cambiar los estilos dependiendo de lo que hace el usuario. La pseudoclase más famosa es \`:hover\`.

## :hover
Se activa cuando el usuario pasa el mouse por encima del elemento. Se escribe pegado al selector, sin espacios.

\`\`\`css
button {
  background-color: blue;
  color: white;
}

button:hover {
  background-color: red; /* Cambia a rojo al pasar el mouse */
}
\`\`\`
    `,
    task: {
      title: "Desafío: El Botón Dinámico",
      instruction: "Añade la regla `.boton-magico:hover` para que el `background-color` cambie a `orange` cuando el mouse pase por encima.",
      initialCode: "<!DOCTYPE html>\n<html>\n  <head>\n    <style>\n      .boton-magico {\n        background-color: blue;\n        color: white;\n        padding: 10px 20px;\n        border: none;\n        border-radius: 5px;\n        cursor: pointer;\n      }\n      \n      /* Escribe la regla hover aquí abajo */\n      \n    </style>\n  </head>\n  <body>\n    <button class=\"boton-magico\">Pasa el mouse</button>\n  </body>\n</html>",
      validationRules: [
        { pattern: "\\.boton-magico:hover\\s*{", flags: "si", negated: false },
        { pattern: "background-color:\\s*orange", flags: "si", negated: false }
      ],
      successMessage: "¡Felicidades! Has completado el curso de CSS."
    }
  },
  {
    id: 11,
    title: "11. Introducción a JavaScript",
    description: "El cerebro de tu página web.",
    theory: `
# ¿Qué es JavaScript (JS)?
Si HTML es el esqueleto y CSS es el estilo, **JS es el cerebro y los músculos**. Permite que la página piense, calcule y responda al usuario.

## ¿Dónde se escribe?
El código JS vive dentro de la etiqueta \`<script>\`.

## Tu primer hechizo: alert()
La función \`alert()\` hace que el navegador muestre un mensaje emergente en la pantalla.

\`\`\`javascript
<script>
  alert("¡Hola desde JavaScript!");
</script>
\`\`\`
    `,
    task: {
      title: "Desafío: Hablando con el usuario",
      instruction: "En el bloque `<script>`, escribe un `alert()` que diga exactamente `'¡Despierta!'` (con comillas simples o dobles).",
      initialCode: "<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Mi primera magia</h1>\n    \n    <script>\n      /* Escribe tu alert aquí */\n      \n    </script>\n  </body>\n</html>",
      validationRules: [
        { pattern: "alert\\s*\\(\\s*['\"]¡Despierta!['\"]\\s*\\)", flags: "i", negated: false }
      ],
      successMessage: "¡Excelente! Has ejecutado tu primera línea de código en JS."
    }
  },
  {
    id: 12,
    title: "12. Variables en JS",
    description: "Aprende a guardar información en la memoria.",
    theory: `
# La Memoria de la Web
Para que un programa sea inteligente, necesita recordar cosas. En JS usamos **Variables**, que son como "cajas" con un nombre donde guardamos datos.

## let y const
- \`let\`: Crea una variable que puede cambiar en el futuro (ej. el puntaje de un juego).
- \`const\`: Crea una constante que NO puede cambiar (ej. tu fecha de nacimiento).

\`\`\`javascript
let vidas = 3;
const nombre = "Zelda";

// Podemos cambiar la variable 'vidas' más adelante:
vidas = 2;
\`\`\`
    `,
    task: {
      title: "Desafío: Guardando secretos",
      instruction: "Crea una variable llamada `nombreMagico` usando `const` y asígnale el valor `'Harry'`. Luego, crea una variable `puntos` usando `let` y asígnale el número `100`.",
      initialCode: "<!DOCTYPE html>\n<html>\n  <body>\n    <script>\n      // 1. Crea la const nombreMagico\n      \n      \n      // 2. Crea el let puntos\n      \n      \n    </script>\n  </body>\n</html>",
      validationRules: [
        { pattern: "const\\s+nombreMagico\\s*=\\s*['\"]Harry['\"]", flags: "si", negated: false },
        { pattern: "let\\s+puntos\\s*=\\s*100", flags: "si", negated: false }
      ],
      successMessage: "¡Muy bien! Ahora la página web tiene memoria."
    }
  },
  {
    id: 13,
    title: "13. El DOM (Document Object Model)",
    description: "Conecta JavaScript con tu HTML.",
    theory: `
# El Puente Mágico (DOM)
JS y HTML viven separados. Para que JS pueda modificar el HTML, usa un puente llamado **DOM** (El Documento).

## Seleccionando elementos
Con \`document.querySelector()\` puedes buscar cualquier etiqueta, clase o ID del HTML, ¡igual que en CSS!

\`\`\`javascript
// Busca la etiqueta <h1>
const miTitulo = document.querySelector('h1');

// Busca el elemento con el ID "boton-jugar" (#)
const boton = document.querySelector('#boton-jugar');
\`\`\`
    `,
    task: {
      title: "Desafío: Atrapando el elemento",
      instruction: "Usa `document.querySelector` para seleccionar el párrafo con el id `#mensaje` y guárdalo en una constante llamada `parrafo`.",
      initialCode: "<!DOCTYPE html>\n<html>\n  <body>\n    <p id=\"mensaje\">Atrápame si puedes</p>\n    \n    <script>\n      // Escribe tu código aquí\n      \n    </script>\n  </body>\n</html>",
      validationRules: [
        { pattern: "const\\s+parrafo\\s*=\\s*document\\.querySelector\\s*\\(\\s*['\"]#mensaje['\"]\\s*\\)", flags: "si", negated: false }
      ],
      successMessage: "¡Perfecto! Ya tienes el control sobre el elemento."
    }
  },
  {
    id: 14,
    title: "14. Eventos (Escuchando acciones)",
    description: "Haz que tu página reaccione a los clics del usuario.",
    theory: `
# Event Listeners
Ahora que tenemos el elemento en una variable, podemos decirle a JS que "escuche" (Listen) cuando el usuario interactúa con él.

## addEventListener
Esta función recibe dos cosas: qué escuchar (ej: \`'click'\`) y qué hacer cuando pase (una función \`() => {}\`).

\`\`\`javascript
const boton = document.querySelector('#mi-boton');

boton.addEventListener('click', () => {
  alert('¡Me hiciste clic!');
});
\`\`\`
    `,
    task: {
      title: "Desafío: El Botón Hablador",
      instruction: "Selecciona el botón con id `#saludar`. Luego añádele un `addEventListener` de tipo `'click'` que muestre un `alert('¡Hola!')`.",
      initialCode: "<!DOCTYPE html>\n<html>\n  <body>\n    <button id=\"saludar\">Haz clic para saludar</button>\n    \n    <script>\n      // 1. Selecciona el botón\n      \n      \n      // 2. Añade el Event Listener\n      \n    </script>\n  </body>\n</html>",
      validationRules: [
        { pattern: "document\\.querySelector\\s*\\(\\s*['\"]#saludar['\"]\\s*\\)", flags: "si", negated: false },
        { pattern: "addEventListener\\s*\\(\\s*['\"]click['\"]", flags: "si", negated: false },
        { pattern: "alert\\s*\\(\\s*['\"]¡Hola!['\"]\\s*\\)", flags: "i", negated: false }
      ],
      successMessage: "¡Increíble! Ahora tu página es completamente interactiva."
    }
  },
  {
    id: 15,
    title: "15. Modificando el DOM",
    description: "Cambia textos y estilos en tiempo real.",
    theory: `
# Cambiando la Realidad
Ya podemos escuchar eventos. El último paso es cambiar la página sin recargarla.

## textContent y style
Si tienes un elemento guardado en una variable, puedes modificar sus propiedades:
- \`elemento.textContent\`: Cambia el texto interno.
- \`elemento.style.color\`: Cambia un estilo CSS (Ojo: en JS las propiedades CSS como \`background-color\` se escriben \`backgroundColor\`).

\`\`\`javascript
const titulo = document.querySelector('h1');

titulo.addEventListener('click', () => {
  titulo.textContent = "Texto Hackeado";
  titulo.style.color = "red";
});
\`\`\`
    `,
    task: {
      title: "Desafío: El Hacker",
      instruction: "Selecciona el `<h1>`. Añádele un evento `'click'`. Cuando se haga clic, cambia su `textContent` a `'Hackeado'` y su `style.color` a `'red'`.",
      initialCode: "<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Soy seguro</h1>\n    \n    <script>\n      // Escribe tu código aquí\n      \n    </script>\n  </body>\n</html>",
      validationRules: [
        { pattern: "document\\.querySelector\\s*\\(\\s*['\"]h1['\"]\\s*\\)", flags: "si", negated: false },
        { pattern: "addEventListener\\s*\\(\\s*['\"]click['\"]", flags: "si", negated: false },
        { pattern: "\\.textContent\\s*=\\s*['\"]Hackeado['\"]", flags: "si", negated: false },
        { pattern: "\\.style\\.color\\s*=\\s*['\"]red['\"]", flags: "si", negated: false }
      ],
      successMessage: "¡Felicidades! Eres un verdadero maestro de JavaScript y del DOM."
    }
  }
];
