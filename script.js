const PICKS = [
  [17, 26, 36, 37, 39, 45],
  [8, 14, 24, 40, 42, 44],
  [1, 12, 13, 22, 24, 44],
  [17, 18, 28, 31, 34, 43],
  [1, 3, 4, 9, 12, 45],
];

const pickCards = document.querySelector("#pick-cards");
const historyBody = document.querySelector("#history-body");
const frequencyList = document.querySelector("#frequency-list");
const searchInput = document.querySelector("#draw-search");
const status = document.querySelector("#data-status");
const customResult = document.querySelector("#custom-result");
const customError = document.querySelector("#custom-error");
const customNumberGrid = document.querySelector("#custom-number-grid");
const customSelectionStatus = document.querySelector("#custom-selection-status");
const DATA_SOURCES = [
  "https://papaya5rhw1984.github.io/lotto-data/all.json",
  "data/lotto-history.json",
];
let history = [];
let customPick = null;
let activeFilter = null;
let customSelection = [];
let dataSource = "로컬 백업";

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

function rankClass(rank) {
  return rank ? `rank-${rank}` : "";
}

function winningBalls(draw) {
  return draw.numbers.map((number) => {
    const matched = activeFilter?.pick.includes(number) ? " matched-ball" : "";
    return `<span class="ball${matched}">${number}</span>`;
  }).join("");
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

function renderCustomNumberGrid() {
  customNumberGrid.innerHTML = Array.from({ length: 45 }, (_, index) => {
    const number = index + 1;
    const selected = customSelection.includes(number);
    return `<button type="button" class="number-choice ${selected ? "selected" : ""}" data-number="${number}" aria-pressed="${selected}">${number}</button>`;
  }).join("");
  updateCustomNumberGrid();
}

function updateCustomNumberGrid() {
  customSelectionStatus.textContent = `${customSelection.length}/6 선택`;
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
    element.classList.add("won", rankClass(best));
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
  customResult.innerHTML = `<div class="custom-result-heading"><span class="pick-label">조회한 조합</span><span class="result ${wins.length ? `won ${rankClass(best)}` : ""}">${summary}</span></div><div class="balls">${balls(customPick)}</div>`;
}

function renderNumberFrequency() {
  const counts = Array.from({ length: 45 }, (_, index) => ({ number: index + 1, count: 0 }));
  history.forEach((draw) => draw.numbers.forEach((number) => { counts[number - 1].count += 1; }));
  counts.sort((a, b) => b.count - a.count || a.number - b.number);
  frequencyList.innerHTML = counts.map(({ number, count }, index) => `<div class="frequency-cell" title="${index + 1}위"><span>${number}번</span><strong>${count}회</strong></div>`).join("");
}

function renderHistory() {
  const query = searchInput.value.trim();
  const filtered = activeFilter ? history.filter((draw) => matchRank(activeFilter.pick, draw) > 0) : history;
  const rows = query ? filtered.filter((draw) => String(draw.draw_no) === query) : filtered;
  historyBody.innerHTML = rows.slice().reverse().map((draw) => {
    const results = PICKS.map((pick, index) => {
      const rank = matchRank(pick, draw);
      return `<span class="mini-result ${rank ? `won ${rankClass(rank)}` : ""}" title="내 번호 ${index + 1}">${index + 1}번 ${rankLabel(rank)}</span>`;
    }).join("");
    const customRank = customPick ? matchRank(customPick, draw) : 0;
    const custom = customPick ? `<span class="mini-result ${customRank ? `won ${rankClass(customRank)}` : ""}" title="조회한 조합">입력 ${rankLabel(customRank)}</span>` : "";
    const date = draw.date ? new Date(draw.date).toLocaleDateString("ko-KR") : "-";
    return `<tr>
      <th scope="row">${draw.draw_no}회</th>
      <td>${date}</td>
      <td><div class="winning-balls">${winningBalls(draw)}</div></td>
      <td><span class="bonus">+ ${draw.bonus_no}</span></td>
      <td><div class="row-results">${results}${custom}</div></td>
    </tr>`;
  }).join("");
  const filterLabel = activeFilter ? ` · ${activeFilter.label} 당첨 회차만 필터링` : "";
  status.innerHTML = `${rows.length.toLocaleString("ko-KR")}개 회차 표시 · 데이터 기준 ${history.at(-1)?.draw_no ?? "-"}회 · ${dataSource}${filterLabel}${activeFilter ? ' <button type="button" class="clear-filter" data-clear-filter>전체 회차 보기</button>' : ""}`;
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

customNumberGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-number]");
  if (!button) return;
  const number = Number(button.dataset.number);
  if (customSelection.includes(number)) {
    customSelection = customSelection.filter((value) => value !== number);
  } else if (customSelection.length < 6) {
    customSelection = [...customSelection, number].sort((a, b) => a - b);
  } else {
    customError.textContent = "번호는 최대 6개까지 선택할 수 있습니다.";
    return;
  }
  customError.textContent = "";
  const selected = customSelection.includes(number);
  button.classList.toggle("selected", selected);
  button.setAttribute("aria-pressed", String(selected));
  updateCustomNumberGrid();
  if (customSelection.length === 6) {
    customPick = [...customSelection];
    renderCustomResult();
    renderHistory();
  } else {
    customPick = null;
    if (activeFilter?.label === "조회한 조합") activeFilter = null;
    renderCustomResult();
    if (activeFilter === null) renderHistory();
  }
});

async function loadHistory() {
  for (const [index, source] of DATA_SOURCES.entries()) {
    try {
      const response = await fetch(source, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      history = await response.json();
      dataSource = index === 0 ? "최신 온라인 데이터" : "로컬 백업";
      renderSummary();
      renderCustomResult();
      renderNumberFrequency();
      renderHistory();
      return;
    } catch (error) {
      console.warn(`Lotto history source unavailable: ${source}`, error);
    }
  }
  status.textContent = "당첨 데이터를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.";
}

renderPickCards();
renderCustomNumberGrid();
searchInput.addEventListener("input", renderHistory);
document.querySelector("[data-year]").textContent = new Date().getFullYear();
loadHistory();
