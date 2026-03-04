const app = document.getElementById("app");

const roommates = ["Lara", "Fabian"];
const tasks = [
  "Clean the kitchen",
  "Clean the bathroom",
  "Clean the couch",
  "Clean furniture",
  "Clean mirrors",
  "Clean the living room",
  "Clean rags",
  "Vacuum the whole house"
];

let extraTasks = {
  trash: "Lara",
  recycling: "Fabian"
};

// Configurable: mínimo de días para mostrar la semana
const MIN_DAYS_PER_WEEK = 3; // puedes poner 3, 4 o 5 según UX

function generateHome() {
  app.innerHTML = `
    <div class="months-grid">
      ${generateMonths()}
    </div>
    ${generateExtraTasks()}
  `;
}

function generateMonths() {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  return months.map((month, index) => `
    <div class="month-card" onclick="openMonth(${index})">
      ${month}
    </div>
  `).join("");
}

function openMonth(monthIndex) {
  const year = 2026;
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

  // Primer lunes que podría tocar el mes
  let startDate = new Date(firstDayOfMonth);
  const day = startDate.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day; // Domingo = retrocede 6 días
  startDate.setDate(startDate.getDate() + diffToMonday);

  let weeksHTML = "";
  let weekNumber = 1;
  let cleaningIndex = getCleaningIndexForMonth(monthIndex);

  while (startDate <= lastDayOfMonth) {
    const weekStart = new Date(startDate);
    const weekEnd = new Date(startDate);
    weekEnd.setDate(weekEnd.getDate() + 6);

    // Calcular cuántos días de la semana pertenecen al mes
    const effectiveStart = weekStart < firstDayOfMonth ? firstDayOfMonth : weekStart;
    const effectiveEnd = weekEnd > lastDayOfMonth ? lastDayOfMonth : weekEnd;
    const daysInMonth = (effectiveEnd - effectiveStart) / (1000*60*60*24) + 1;

    // Mostrar solo si la semana tiene >= MIN_DAYS_PER_WEEK días
    if (daysInMonth >= MIN_DAYS_PER_WEEK) {
      const person = roommates[cleaningIndex];
      const personClass = person === "Lara" ? "lara" : "fabian";

      weeksHTML += `
        <div class="week-card">
          <div class="week-number">Week ${weekNumber}</div>
          <div class="week-dates">
            ${effectiveStart.getDate()} - ${effectiveEnd.getDate()}
          </div>
          <div class="cleaning-person ${personClass}">🧹 Cleaning: ${person}</div>
          <ul class="task-list">
            ${tasks.map(task => `
              <li>
                <input type="checkbox">
                ${task}
              </li>
            `).join("")}
          </ul>
        </div>
      `;

      cleaningIndex = cleaningIndex === 0 ? 1 : 0;
      weekNumber++;
    }

    startDate.setDate(startDate.getDate() + 7); // siguiente semana
  }

  app.innerHTML = `
    <div class="month-header">
      <button class="back-btn" onclick="generateHome()">← Back</button>
      <div class="month-title">
        ${firstDayOfMonth.toLocaleString("en-US", { month: "long" })} 2026
      </div>
    </div>
    <div class="weeks-grid">
      ${weeksHTML}
    </div>
  `;
}

// Alternancia global de limpieza según semanas reales
function getCleaningIndexForMonth(monthIndex) {
  const year = 2026;

  // Marzo empieza con FABIAN (índice 1)
  const marchFirst = new Date(year, 2, 1);
  let baseMonday = new Date(marchFirst);
  const day = baseMonday.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  baseMonday.setDate(baseMonday.getDate() + diffToMonday);

  const currentMonthFirst = new Date(year, monthIndex, 1);

  const diffTime = currentMonthFirst - baseMonday;
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

  return diffWeeks % 2 === 0 ? 1 : 0;
}

function generateExtraTasks() {
  return `
    <div class="extra-tasks">
      <h2>Extra Tasks</h2>
      <div class="extra-item">
        Last person who took out the trash:
        <strong>${extraTasks.trash}</strong><br>
        <button onclick="switchTrash()">Switch</button>
      </div>
      <div class="extra-item">
        Last person who took out recycling:
        <strong>${extraTasks.recycling}</strong><br>
        <button onclick="switchRecycling()">Switch</button>
      </div>
    </div>
  `;
}

function switchTrash() {
  extraTasks.trash = extraTasks.trash === "Lara" ? "Fabian" : "Lara";
  generateHome();
}

function switchRecycling() {
  extraTasks.recycling = extraTasks.recycling === "Lara" ? "Fabian" : "Lara";
  generateHome();
}

generateHome();

// Al generar cada checkbox
<ul class="task-list">
  ${tasks.map((task, i) => {
    const key = `${monthIndex}_${weekNumber}_${task}`;
    const checked = localStorage.getItem(key) === "true" ? "checked" : "";
    return `
      <li>
        <input type="checkbox" data-key="${key}" ${checked} onchange="saveTask(this)">
        ${task}
      </li>
    `;
  }).join("")}
</ul>

// Función para guardar el estado
function saveTask(checkbox) {
  const key = checkbox.dataset.key;
  localStorage.setItem(key, checkbox.checked);
}