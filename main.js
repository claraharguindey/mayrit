const CATS = {
  mm: {
    title: "Modelos y moldes",
    total: 32,
    num: "01",
    subtitle: "Modelar la ausencia. Vaciados, reproducciones y copias.",
    meta: ["32 imágenes"],
    body: `<p>A finales del siglo XIX el arqueólogo napolitano Giuseppe Fiorelli visita Pompeya. Durante el estudio de las ruinas descubre que los cadáveres pompeyanos, al pudrirse y desintegrarse rodeados de ceniza, tras el desastre y su evaporación, han dejado una capa de material duro en la que ha quedado fijada la forma de su cuerpo. El negativo de la carne. Fiorelli entendió este umbral como una oportunidad para modelar el relato y, con una mezcla de yeso y cemento que ocupó los huecos dejados por los pompeyanos, convirtió la ausencia en molde y recuperó el positivo del cadáver.</p>
    <p>Ante la dimensión totalizadora del modelo, ante la capacidad sintética y comunicativa del canon, acercarse a la dimensión material del proceso de modelaje, acercarse al molde, dota al interesado de una pequeña oportunidad para bloquear los conductos por los que escapa la cera al ser presionada por el bronce hirviendo. Comprender o simplemente ver el molde provoca fricciones en el modelo.</p>
    <p>Esta colección de imágenes propone interrumpir el patrón para bloquear la producción, enfriar la mufla o sobrecalentar el kiln. Este relato comienza en Pompeya y articula la narrativa deteniéndose en otros momentos en los que el molde traiciona al (Super)modelo: Pigmalión y Galatea, Santa Verónica, Duchamp o la cueva de Chauvet.</p>`,
  },
  me: {
    title: "Modelos extractivos",
    total: 23,
    num: "02",
    subtitle: "Wanderwörter: (Super)modelos como herramientas coloniales.",
    meta: ["28 imágenes"],
    body: `<p>El supermodelo se enmarca en un mundo que se entiende como una red de flujos de mercancías e información. Las rutas comerciales que trajeron el café y el azúcar a nuestro territorio son las mismas que hoy atraviesan los cables submarinos de Internet. El modelo extractivo no produce nada en los lugares de donde extrae: vacía, traduce, acumula en otro sitio.</p>
    <p>La artista belga Ana Torfs identificó seis palabras que viajan con las mercancías a lo largo de las rutas comerciales y se instalan en las lenguas de llegada borrando el rastro de donde vinieron: café, jengibre, azúcar, tabaco, azafrán, chocolate. En alemán estos términos se denominan <em>Wanderwörter</em> (palabras viajeras) porque se parecen en muchas lenguas sin que ninguna pueda reclamar su origen. La extracción opera también sobre el lenguaje.</p>
    <p>Esta colección de imágenes dota de cuerpos a la infraestructura invisibilizada que sostiene esta red. La nube es un computador que consume agua y electricidad. El cable submarino es un objeto físico tendido por barcos en el fondo del océano. La flor de Minecraft adopta la forma de algo que creció en tierra y la devuelve como bloque, como recurso intercambiable dentro del sistema.</p>`,
  },
  mt: {
    title: "Modelos taxonómicos",
    total: 21,
    num: "03",
    subtitle: "Cuerpo y dataset. How did it make you feel?",
    meta: ["21 imágenes"],
    body: `<p>En 2019 la empresa IBM hace público el dataset <em>Diversity in Faces</em> (DiF) respondiendo a las quejas de sus clientes ante el mal funcionamiento de sus softwares de reconocimiento facial a la hora de dar servicio a personas no blancas. Para clasificar el millón de rostros anónimos que componen el archivo, IBM determina varios parámetros: color de piel, dimensiones, simetría, poses, longitud, ancho y forma de las bocas, narices, frentes y ojos.</p>
    <p>En términos prácticos, y de forma poco maquillada, IBM pone en funcionamiento todas las teorías y prácticas que los mejores eugenistas y frenólogos acuñaron a lo largo del siglo XIX. En 1970, durante el Apartheid en Sudáfrica, IBM colabora con el régimen para desarrollar el pasaporte racial <em>Book of Life</em>, un documento de control y vigilancia donde los ciudadanos sudafricanos reflejaban su información biográfica fijando su identidad racial de por vida.</p>
    <p>El (Super)modelo, deseoso de ordenar y simplificar el mundo, nombra y etiqueta actuando de forma coordinada como espejo y molde. Esta colección investiga los huecos y las grietas del orden, revisando críticamente la propia naturaleza taxonómica del sistema. Como pregunta final: <em>Have you ever been treated unfairly? How did it make you feel?</em></p>`,
  },
  ms: {
    title: "Modelos sonoros",
    total: 23,
    num: "04",
    subtitle: "El sonido como infraestructura sensible de control.",
    meta: ["23 imágenes"],
    body: `<p>En el Madrid de los siglos XVII y XVIII, los chisperos (trabajadores del metal que hacían chispas) fueron empujados a los márgenes de la ciudad por, entre otras razones, el ruido de su oficio. En el siglo XIX, las verduleras de La Cebada y San Ildefonso fueron además de vendedoras, agentes claves en la movilización popular. En julio de 1892, cuando el ayuntamiento les impuso un tributo diario por trabajar, respondieron con gritos y hortalizas como proyectiles convirtiendo la ciudad en un campo de lucha durante dos días.</p>
    <p>Ese mismo ruido expulsado a las periferias volvió al centro como protesta. Cacerolas, cencerros y calderos —herramientas de trabajo— se convertían en instrumentos políticos. En Argentina en 2001, en las plazas del Estado español en 2011, el mismo gesto.</p>
    <p>El modelo que había expulsado el ruido aprendió a usarlo como arma. Chisperos, verduleras y manifestantes conviven con estaciones enterradas bajo colinas para interceptar conversaciones al otro lado del muro, cañones de sonido de largo alcance que dispersan multitudes con dolor físico y frecuencias inaudibles para adultos que expulsan jóvenes de espacios públicos sin dejar huella visible.</p>`,
  },
};

function makePool(filter) {
  const pools = {};
  Object.keys(CATS).forEach((k) => {
    if (filter !== "all" && k !== filter) return;
    pools[k] = [];
    for (let i = 1; i <= CATS[k].total; i++) {
      pools[k].push({ cat: k, n: i });
    }
  });
  const out = [];
  let any = true;
  while (any) {
    any = false;
    Object.keys(CATS).forEach((k) => {
      if (pools[k]?.length) { out.push(pools[k].shift()); any = true; }
    });
  }
  return out;
}

let pool = makePool("all");

const GAP = 8;
const NAV_H = 74; // 34px header Orsini + 40px nav microsite

const gallery = document.getElementById("gallery");
const vgrid = document.getElementById("vgrid");

let cols = 9;
let cellPx = 100;
let offsetY = 0;
let velocity = 0;
const cells = [];

function getCols() {
  const w = window.innerWidth;
  if (w <= 500) return 3;
  if (w <= 800) return 5;
  if (w <= 1100) return 7;
  return 9;
}

function measure() {
  cols = getCols();
  const inner = window.innerWidth - GAP * 2;
  cellPx = (inner - GAP * (cols - 1)) / cols;
}

function getLoopRows() {
  const rowH = cellPx + GAP;
  return Math.ceil(window.innerHeight / rowH) + 14;
}

function buildGrid() {
  vgrid.innerHTML = "";
  cells.length = 0;
  const LOOP_ROWS = getLoopRows();
  const total = LOOP_ROWS * cols;
  for (let i = 0; i < total; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    const img = document.createElement("img");
    img.loading = "lazy";
    img.decoding = "async";
    cell.appendChild(img);
    vgrid.appendChild(cell);
    cells.push({ el: cell, img, currentSrc: "" });
  }
  layout();
}

function layout() {
  const rowH = cellPx + GAP;
  const LOOP_ROWS = getLoopRows();
  const totalH = LOOP_ROWS * rowH;
  const baseRow = Math.floor(-offsetY / rowH);

  cells.forEach((c, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = GAP + col * (cellPx + GAP);

    let y = row * rowH + offsetY;
    y = ((y % totalH) + totalH) % totalH;
    y += NAV_H;

    c.el.style.width = `${cellPx}px`;
    c.el.style.height = `${cellPx}px`;
    c.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    const visualRow = Math.floor(y / rowH);
    const contentRow = baseRow + visualRow;
    const itemIndex = contentRow * cols + col;
    const normalizedIndex = ((itemIndex % pool.length) + pool.length) % pool.length;
    const item = pool[normalizedIndex];
    const num = String(item.n).padStart(2, "0");
    const id = `${item.cat}-${num}`;
    const src = `./${item.cat}/${id}.webp`;

    const isVisible = y > (NAV_H - rowH) && y < window.innerHeight + rowH;

    if (!isVisible && c.currentSrc !== src) {
      c.currentSrc = src;
      c.img.src = src;
      c.el.dataset.cat = item.cat;
      c.el.dataset.label = `${CATS[item.cat].title} — ${id}`;
    }

    // carga inicial
    if (!c.currentSrc) {
      c.currentSrc = src;
      c.img.src = src;
      c.el.dataset.cat = item.cat;
      c.el.dataset.label = `${CATS[item.cat].title} — ${id}`;
    }
  });

  vgrid.style.height = `${totalH}px`;
}

function animate() {
  offsetY += velocity;
  velocity *= 0.92;
  if (Math.abs(velocity) < 0.01) velocity = 0;
  layout();
  requestAnimationFrame(animate);
}

window.addEventListener("wheel", (e) => {
  e.preventDefault();
  velocity -= e.deltaY * 0.12;
}, { passive: false });

let touchLastY = 0;

window.addEventListener("touchstart", (e) => {
  touchLastY = e.touches[0].clientY;
  velocity = 0;
}, { passive: true });

window.addEventListener("touchmove", (e) => {
  const y = e.touches[0].clientY;
  const delta = y - touchLastY;
  touchLastY = y;
  velocity = delta * 0.8;
  offsetY += delta;
  layout();
}, { passive: true });

function showMenu() {
  const m = document.getElementById('orsini-hidden-menu');
  const btn = document.getElementById('orsini-menu-btn');
  const open = m.style.display === 'flex';
  m.style.display = open ? 'none' : 'flex';
  btn.textContent = open ? 'Menú' : 'Cerrar';
}

function refresh() {
  measure();
  buildGrid();
}

window.addEventListener("resize", refresh);

/* ── PANEL ── */

const panel = document.getElementById("text-panel");

function buildPanelHTML(num, title, subtitle, body, meta) {
  return `
    <div class="panel-inner">
      <div class="panel-left">
        <div class="panel-number">${num}</div>
        <h2 class="panel-title">${title}</h2>
        <p class="panel-subtitle">${subtitle}</p>
      </div>
      <div class="panel-body">${body}</div>
    </div>
    <div class="panel-footer">
      <div class="panel-meta">${meta.map(m => `<span>${m}</span>`).join('')}</div>
    </div>
  `;
}


function renderPanel(catKey) {
  const cat = CATS[catKey];
  panel.innerHTML = buildPanelHTML(cat.num, cat.title, cat.subtitle, cat.body, cat.meta);
}

function renderPanelAll() {
  const intro = `<p>Los (Super)modelos, flexibles, oscuros, escalables y en permanente movimiento, ocupan y producen un espacio ambivalente de opresión y oportunidad. Su propia existencia certifica la posibilidad de un mundo distinto mientras las lógicas del canon obligan a la experiencia de un presente muy concreto.</p>
  <p>Este ensayo visual, elaborado por Archivo Orsini para MAYRIT 2026, se preocupa por los momentos y lugares (destellos y espejismos) en los que los (Super)modelos empiezan a perder su capacidad para producir sentido. Proponemos una metodología y unos casos de estudio que permiten compartir las grietas y litigar la idolatría del modelo.</p>
  <p>Confiando en la anécdota y en el gesto, planteamos una investigación dividida en cuatro categorías: <em>molde, modelo extractivo, modelos taxonómicos y modelos sonoros</em>.</p>`;
  panel.innerHTML = buildPanelHTML("00", "Agotamiento y fricción del modelo", "Introducción. Archivo Orsini × MAYRIT Bienal 2026.", intro, ["104 imágenes", "4 categorías"]);
}

function openPanel(catKey) {
  if (catKey && catKey !== "all") renderPanel(catKey);
  else renderPanelAll();
  panel.classList.add("open");
}

function closePanel() {
  panel.classList.remove("open");
}

/* ── FILTROS ── */

document.querySelectorAll(".fbtn").forEach((btn) => {
  btn.addEventListener("click", () => {
    // Móvil: abrir página de texto
    if (window.innerWidth <= 600) {
      window.location.href = `info.html?cat=${btn.dataset.f}`;
      return;
    }
    document.querySelectorAll(".fbtn").forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    pool = makePool(btn.dataset.f);
    buildGrid();
    if (btn.dataset.f !== "all") renderPanel(btn.dataset.f);
    else renderPanelAll();
  });
});

const zbox = document.getElementById("zoom-box");
const zlbl = document.getElementById("zoom-lbl");

function showZoom(cell, e) {
  zbox.innerHTML = "";
  const img = document.createElement("img");
  img.src = cell.querySelector("img").src;
  zbox.appendChild(img);
  zbox.appendChild(zlbl);
  zlbl.textContent = cell.dataset.label;
  zbox.style.display = "block";
  moveZoom(e);
}

function hideZoom() { zbox.style.display = "none"; }

function moveZoom(e) {
  const size = 320;
  let x = e.clientX + 18, y = e.clientY + 18;
  if (x + size > window.innerWidth) x = e.clientX - size - 18;
  if (y + size > window.innerHeight) y = e.clientY - size - 18;
  zbox.style.left = x + "px";
  zbox.style.top = y + "px";
}

gallery.addEventListener("mouseover", (e) => {
  const cell = e.target.closest(".cell");
  if (!cell) return;
  showZoom(cell, e);
});

gallery.addEventListener("mousemove", (e) => {
  if (zbox.style.display === "block") moveZoom(e);
});

gallery.addEventListener("mouseout", (e) => {
  if (!e.relatedTarget?.closest(".cell")) hideZoom();
});

gallery.addEventListener("click", (e) => {
  const cell = e.target.closest(".cell");
  if (!cell) return;
  const cat = cell.dataset.cat;
  if (!CATS[cat]) return;
  const activeBtn = document.querySelector(".fbtn.on");
  const alreadyActive = activeBtn?.dataset.f === cat;

  if (alreadyActive) {
    document.querySelectorAll(".fbtn").forEach((b) => b.classList.remove("on"));
    document.querySelector('.fbtn[data-f="all"]').classList.add("on");
    pool = makePool("all");
    buildGrid();
    renderPanelAll();
  } else {
    document.querySelectorAll(".fbtn").forEach((b) => b.classList.remove("on"));
    const matchBtn = document.querySelector(`.fbtn[data-f="${cat}"]`);
    if (matchBtn) matchBtn.classList.add("on");
    pool = makePool(cat);
    buildGrid();
    renderPanel(cat);
  }
});

/* ── INIT ── */
refresh();
animate();
renderPanelAll();