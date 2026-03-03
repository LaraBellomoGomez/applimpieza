const app = document.getElementById("app");

const roommates = ["Lara", "Fabian"];

const tasks = [
    "Clean the kitchen",
    "Clean the bathroom",
    "Clean the couch",
    "Clean furniture",
    "Clean the living room",
    "Vacuum the whole house"
];

let extraTasks = {
    trash: "Lara",
    recycling: "Fabian"
};

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
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return months.map((month, index) => `
    <div class="month-card" onclick="openMonth(${index})">
      ${month}
    </div>
  `).join("");
}

function openMonth(monthIndex) {
    const year = 2026;
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);

    let currentDate = new Date(firstDay);
    let weekNumber = 1;

    // Determinar quién comienza según la primera semana de marzo
    let cleaningIndex = 0; // Por defecto empieza Lara
    if (monthIndex === 2) { // Marzo es el índice 2 (0=Enero)
        cleaningIndex = 1; // Fabian empieza la primera semana de marzo
    } else if (monthIndex > 2) {
        // Para meses posteriores a marzo, mantener alternancia según el número de semanas que hayan pasado
        const totalWeeksBefore = getTotalWeeksBeforeMarch(monthIndex);
        cleaningIndex = totalWeeksBefore % 2 === 0 ? 1 : 0; // 1=Fabian, 0=Lara
    }

    let weeksHTML = "";

    while (currentDate <= lastDay) {
        let weekStart = new Date(currentDate);
        let weekEnd = new Date(currentDate);
        weekEnd.setDate(weekEnd.getDate() + 6);
        if (weekEnd > lastDay) weekEnd = lastDay;

        const person = roommates[cleaningIndex];
        const personClass = person === "Lara" ? "lara" : "fabian";

        weeksHTML += `
      <div class="week-card">
        <div class="week-number">Week ${weekNumber}</div>
        <div class="week-dates">
          ${weekStart.getDate()} - ${weekEnd.getDate()}
        </div>

        <div class="cleaning-person ${personClass}">
          🧹 Cleaning: ${person}
        </div>

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

        cleaningIndex = cleaningIndex === 0 ? 1 : 0; // alternar semanas
        currentDate.setDate(currentDate.getDate() + 7);
        weekNumber++;
    }

    app.innerHTML = `
    <div class="month-header">
      <button class="back-btn" onclick="generateHome()">← Back</button>
     <div class="month-title">
     ${firstDay.toLocaleString("en-US", { month: "long" })} 2026
</div>
    </div>

    <div class="weeks-grid">
      ${weeksHTML}
    </div>
  `;
}

// Función para calcular las semanas que pasaron antes de marzo
function getTotalWeeksBeforeMarch(monthIndex) {
    let totalWeeks = 0;
    const year = 2026;

    for (let m = 0; m < monthIndex; m++) {
        const firstDay = new Date(year, m, 1);
        const lastDay = new Date(year, m + 1, 0);
        const daysInMonth = lastDay.getDate();
        totalWeeks += Math.ceil(daysInMonth / 7);
    }

    return totalWeeks;
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