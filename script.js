const PICKS = [
  [17, 26, 36, 37, 39, 45],
  [8, 14, 24, 40, 42, 44],
  [2, 14, 26, 28, 29, 32],
  [17, 18, 28, 31, 34, 43],
  [4, 5, 6, 8, 15, 18],
];

const pickCards = document.querySelector("#pick-cards");
const historyBody = document.querySelector("#history-body");
const frequencyList = document.querySelector("#frequency-list");
const searchInput = document.querySelector("#draw-search");
const status = document.querySelector("#data-status");
const customForm = document.querySelector("#custom-form");
const customResult = document.querySelector("#custom-result");
const customError = document.querySelector("#custom-error");
let history = [];
let customPick = null;
let activeFilter = null;

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

function statsFor(pick) {
  const wins = history.map((draw) => matchRank(pick, draw)).filter(Boolean);
  return { wins, best: wins.length ? Math.min(...wins) : 0 };
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
    const { wins, best } = statsFor(pick);
    const element = document.querySelector(`[data-pick-result="${index}"]`);
    if (!element) return;
    if (wins.length === 0) {
      element.textContent = "당첨 기록 없음";
      return;
    }
    element.classList.add("won");
    element.innerHTML = `<button type="button" class="result-link" data-pick-filter="${index}"><strong>${wins.length}회 당첨</strong> · 최고 ${best}등</button>`;
  });
}

function renderCustomResult() {
  if (!customPick) {
    customResult.innerHTML = "";
    return;
  }
  const { wins, best } = statsFor(customPick);
  const summary = wins.length ? `<button type="button" class="result-link" data-custom-filter><strong>${wins.length}회 당첨</strong> · 최고 ${best}등</button>` : "당첨 기록 없음";
  customResult.innerHTML = `<div class="custom-result-heading"><span class="pick-label">조회한 조합</span><span class="result ${wins.length ? "won" : ""}">${summary}</span></div><div class="balls">${balls(customPick)}</div>`;
}

function renderNumberFrequency() {
  const counts = Array.from({ length: 45 }, (_, index) => ({ number: index + 1, count: 0 }));
  history.forEach((draw) => draw.numbers.forEach((number) => { counts[number - 1].count += 1; }));
  counts.sort((a, b) => b.count - a.count || a.number - b.number);
  frequencyList.innerHTML = counts.map(({ number, count }) => `<li><span>${number}번</span><span class="frequency-count">${count}회</span></li>`).join("");
}

function renderHistory() {
  const query = searchInput.value.trim();
  const filtered = activeFilter ? history.filter((draw) => matchRank(activeFilter.pick, draw) > 0) : history;
  const rows = query ? filtered.filter((draw) => String(draw.draw_no).includes(query)) : filtered;
  historyBody.innerHTML = rows.slice().reverse().map((draw) => {
    const results = PICKS.map((pick, index) => {
      const rank = matchRank(pick, draw);
      return `<span class="mini-result ${rank ? "won" : ""}" title="내 번호 ${index + 1}">${index + 1}번 ${rankLabel(rank)}</span>`;
    }).join("");
    const customRank = customPick ? matchRank(customPick, draw) : 0;
    const custom = customPick ? `<span class="mini-result ${customRank ? "won" : ""}" title="조회한 조합">입력 ${rankLabel(customRank)}</span>` : "";
    const date = draw.date ? new Date(draw.date).toLocaleDateString("ko-KR") : "-";
    return `<tr>
      <th scope="row">${draw.draw_no}회</th>
      <td>${date}</td>
      <td><div class="winning-balls">${balls(draw.numbers)}</div></td>
      <td><span class="bonus">+ ${draw.bonus_no}</span></td>
      <td><div class="row-results">${results}${custom}</div></td>
    </tr>`;
  }).join("");
  const filterLabel = activeFilter ? ` · ${activeFilter.label} 당첨 회차만 필터링` : "";
  status.innerHTML = `${rows.length.toLocaleString("ko-KR")}개 회차 표시 · 데이터 기준 ${history.at(-1)?.draw_no ?? "-"}회${filterLabel}${activeFilter ? ' <button type="button" class="clear-filter" data-clear-filter>전체 회차 보기</button>' : ""}`;
}

document.querySelector("#picks").addEventListener("click", (event) => {
  const pickButton = event.target.closest("[data-pick-filter]");
  const customButton = event.target.closest("[data-custom-filter]");
  if (!pickButton && !customButton) return;
  if (pickButton) {
    const index = Number(pickButton.dataset.pickFilter);
    activeFilter = { pick: PICKS[index], label: `내 번호 ${index + 1}` };
  } else if (customPick) {
    activeFilter = { pick: customPick, label: "조회한 조합" };
  }
  renderHistory();
  document.querySelector("#history").scrollIntoView({ behavior: "smooth" });
});

status.addEventListener("click", (event) => {
  if (!event.target.closest("[data-clear-filter]")) return;
  activeFilter = null;
  renderHistory();
});

customForm.addEventListener("submit", (event) => {
  event.preventDefault();
  event.stopPropagation();
  const values = [...customForm.querySelectorAll("input[name=number]")].map((input) => Number(input.value));
  const valid = values.length === 6 && values.every((number) => Number.isInteger(number) && number >= 1 && number <= 45) && new Set(values).size === 6;
  if (!valid) {
    customError.textContent = "1~45 사이의 서로 다른 번호 6개를 입력해 주세요.";
    return;
  }
  customError.textContent = "";
  customPick = values.sort((a, b) => a - b);
  renderCustomResult();
  renderHistory();
});

async function loadHistory() {
  try {
    const response = await fetch("data/lotto-history.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    history = await response.json();
    renderSummary();
    renderCustomResult();
    renderNumberFrequency();
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
