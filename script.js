const PICKS = [
  [17, 26, 36, 37, 39, 45],
  [8, 14, 24, 40, 42, 44],
  [2, 14, 26, 28, 29, 32],
  [17, 18, 28, 31, 34, 43],
  [4, 5, 6, 8, 15, 18],
];

const pickCards = document.querySelector("#pick-cards");
const historyBody = document.querySelector("#history-body");
const searchInput = document.querySelector("#draw-search");
const status = document.querySelector("#data-status");
let history = [];

function balls(numbers, extraClass = "") {
  return numbers.map((number) => `<span class="ball ${extraClass}">${number}</span>`).join("");
}

function matchRank(pick, draw) {
  const matches = pick.filter((number) => draw.numbers.includes(number)).length;
  if (matches === 6) return 1;
  if (matches === 5 && pick.includes(draw.bonus_no)) return 2;
  if (matches === 5) return 3;
  if (matches === 4) return 4;
  if (matches === 3) return 5;
  return 0;
}

function rankLabel(rank) {
  return rank ? `${rank}등 당첨` : "낙첨";
}

function renderPickCards() {
  pickCards.innerHTML = PICKS.map((pick, index) => `<article class="pick-card">
    <span class="pick-label">COMBINATION ${index + 1}</span>
    <h3>내 번호 ${index + 1}</h3>
    <div class="balls" aria-label="${pick.join(", ")}">${balls(pick)}</div>
    <span class="result" data-pick-result="${index}">데이터 확인 중…</span>
  </article>`).join("");
}

function renderSummary() {
  PICKS.forEach((pick, index) => {
    const wins = history.map((draw) => matchRank(pick, draw)).filter(Boolean);
    const element = document.querySelector(`[data-pick-result="${index}"]`);
    if (!element) return;
    if (wins.length === 0) {
      element.textContent = "당첨 기록 없음";
      return;
    }
    const best = Math.min(...wins);
    element.classList.add("won");
    element.innerHTML = `<strong>${wins.length}회 당첨</strong> · 최고 ${best}등`;
  });
}

function renderHistory() {
  const query = searchInput.value.trim();
  const rows = query ? history.filter((draw) => String(draw.draw_no).includes(query)) : history;
  historyBody.innerHTML = rows.slice().reverse().map((draw) => {
    const results = PICKS.map((pick, index) => {
      const rank = matchRank(pick, draw);
      return `<span class="mini-result ${rank ? "won" : ""}" title="내 번호 ${index + 1}">${index + 1}번 ${rankLabel(rank)}</span>`;
    }).join("");
    const date = draw.date ? new Date(draw.date).toLocaleDateString("ko-KR") : "-";
    return `<tr>
      <th scope="row">${draw.draw_no}회</th>
      <td>${date}</td>
      <td><div class="winning-balls">${balls(draw.numbers)}</div></td>
      <td><span class="bonus">+ ${draw.bonus_no}</span></td>
      <td><div class="row-results">${results}</div></td>
    </tr>`;
  }).join("");
  status.textContent = `${rows.length.toLocaleString("ko-KR")}개 회차 표시 · 데이터 기준 ${history.at(-1)?.draw_no ?? "-"}회`;
}

async function loadHistory() {
  try {
    const response = await fetch("data/lotto-history.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    history = await response.json();
    renderSummary();
    renderHistory();
  } catch (error) {
    status.textContent = "당첨 데이터를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.";
    console.error("Lotto history load failed:", error);
  }
}

renderPickCards();
searchInput.addEventListener("input", renderHistory);
document.querySelector("[data-year]").textContent = new Date().getFullYear();
loadHistory();
