// ─── Estado do app ────────────────────────────────────────────────────────────
let filtroAtivo = "todos";
let todasVagas = [];

// ─── Renderiza os cards ───────────────────────────────────────────────────────
function renderizarVagas() {
  const container = document.querySelector("#container-vagas");
  const emptyState = document.querySelector("#empty-state");
  const countEl = document.querySelector("#vaga-count");
  if (!container) return;

  const vagas = todasVagas.filter(
    (v) => filtroAtivo === "todos" || v.filter === filtroAtivo,
  );

  container.innerHTML = "";

  if (vagas.length === 0) {
    if (emptyState) emptyState.style.display = "block";
    if (countEl) countEl.textContent = "0 vagas";
    return;
  }

  if (emptyState) emptyState.style.display = "none";
  if (countEl)
    countEl.textContent = `${vagas.length} vaga${vagas.length > 1 ? "s" : ""}`;

  vagas.forEach((vaga, i) => {
    const el = document.createElement("article");
    el.className = "vaga-card";
    el.style.animationDelay = `${i * 0.06}s`;
    el.innerHTML = gerarCardVaga(vaga);
    container.appendChild(el);
  });
}

// ─── Estado de carregamento ───────────────────────────────────────────────────
function mostrarSkeleton() {
  const container = document.querySelector("#container-vagas");
  if (!container) return;
  container.innerHTML = Array(3)
    .fill(
      `
    <article class="vaga-card skeleton-card">
      <div class="card-body">
        <div class="skeleton skeleton-tag"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>
      </div>
      <div class="skeleton skeleton-map"></div>
      <div class="card-footer">
        <div class="skeleton skeleton-date"></div>
        <div class="skeleton skeleton-btn"></div>
      </div>
    </article>
  `,
    )
    .join("");
}

// ─── Template do card ─────────────────────────────────────────────────────────
function gerarCardVaga(vaga) {
  return `
    <div class="card-body">
      <div class="card-header">
        <div class="card-header-left">
          <span class="tag ${vaga.tagClass}">${vaga.causa}</span>
          <h3>${vaga.titulo}</h3>
        </div>
        <span class="distancia"><i class="fa-solid fa-location-dot"></i> ${vaga.distancia}</span>
      </div>
      <p class="card-descricao">${vaga.descricao}</p>
    </div>

    <div class="card-map">
      <iframe
        src="${vaga.map_url}"
        width="100%" height="150"
        style="border:0;"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    </div>

    <div class="card-footer">
      <span class="card-data">
        <i class="fa-regular fa-calendar"></i> ${vaga.data}
      </span>
      <button class="btn-ajudar" onclick="candidatar(${vaga.id})">
        <i class="fa-solid fa-hand-holding-heart"></i> Quero Ajudar
      </button>
    </div>
  `;
}

// ─── Filtros ──────────────────────────────────────────────────────────────────
document.querySelectorAll(".filter-chip").forEach((btn) => {
  btn.addEventListener("click", function () {
    document
      .querySelectorAll(".filter-chip")
      .forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    filtroAtivo = this.dataset.filter;
    renderizarVagas();
  });
});

// ─── Candidatura ──────────────────────────────────────────────────────────────
async function candidatar(id) {
  const vaga =
    todasVagas.find((v) => v.id === id) || (await DB.buscarPorId(id));
  alert(
    `Inscrição realizada!\n\nVaga: ${vaga ? vaga.titulo : id}\nEntraremos em contato em breve. 💚`,
  );
}

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  mostrarSkeleton();

  todasVagas = await DB.listar();
  renderizarVagas();

  console.log("Vagas carregadas:", todasVagas[0]);
}

init();
