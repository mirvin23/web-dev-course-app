export const steamModules = [
  // HTML
  {
    category: "HTML",
    title: "1. Estructura e Identidad Escolar",
    description: "Aprende a estructurar la página oficial de tu alianza usando cabeceras, contenido principal y pie de página.",
    theory: `¡Se acerca el aniversario de nuestro colegio y la competencia de las Alianzas está que arde! Cada año pasa lo mismo: los grupos de WhatsApp colapsan con mensajes perdidos, las fotos de los puntajes se borran y nadie sabe a qué hora es la competencia de skate o el torneo de videojuegos. El capitán de tu alianza te ha pedido ayuda urgente. Necesita centralizar la información en un sitio web propio para que todo el curso esté coordinado y motivado. Pero para que Google encuentre la página y los navegadores la muestren de forma ordenada a tus compañeros, no basta con tirar texto a la pantalla: necesitamos construir un esqueleto sólido, claro y profesional. En este módulo aprenderás a estructurar la página oficial de tu alianza usando las tres columnas vertebrales del desarrollo web moderno: la cabecera, el contenido principal y el pie de página. ¡Vamos a ganar este aniversario desde el código!

### Lectura Fundamental

Para que una página web no sea un caos de letras, HTML5 utiliza etiquetas **semánticas**. "Semántica" significa que la etiqueta tiene un significado por sí misma, explicándole al navegador, a las inteligencias artificiales y a los lectores de pantalla para personas con discapacidad visual qué tipo de contenido hay dentro.

Imagina una polera de tu colegio: tiene la insignia arriba, el diseño principal al centro y la etiqueta de lavado abajo. En las páginas web es exactamente igual. Las tres etiquetas esenciales para fundar un sitio ordenado son:

1. **\`<header>\` (Cabecera de la página):** Es la parte superior. Aquí va el logotipo, la insignia del colegio, el nombre de tu alianza y los menús de navegación. Nunca se usa para el contenido de los artículos.
2. **\`<main>\` (Contenido Principal):** Es el corazón de tu sitio. Adentro va la información única y más importante de la página (en nuestro caso, las fechas de las competencias y la tabla de posiciones). Solo debe haber **un** \`<main>\` por cada documento HTML.
3. **\`<footer>\` (Pie de página):** Es la zona inferior. Aquí colocamos los créditos, quién diseñó la página (¡tu nombre!), redes sociales y el año de desarrollo.

Revisa con atención este ejemplo de estructura base bien comentada:

\`\`\`html
<!-- Este es el esqueleto semántico inicial para tu proyecto escolar -->
<header>
    <!-- Todo lo que identifica la identidad del sitio va aquí arriba -->
    <h1>Alianza Azul: Los Mutantes Espaciales 🚀</h1>
    <p>Sitio Oficial del Aniversario 2026</p>
</header>

<main>
    <!-- Aquí se concentra la información más importante que cambia el mundo -->
    <h2>Próximo Desafío: Torneo de E-Sports</h2>
    <p>Lugar: Laboratorio de Computación. Hora: 15:30 hrs. ¡Ven a apoyar a tus competidores!</p>
</main>

<footer>
    <!-- Datos de cierre y autoría para dejar tu marca profesional -->
    <p>Desarrollado con ❤️ por el equipo de tecnología de 1° Medio A</p>
    <p>© 2026 Colegio Academia del Saber</p>
</footer>
\`\`\``,
    task: {
      title: "Desafío: Creador de Alianzas",
      instruction: "Usando las etiquetas semánticas aprendidas, crea el esqueleto principal para tu Alianza. Necesitas un <header>, un <main> y un <footer>.",
      initialCode: "<!DOCTYPE html>\n<html>\n<body>\n  <!-- Crea aquí la estructura semántica de tu Alianza -->\n\n</body>\n</html>",
      validationRules: [
        { pattern: "<header>.*<\\/header>", flags: "si", negated: false },
        { pattern: "<main>.*<\\/main>", flags: "si", negated: false },
        { pattern: "<footer>.*<\\/footer>", flags: "si", negated: false }
      ],
      successMessage: "¡Excelente! Has creado una estructura semántica profesional para tu alianza."
    }
  },

  // HTML
  {
    id: 2, category: "HTML", title: "2. Rutas de Navegación Interna",
    description: "Organiza el Kiosco Saludable usando menú de navegación y listas descriptivas.",
    theory: "### Navegación HTML\nUsa `<nav>` para menús principales y listas `<ul>`/`<li>` para organizar los enlaces a diferentes secciones del colegio.",
    task: { title: "Menú del Kiosco", instruction: "Crea un elemento <nav> con una lista de 3 enlaces (<a>).", initialCode: "<nav>\n  <ul>\n    \n  </ul>\n</nav>", validationRules: [{ pattern: "<nav>", flags: "i", negated: false }, { pattern: "<li>", flags: "i", negated: false }], successMessage: "¡Menú listo!" }
  },
  {
    id: 3, category: "HTML", title: "3. Bloques de Información Independiente",
    description: "Crea el Periódico Mural Digital usando sections y articles.",
    theory: "### Sections y Articles\nUsa `<section>` para separar grandes temas, y `<article>` para publicaciones individuales, como noticias o crónicas.",
    task: { title: "Periódico Mural", instruction: "Crea un <section> que contenga al menos un <article>.", initialCode: "<section>\n  \n</section>", validationRules: [{ pattern: "<article>", flags: "i", negated: false }], successMessage: "¡Periódico estructurado!" }
  },
  {
    id: 4, category: "HTML", title: "4. Datos Complementarios y Tendencias",
    description: "Añade una sección lateral para efemérides usando aside.",
    theory: "### Aside\nLa etiqueta `<aside>` es perfecta para barras laterales, widgets, anuncios o información complementaria que no es el contenido principal.",
    task: { title: "Barra de Efemérides", instruction: "Crea un <aside> con un título y un párrafo.", initialCode: "<body>\n  <main></main>\n  \n</body>", validationRules: [{ pattern: "<aside>", flags: "i", negated: false }], successMessage: "¡Barra lateral añadida!" }
  },
  {
    id: 5, category: "HTML", title: "5. Recursos Visuales con Sentido",
    description: "Arma la galería de arte digital usando figures y figcaption.",
    theory: "### Figuras y Leyendas\nPara agrupar una imagen con su pie de foto, usa `<figure>` e incluye un `<img>` y un `<figcaption>`.",
    task: { title: "Galería de Arte", instruction: "Añade un <figure> que contenga un <img> y un <figcaption>.", initialCode: "<figure>\n  \n</figure>", validationRules: [{ pattern: "<figcaption>", flags: "i", negated: false }, { pattern: "<img", flags: "i", negated: false }], successMessage: "¡Galería de arte hermosa!" }
  },
  {
    id: 6, category: "HTML", title: "6. Captura de Datos Estudiantiles I",
    description: "Crea tu primer formulario para inscribir alumnos a clubes.",
    theory: "### Formularios Básicos\nEn HTML usamos `<form>` para envolver inputs. Aprenderás a usar `<input type=\"text\">` y `<input type=\"email\">` para capturar datos vitales de los estudiantes.",
    task: { title: "Inscripción de Clubes", instruction: "Crea un formulario con un input de texto y un input de email.", initialCode: "<form>\n\n</form>", validationRules: [{ pattern: "<input.*type=[\"']text[\"'].*>", flags: "i", negated: false }, { pattern: "<input.*type=[\"']email[\"'].*>", flags: "i", negated: false }], successMessage: "¡Formulario creado!" }
  },
  {
    id: 7, category: "HTML", title: "7. Captura de Datos Estudiantiles II",
    description: "Mejora tus formularios con selects y áreas de texto.",
    theory: "### Formularios Avanzados\nAgrega selectores (`<select>`), áreas de texto libre (`<textarea>`) y validaciones nativas (`required`).",
    task: { title: "Buzón de Sugerencias", instruction: "Crea un <textarea> y un <select> con opciones.", initialCode: "<form>\n\n</form>", validationRules: [{ pattern: "<textarea.*>.*<\\/textarea>", flags: "si", negated: false }, { pattern: "<select.*>.*<\\/select>", flags: "si", negated: false }], successMessage: "¡Excelente buzón!" }
  },
  {
    id: 8, category: "HTML", title: "8. Arquitectura de Datos Tabulares",
    description: "Aprende a estructurar horarios y calendarios con tablas HTML.",
    theory: "### Tablas\nUsa `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, y `<td>` para organizar información como el calendario de pruebas.",
    task: { title: "Calendario de Evaluaciones", instruction: "Crea una tabla con un thead (con <th>) y un tbody (con <td>).", initialCode: "<table>\n\n</table>", validationRules: [{ pattern: "<thead>.*<\\/thead>", flags: "si", negated: false }, { pattern: "<tbody>.*<\\/tbody>", flags: "si", negated: false }], successMessage: "¡Tabla impecable!" }
  },
  {
    id: 9, category: "HTML", title: "9. Hipervínculos e Interconexión de Saberes",
    description: "Conecta tu sitio web con el resto del internet.",
    theory: "### Enlaces Absolutos y Relativos\nAprende a usar atributos avanzados en `<a>` como `target=\"_blank\"` para abrir guías en nuevas pestañas.",
    task: { title: "Central de Recursos", instruction: "Crea un enlace <a> que se abra en una nueva pestaña usando target='_blank'.", initialCode: "<body>\n\n</body>", validationRules: [{ pattern: "<a.*target=[\"']_blank[\"'].*>.*<\\/a>", flags: "i", negated: false }], successMessage: "¡Estás conectado al mundo!" }
  },
  {
    id: 10, category: "HTML", title: "10. Proyecto Integrador HTML5",
    description: "Aplica todo lo aprendido en un gran portafolio digital.",
    theory: "### Consolidación\nEs hora de armar el portafolio de tu equipo usando header, main, footer, sections, articles, formularios y tablas.",
    task: { title: "Portafolio del Equipo", instruction: "Integra <header>, <main>, <form> y <table> en un solo documento.", initialCode: "<!DOCTYPE html>\n<html>\n<body>\n\n</body>\n</html>", validationRules: [{ pattern: "<header>", flags: "i", negated: false }, { pattern: "<table>", flags: "i", negated: false }], successMessage: "¡Has dominado HTML5 Semántico!" }
  },

  // CSS
  {
    id: 11, category: "CSS", title: "1. Inyección de Identidad Visual",
    description: "Dale color y vida al fanzine de la banda escolar.",
    theory: "### Colores y Fuentes Básicas\nAprende a cambiar el color del texto con `color` y el fondo con `background-color`.",
    task: { title: "Fanzine Musical", instruction: "Cambia el color del body a 'blue' y su background-color a 'black'.", initialCode: "body {\n  \n}", validationRules: [{ pattern: "color:\\s*blue", flags: "i", negated: false }, { pattern: "background-color:\\s*black", flags: "i", negated: false }], successMessage: "¡Qué estilo!" }
  },
  {
    id: 12, category: "CSS", title: "2. Anatomía de una Etiqueta (Modelo de Caja)",
    description: "Diseña las tarjetas para el Centro de Alumnos controlando los espacios.",
    theory: "### El Modelo de Caja (Box Model)\nTodo en CSS es una caja. Controla el espacio interior con `padding`, el borde con `border` y el espacio exterior con `margin`.",
    task: { title: "Tarjeta Electoral", instruction: "Añade un padding de 20px y un margin de 10px a la clase .card.", initialCode: ".card {\n  \n}", validationRules: [{ pattern: "padding:\\s*20px", flags: "i", negated: false }, { pattern: "margin:\\s*10px", flags: "i", negated: false }], successMessage: "¡Tarjeta perfectamente espaciada!" }
  },
  {
    id: 13, category: "CSS", title: "3. Control y Precisión Quirúrgica",
    description: "Resalta tareas importantes usando selectores avanzados.",
    theory: "### Clases e IDs\nUsa `.` para clases (múltiples elementos) y `#` para IDs (elementos únicos).",
    task: { title: "Agenda Escolar", instruction: "Aplica color rojo a la clase .urgente y font-weight: bold al ID #examen.", initialCode: "/* Escribe tus selectores aquí */\n", validationRules: [{ pattern: "\\.urgente\\s*{[^}]*color:\\s*red", flags: "i", negated: false }, { pattern: "#examen\\s*{[^}]*font-weight:\\s*bold", flags: "i", negated: false }], successMessage: "¡Prioridades marcadas!" }
  },
  {
    id: 14, category: "CSS", title: "4. Interactividad Dinámica de Superficie",
    description: "Crea botones de votación que reaccionan al pasar el mouse.",
    theory: "### Pseudoclases\nUsa `:hover` para cambiar estilos cuando el usuario pasa el mouse, y `:active` cuando hace clic.",
    task: { title: "Botones de Votación", instruction: "Haz que los botones cambien de color a verde al pasar el mouse usando :hover.", initialCode: "button {\n  color: black;\n}\n/* Añade tu hover aquí */\n", validationRules: [{ pattern: "button:hover\\s*{[^}]*color:\\s*green", flags: "i", negated: false }], successMessage: "¡Interacción viva!" }
  },
  {
    id: 15, category: "CSS", title: "5. Flujo y Comportamiento de Elementos",
    description: "Oculta o muestra avisos importantes de la intranet escolar.",
    theory: "### Display\nControla si un elemento es de bloque (`display: block`), si fluye con el texto (`inline`), o si se oculta por completo (`none`).",
    task: { title: "Avisos del Colegio", instruction: "Oculta la clase .secreto usando display: none.", initialCode: ".secreto {\n  \n}", validationRules: [{ pattern: "display:\\s*none", flags: "i", negated: false }], successMessage: "¡Aviso oculto!" }
  },
  {
    id: 16, category: "CSS", title: "6. El Universo Unidimensional (Flexbox I)",
    description: "Domina Flexbox para alinear el menú de la radio escolar.",
    theory: "### Introducción a Flexbox\nConvierte cualquier contenedor en un entorno flexible con `display: flex` y alinea sus hijos con `justify-content`.",
    task: { title: "Alineando el Menú", instruction: "Aplica display: flex y justify-content: center a la clase .menu.", initialCode: ".menu {\n  \n}", validationRules: [{ pattern: "display:\\s*flex", flags: "i", negated: false }, { pattern: "justify-content:\\s*center", flags: "i", negated: false }], successMessage: "¡Menú alineado perfectamente!" }
  },
  {
    id: 17, category: "CSS", title: "7. Distribución Multilínea (Flexbox II)",
    description: "Aprende a distribuir galerías de fotos del campamento.",
    theory: "### Flexbox Avanzado\nUsa `flex-wrap: wrap` para que los elementos fluyan a la siguiente línea cuando no haya espacio.",
    task: { title: "Galería de Fotos", instruction: "Agrega flex-wrap: wrap y align-items: center a la clase .gallery.", initialCode: ".gallery {\n  display: flex;\n  \n}", validationRules: [{ pattern: "flex-wrap:\\s*wrap", flags: "i", negated: false }, { pattern: "align-items:\\s*center", flags: "i", negated: false }], successMessage: "¡Galería responsiva lista!" }
  },
  {
    id: 18, category: "CSS", title: "8. El Plano Bidimensional (CSS Grid)",
    description: "Estructura el horario de clases con precisión milimétrica.",
    theory: "### CSS Grid Essentials\nGrid permite estructurar contenido en columnas y filas. Usa `grid-template-columns` para definir la grilla.",
    task: { title: "Horario Escolar", instruction: "Aplica display: grid y define 3 columnas con grid-template-columns en .schedule.", initialCode: ".schedule {\n  \n}", validationRules: [{ pattern: "display:\\s*grid", flags: "i", negated: false }, { pattern: "grid-template-columns", flags: "i", negated: false }], successMessage: "¡Horario perfectamente cuadriculado!" }
  },
  {
    id: 19, category: "CSS", title: "9. Adaptabilidad Móvil (Responsive Design)",
    description: "Haz que la minuta del casino se vea bien en celulares.",
    theory: "### Media Queries\nUsa `@media (max-width: 768px)` para cambiar los estilos cuando la pantalla es pequeña.",
    task: { title: "Minuta Responsiva", instruction: "Crea una media query para pantallas de máximo 768px y cambia el color de fondo a red.", initialCode: "/* Escribe tu media query aquí */\n", validationRules: [{ pattern: "@media.*max-width:\\s*768px", flags: "i", negated: false }], successMessage: "¡Diseño apto para móviles!" }
  },
  {
    id: 20, category: "CSS", title: "10. Proyecto Integrador CSS",
    description: "Crea el Dashboard de notas combinando Grid y Flexbox.",
    theory: "### Consolidación CSS\nCombina todos tus conocimientos para estilizar un panel de control avanzado.",
    task: { title: "Dashboard de Notas", instruction: "Aplica display: grid al contenedor principal y display: flex a las tarjetas.", initialCode: ".dashboard {\n  \n}\n.card {\n  \n}", validationRules: [{ pattern: "display:\\s*grid", flags: "i", negated: false }, { pattern: "display:\\s*flex", flags: "i", negated: false }], successMessage: "¡Has dominado CSS Moderno!" }
  },

  // JS
  {
    id: 21, category: "JavaScript", title: "1. Memoria del Navegador y Tipos de Datos",
    description: "Crea tu primer calculador de promedios para saber si pasas de curso.",
    theory: "### Variables\nUsa `let` para variables que cambian y `const` para valores fijos. Aprenderemos sobre números (`number`) y texto (`string`).",
    task: { title: "Calculador de Promedios", instruction: "Declara una variable const llamada 'promedio' con el valor 6.5.", initialCode: "// Tu código JS\n", validationRules: [{ pattern: "const\\s+promedio\\s*=\\s*6\\.5", flags: "i", negated: false }], successMessage: "¡Excelente inicio!" }
  },
  {
    id: 22, category: "JavaScript", title: "2. Motores Aritméticos y Concatenación",
    description: "Suma los puntajes totales de las Alianzas.",
    theory: "### Matemáticas Básicas\nPuedes sumar `+`, restar `-`, multiplicar `*` o dividir `/`. También puedes unir texto con variables usando `\${var}`.",
    task: { title: "Simulador de Alianzas", instruction: "Crea una variable 'total' que sume 500 y 300.", initialCode: "// Escribe tu suma\n", validationRules: [{ pattern: "total\\s*=\\s*500\\s*\\+\\s*300", flags: "i", negated: false }], successMessage: "¡Suma perfecta!" }
  },
  {
    id: 23, category: "JavaScript", title: "3. Tomando Decisiones en la Escuela I",
    description: "Dile a los alumnos si el taller de fútbol tiene cupos usando if/else.",
    theory: "### Condicionales Simples\nUsa `if (condición) { ... }` para ejecutar código solo si la condición es verdadera.",
    task: { title: "Control de Cupos", instruction: "Crea un if que verifique si la variable cupos es mayor que 0.", initialCode: "let cupos = 5;\n// Escribe tu if aquí\n", validationRules: [{ pattern: "if\\s*\\(\\s*cupos\\s*>\\s*0\\s*\\)", flags: "i", negated: false }], successMessage: "¡Lógica dominada!" }
  },
  {
    id: 24, category: "JavaScript", title: "4. Decisiones Complejas y Matrices",
    description: "Recomienda talleres extraescolares mezclando múltiples condiciones.",
    theory: "### Lógica Compleja\nUsa `&&` (Y) cuando ambas condiciones deben cumplirse, y `||` (O) si basta con una.",
    task: { title: "Recomendador de Talleres", instruction: "Usa un if con && para verificar si edad > 12 y leGustaElArte es true.", initialCode: "let edad = 14;\nlet leGustaElArte = true;\n// Tu if aquí\n", validationRules: [{ pattern: "&&", flags: "i", negated: false }], successMessage: "¡Condicional complejo exitoso!" }
  },
  {
    id: 25, category: "JavaScript", title: "5. Automatización de Tareas Repetitivas",
    description: "Convierte puntos en descuentos con funciones automáticas.",
    theory: "### Funciones\nLas funciones encapsulan código para reutilizarlo. Las declaras con `function nombre(parametro) { return valor; }`.",
    task: { title: "Conversor de Puntos", instruction: "Crea una función llamada 'calcularDescuento' que acepte 'puntos'.", initialCode: "// Escribe la función\n", validationRules: [{ pattern: "function\\s+calcularDescuento\\s*\\(.*puntos.*\\)", flags: "i", negated: false }], successMessage: "¡Automatización lograda!" }
  },
  {
    id: 26, category: "JavaScript", title: "6. Puentes de Conexión (El DOM)",
    description: "Conecta tu JavaScript con el HTML para modificarlo.",
    theory: "### Introducción al DOM\nUsa `document.getElementById()` para encontrar elementos en tu página y modificar su texto con `innerText`.",
    task: { title: "Modificar Título", instruction: "Selecciona el id 'title' y cambia su texto a 'Hola Mundo'.", initialCode: "// Escribe tu código JS aquí\n", validationRules: [{ pattern: "document\\.getElementById\\(['\"]title['\"]\\)", flags: "i", negated: false }], successMessage: "¡Has manipulado el DOM!" }
  },
  {
    id: 27, category: "JavaScript", title: "7. Capturando Acciones (Eventos)",
    description: "Crea botones interactivos que respondan a los clics.",
    theory: "### Escucha de Eventos\nAprende a usar `addEventListener('click', ...)` para ejecutar código cuando el usuario hace clic.",
    task: { title: "Contador de Votos", instruction: "Añade un event listener de 'click' a una variable btn.", initialCode: "const btn = document.querySelector('button');\n// Añade el evento aquí\n", validationRules: [{ pattern: "addEventListener\\(['\"]click['\"]", flags: "i", negated: false }], successMessage: "¡Botón interactivo creado!" }
  },
  {
    id: 28, category: "JavaScript", title: "8. Contenedores Masivos (Arrays)",
    description: "Almacena la lista de útiles escolares en una sola variable.",
    theory: "### Arreglos\nUn array es una lista ordenada de valores. Se declaran con `[]` y puedes medir su longitud con `.length`.",
    task: { title: "Lista de Útiles", instruction: "Crea un array llamado 'utiles' con al menos 3 elementos.", initialCode: "// Crea tu array aquí\n", validationRules: [{ pattern: "const utiles\\s*=\\s*\\[.*\\]", flags: "i", negated: false }], successMessage: "¡Lista almacenada con éxito!" }
  },
  {
    id: 29, category: "JavaScript", title: "9. Procesamiento Automatizado (Bucles)",
    description: "Renderiza automáticamente el presupuesto de fin de año.",
    theory: "### Iteración de Arreglos\nUsa `for` o `forEach` para recorrer un array y realizar acciones para cada elemento.",
    task: { title: "Renderizado de Presupuesto", instruction: "Usa el método forEach en el array 'precios'.", initialCode: "const precios = [1000, 2000, 3000];\n// Escribe tu forEach aquí\n", validationRules: [{ pattern: "precios\\.forEach\\(", flags: "i", negated: false }], successMessage: "¡Iteración completada!" }
  },
  {
    id: 30, category: "JavaScript", title: "10. Proyecto Integrador JavaScript",
    description: "Construye una trivia interactiva para ganar puntos en las alianzas.",
    theory: "### Consolidación JS\nCombina variables, funciones, DOM, eventos, arreglos y bucles para crear un juego funcional.",
    task: { title: "Trivia Interactiva", instruction: "Crea una función llamada 'checkAnswer' que valide respuestas.", initialCode: "// Escribe tu función aquí\n", validationRules: [{ pattern: "function checkAnswer", flags: "i", negated: false }], successMessage: "¡Felicidades, eres un maestro de JavaScript!" }
  }
];
