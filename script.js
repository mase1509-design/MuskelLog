document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('dateInput');
    const wadenBtn = document.getElementById('wadenBtn');
    const knieBtn = document.getElementById('knieBtn');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const monthYearLabel = document.getElementById('monthYearLabel');
    const tableBody = document.getElementById('tableBody');

    const today = new Date();
    dateInput.value = today.toISOString().split('T')[0];

    let log = JSON.parse(localStorage.getItem('trainingsLog') || '{}');

    let displayYear = 2026;
    let displayMonth = 1;

    const monthNames = ["Januar","Februar","März","April","Mai","Juni","Juli",
                        "August","September","Oktober","November","Dezember"];

    function updateMonthLabel() {
        monthYearLabel.textContent = monthNames[displayMonth] + " " + displayYear;
    }

    function buildTable() {
        tableBody.innerHTML = "";
        updateMonthLabel();

        const daysInMonth = new Date(displayYear, displayMonth+1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(displayYear, displayMonth, day);
            const dateStr = date.toISOString().split('T')[0];

            const row = document.createElement('tr');

            const cellDate = document.createElement('td');
            cellDate.textContent = day.toString().padStart(2,'0') + "." + 
                                   (displayMonth+1).toString().padStart(2,'0') + "." + displayYear;
            row.appendChild(cellDate);

            ["wadenheber","kniebeuger"].forEach(ex => {
                const cell = document.createElement('td');
                if (log[dateStr] && log[dateStr][ex]) {
                    cell.classList.add('done');
                } else if (date < today) {
                    cell.classList.add('undone');
                }
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        }
    }

    wadenBtn.onclick = () => saveExercise("wadenheber");
    knieBtn.onclick = () => saveExercise("kniebeuger");

    function saveExercise(ex) {
        const dateVal = dateInput.value;
        if (!log[dateVal]) log[dateVal] = {wadenheber:false, kniebeuger:false};
        log[dateVal][ex] = true;
        localStorage.setItem('trainingsLog', JSON.stringify(log));
        buildTable();
    }

    prevMonthBtn.onclick = () => {
        displayMonth--;
        if (displayMonth < 0) {
            displayMonth = 11;
            displayYear--;
        }
        buildTable();
    };

    nextMonthBtn.onclick = () => {
        displayMonth++;
        if (displayMonth > 11) {
            displayMonth = 0;
            displayYear++;
        }
        buildTable();
    };

    buildTable();
});
