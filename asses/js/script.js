function openMonth(monthIndex) {
    const year = 2026;
    const firstDayOfMonth = new Date(year, monthIndex, 1);
    const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

    // Encontrar el lunes de la primera semana que incluye el primer día del mes
    let currentMonday = new Date(firstDayOfMonth);
    const dayOfWeek = currentMonday.getDay(); // 0 = domingo, 1 = lunes...
    currentMonday.setDate(currentMonday.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    let weekNumber = 1;

    // Determinar quién empieza
    let cleaningIndex;
    if (monthIndex < 2) {
        cleaningIndex = 0; // Enero y Febrero: Lara empezó la primera semana
    } else if (monthIndex === 2) {
        cleaningIndex = 1; // Marzo: Fabian empieza porque Lara limpió la última de febrero
    } else {
        // Calcular total de semanas desde marzo
        const weeksSinceMarch = getTotalWeeksSinceMarch(monthIndex);
        cleaningIndex = (1 + weeksSinceMarch) % 2; // alterna según semanas transcurridas
    }

    let weeksHTML = "";

    while (currentMonday <= lastDayOfMonth) {
        let weekStart = new Date(currentMonday);
        let weekEnd = new Date(currentMonday);
        weekEnd.setDate(weekEnd.getDate() + 6);

        // Mostrar solo los días dentro del mes
        const displayStart = weekStart < firstDayOfMonth ? firstDayOfMonth : weekStart;
        const displayEnd = weekEnd > lastDayOfMonth ? lastDayOfMonth : weekEnd;

        const person = roommates[cleaningIndex];
        const personClass = person === "Lara" ? "lara" : "fabian";

        weeksHTML += `
        <div class="week-card">
          <div class="week-number">Week ${weekNumber}</div>
          <div class="week-dates">
            ${displayStart.getDate()} - ${displayEnd.getDate()}
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

        cleaningIndex = cleaningIndex === 0 ? 1 : 0; // alternar personas
        currentMonday.setDate(currentMonday.getDate() + 7); // siguiente lunes
        weekNumber++;
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

// Calcular semanas transcurridas desde marzo hasta el mes actual
function getTotalWeeksSinceMarch(monthIndex) {
    let totalWeeks = 0;
    const year = 2026;

    for (let m = 3; m < monthIndex; m++) { // desde abril (índice 3) hasta mes anterior
        const firstDay = new Date(year, m, 1);
        const lastDay = new Date(year, m + 1, 0);

        // Encontrar lunes del primer día del mes
        let currentMonday = new Date(firstDay);
        const dayOfWeek = currentMonday.getDay();
        currentMonday.setDate(currentMonday.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

        let weekCount = 0;
        while (currentMonday <= lastDay) {
            weekCount++;
            currentMonday.setDate(currentMonday.getDate() + 7);
        }

        totalWeeks += weekCount;
    }

    return totalWeeks;
}