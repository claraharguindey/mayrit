const CATS = {
  mm: {
    title: "Modelos y moldes",
    total: 32,
    num: "01",
    subtitle: "Modelar la ausencia. Vaciados, reproducciones y copias.",
    meta: ["32 imágenes"],
    body: `<p>...</p>`,
  },

  me: {
    title: "Modelos extractivos",
    total: 23,
    num: "02",
    subtitle: "Wanderwörter: (Super)modelos como herramientas coloniales.",
    meta: ["28 imágenes"],
    body: `<p>...</p>`,
  },

  mt: {
    title: "Modelos taxonómicos",
    total: 21,
    num: "03",
    subtitle: "Cuerpo y dataset.",
    meta: ["21 imágenes"],
    body: `<p>...</p>`,
  },

  ms: {
    title: "Modelos sonoros",
    total: 23,
    num: "04",
    subtitle: "El sonido como infraestructura sensible de control.",
    meta: ["23 imágenes"],
    body: `<p>...</p>`,
  },
};

/* ======================================================
   BUILD POOL
====================================================== */

function makePool(filter) {
  const pools = {};

  Object.keys(CATS).forEach((k) => {
    if (filter !== "all" && k !== filter) return;

    pools[k] = [];

    for (let i = 1; i <= CATS[k].total; i++) {
      pools[k].push({
        cat: k,
        n: i,
      });
    }
  });

  const out = [];

  let any = true;

  while (any) {
    any = false;

    Object.keys(pools).forEach((k) => {
      if (pools[k]?.length) {
        out.push(pools[k].shift());
        any = true;
      }
    });
  }

  return out;
}

let pool = makePool("all");

/* ======================================================
   GRID
====================================================== */

const GAP = 8;
const NAV_H = 48;

const gallery = document.getElementById("gallery");
const vgrid = document.getElementById("vgrid");

let cols = 9;
let cellPx = 100;

let offsetY = 0;
let velocity = 0;

const cells = [];

/* ======================================================
   RESPONSIVE COLS
====================================================== */

function getCols() {
  const w = window.innerWidth;

  if (w <= 500) return 3;
  if (w <= 800) return 5;
  if (w <= 1100) return 7;

  return 9;
}

/* ======================================================
   MEASURE
====================================================== */

function measure() {
  cols = getCols();

  const inner = window.innerWidth - GAP * 2;

  cellPx = (inner - GAP * (cols - 1)) / cols;
}

/* ======================================================
   LOOP ROWS
====================================================== */

function getLoopRows() {
  const rowH = cellPx + GAP;

  return Math.ceil(window.innerHeight / rowH) + 14;
}

/* ======================================================
   BUILD GRID
====================================================== */

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

    cells.push({
      el: cell,
      img,
      currentSrc: "",
      currentIndex: -1,
    });

    /* ==========================================
       PRECARGA INICIAL
    ========================================== */

    const row = Math.floor(i / cols);
    const col = i % cols;

    const itemIndex = row * cols + col;

    const item = pool[itemIndex % pool.length];

    const num = String(item.n).padStart(2, "0");

    const id = `${item.cat}-${num}`;

    const src = `./${item.cat}/${id}.webp`;

    img.src = src;

    cell.dataset.cat = item.cat;

    cell.dataset.label = `${CATS[item.cat].title} — ${id}`;

    cells[cells.length - 1].currentSrc = src;
  }

  layout();
}

/* ======================================================
   LAYOUT
====================================================== */

function layout() {
  const rowH = cellPx + GAP;

  const LOOP_ROWS = getLoopRows();

  const totalH = LOOP_ROWS * rowH;

  const BUFFER = rowH * 4;

  const loopH = totalH + BUFFER * 2;

  const baseRow = Math.floor(-offsetY / rowH);

  cells.forEach((c, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;

    const x = GAP + col * (cellPx + GAP);

    let y = row * rowH + offsetY + NAV_H;

    y = ((((y + BUFFER) % loopH) + loopH) % loopH) - BUFFER;

    c.el.style.width = `${cellPx}px`;
    c.el.style.height = `${cellPx}px`;

    c.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    /* ==========================================
       CONTENT MAPPING
    ========================================== */

    const visibleRow = Math.round((y + BUFFER) / rowH);

    const contentRow = baseRow + visibleRow;

    const itemIndex = contentRow * cols + col;

    const normalizedIndex =
      ((itemIndex % pool.length) + pool.length) % pool.length;

    const item = pool[normalizedIndex];

    const num = String(item.n).padStart(2, "0");

    const id = `${item.cat}-${num}`;

    const src = `./${item.cat}/${id}.webp`;

    /* ==========================================
       SOLO RECICLAR FUERA DE PANTALLA
    ========================================== */

    const isVisible = y > -rowH && y < window.innerHeight + rowH;

    if (!isVisible && c.currentSrc !== src) {
      c.currentSrc = src;

      c.img.src = src;

      c.el.dataset.cat = item.cat;

      c.el.dataset.label = `${CATS[item.cat].title} — ${id}`;
    }
  });

  vgrid.style.height = `${totalH}px`;
}

/* ======================================================
   ANIMATION
====================================================== */

function animate() {
  offsetY += velocity;

  velocity *= 0.92;

  if (Math.abs(velocity) < 0.01) {
    velocity = 0;
  }

  layout();

  requestAnimationFrame(animate);
}

/* ======================================================
   WHEEL
====================================================== */

window.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();

    velocity -= e.deltaY * 0.12;
  },
  { passive: false },
);

/* ======================================================
   TOUCH
====================================================== */

let touchLastY = 0;

window.addEventListener(
  "touchstart",
  (e) => {
    touchLastY = e.touches[0].clientY;

    velocity = 0;
  },
  { passive: true },
);

window.addEventListener(
  "touchmove",
  (e) => {
    const y = e.touches[0].clientY;

    const delta = y - touchLastY;

    touchLastY = y;

    velocity = delta * 0.8;

    offsetY += delta;

    layout();
  },
  { passive: true },
);

/* ======================================================
   RESIZE
====================================================== */

function refresh() {
  measure();

  buildGrid();
}

window.addEventListener("resize", refresh);

/* ======================================================
   FILTERS
====================================================== */

document.querySelectorAll(".fbtn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".fbtn").forEach((b) => b.classList.remove("on"));

    btn.classList.add("on");

    pool = makePool(btn.dataset.f);

    buildGrid();

    if (panel.classList.contains("open")) {
      btn.dataset.f !== "all" ? renderPanel(btn.dataset.f) : renderPanelAll();
    }
  });
});

/* ======================================================
   PANEL
====================================================== */

const panel = document.getElementById("text-panel");

function buildPanelHTML(num, title, subtitle, body, meta) {
  return `
    <div class="panel-inner">

      <div class="panel-number">
        ${num}
      </div>

      <div class="panel-line">
        <h2 class="panel-title">
          ${title}
        </h2>
      </div>

      <div
        class="panel-line"
        style="margin-bottom:1.4rem"
      >
        <p class="panel-subtitle">
          ${subtitle}
        </p>
      </div>

      <div class="panel-body">
        ${body}
      </div>

    </div>

    <div class="panel-footer">

      <div class="panel-meta">
        ${meta.map((m) => `<span>${m}</span>`).join("")}
      </div>

      <button
        class="panel-close-btn"
        onclick="closePanel()"
      >
        Cerrar ×
      </button>

    </div>
  `;
}

function renderPanel(catKey) {
  const cat = CATS[catKey];

  panel.innerHTML = buildPanelHTML(
    cat.num,
    cat.title,
    cat.subtitle,
    cat.body,
    cat.meta,
  );
}

function renderPanelAll() {
  panel.innerHTML = buildPanelHTML(
    "00",
    "Agotamiento y fricción del modelo",
    "Introducción.",
    "<p>...</p>",
    ["104 imágenes"],
  );
}

function openPanel(catKey) {
  if (catKey && catKey !== "all") {
    renderPanel(catKey);
  } else {
    renderPanelAll();
  }

  panel.classList.add("open");

  document.querySelector(".info-btn").classList.add("active");
}

function closePanel() {
  panel.classList.remove("open");

  document.querySelector(".info-btn").classList.remove("active");
}

document.querySelector(".info-btn").addEventListener("click", () => {
  if (panel.classList.contains("open")) {
    closePanel();
  } else {
    const activeFilter = document.querySelector(".fbtn.on")?.dataset.f || "all";

    openPanel(activeFilter);
  }
});

/* ======================================================
   ZOOM
====================================================== */

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

function hideZoom() {
  zbox.style.display = "none";
}

function moveZoom(e) {
  const size = 320;

  let x = e.clientX + 18;
  let y = e.clientY + 18;

  if (x + size > window.innerWidth) {
    x = e.clientX - size - 18;
  }

  if (y + size > window.innerHeight) {
    y = e.clientY - size - 18;
  }

  zbox.style.left = x + "px";
  zbox.style.top = y + "px";
}

gallery.addEventListener("mouseover", (e) => {
  const cell = e.target.closest(".cell");

  if (!cell) return;

  showZoom(cell, e);
});

gallery.addEventListener("mousemove", (e) => {
  if (zbox.style.display === "block") {
    moveZoom(e);
  }
});

gallery.addEventListener("mouseout", (e) => {
  if (!e.relatedTarget?.closest(".cell")) {
    hideZoom();
  }
});

/* ======================================================
   CELL CLICK
====================================================== */

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

    openPanel("all");
  } else {
    document.querySelectorAll(".fbtn").forEach((b) => b.classList.remove("on"));

    const matchBtn = document.querySelector(`.fbtn[data-f="${cat}"]`);

    if (matchBtn) {
      matchBtn.classList.add("on");
    }

    pool = makePool(cat);

    buildGrid();

    openPanel(cat);
  }
});

/* ======================================================
   INIT
====================================================== */

refresh();

animate();

openPanel("all");