// --- Constants & Preloaded Data ---
const MUSCLE_GROUPS = ['Chest', 'Back', 'Triceps', 'Biceps', 'Shoulders', 'Legs', 'Abs'];

const PRELOADED_EXERCISES = {
    'Chest': ['Bench Press', 'Incline Dumbbell Press', 'Cable Flyes', 'Pec Dec Flys', 'Push-ups', 'Chest Dip'],
    'Back': ['Lat Pulldown', 'Barbell Row', 'Deadlift', 'Pull-ups', 'Seated Cable Row', 'T-Bar Row'],
    'Triceps': ['Tricep Pushdown', 'Overhead Extension', 'Skullcrushers', 'Dips', 'Close-Grip Bench'],
    'Biceps': ['Barbell Curl', 'Dumbbell Curl', 'Hammer Curl', 'Preacher Curl', 'Cable Curl'],
    'Shoulders': ['Overhead Press', 'Lateral Raise', 'Front Raise', 'Face Pulls', 'Reverse Pec Dec'],
    'Legs': ['Squats', 'Leg Press', 'Leg Extension', 'Hamstring Curl', 'Calf Raises', 'Romanian Deadlift'],
    'Abs': ['Crunches', 'Leg Raises', 'Plank', 'Cable Crunches', 'Russian Twists']
};

let activeGroup = 'Chest';
let activeHistoryGroup = 'Chest';
let workoutData = {};

const groupNav = document.getElementById('group-nav');
const currentGroupTitle = document.getElementById('current-group-title');
const exerciseContainer = document.getElementById('exercise-container');

function init() {
    let savedDraft = localStorage.getItem('gymWorkoutDraft');
    if (savedDraft) {
        workoutData = JSON.parse(savedDraft);
        MUSCLE_GROUPS.forEach(group => {
            if (!workoutData[group]) workoutData[group] = [];
        });
    } else {
        MUSCLE_GROUPS.forEach(group => { workoutData[group] = []; });
    }

    renderDatalists();
    renderNav();
    renderExercises();
}

function saveLiveDraft() {
    localStorage.setItem('gymWorkoutDraft', JSON.stringify(workoutData));
}

function renderDatalists() {
    const container = document.createElement('div');
    container.style.display = 'none';

    for (const [group, exercises] of Object.entries(PRELOADED_EXERCISES)) {
        const datalist = document.createElement('datalist');
        datalist.id = `preset-${group}`;
        exercises.forEach(ex => {
            const option = document.createElement('option');
            option.value = ex;
            datalist.appendChild(option);
        });
        container.appendChild(datalist);
    }
    document.body.appendChild(container);
}

function renderNav() {
    groupNav.innerHTML = '';
    MUSCLE_GROUPS.forEach(group => {
        const btn = document.createElement('button');
        btn.textContent = group;
        if (group === activeGroup) btn.classList.add('active');
        btn.onclick = () => {
            activeGroup = group;
            currentGroupTitle.textContent = group;
            renderNav();
            renderExercises();
        };
        groupNav.appendChild(btn);
    });
}

function addExercise() {
    const newExercise = {
        id: Date.now(),
        name: '',
        sets: [{ weight: '', reps: '' }, { weight: '', reps: '' }, { weight: '', reps: '' }]
    };
    workoutData[activeGroup].push(newExercise);
    saveLiveDraft();
    renderExercises();
}

function deleteExercise(exerciseId) {
    workoutData[activeGroup] = workoutData[activeGroup].filter(ex => ex.id !== exerciseId);
    saveLiveDraft();
    renderExercises();
}

function updateExerciseName(exerciseId, newName) {
    const exercise = workoutData[activeGroup].find(ex => ex.id === exerciseId);
    if (exercise) {
        exercise.name = newName;
        saveLiveDraft();
        // Re-rendering instantly searches history and updates the "Last Time" text
        renderExercises();
    }
}

function updateSet(exerciseId, setIndex, field, value) {
    const exercise = workoutData[activeGroup].find(ex => ex.id === exerciseId);
    if (exercise) {
        exercise.sets[setIndex][field] = value;
        saveLiveDraft();
    }
}

// --- NEW: Progressive Overload Search ---
function getPreviousPerformance(group, exerciseName) {
    if (!exerciseName.trim()) return null;

    let history = JSON.parse(localStorage.getItem('gymHistoryData')) || {};
    let groupHistory = history[group] || [];

    for (let session of groupHistory) {
        for (let ex of session.exercises) {
            // Check if the names match (ignores upper/lowercase differences)
            if (ex.name.toLowerCase() === exerciseName.toLowerCase()) {
                let validSets = ex.sets.filter(s => s.weight !== "" && s.reps !== "");
                if (validSets.length === 0) continue;
                // Format the string: e.g., "60x10, 60x8"
                return validSets.map(s => `${s.weight}x${s.reps}`).join(', ');
            }
        }
    }
    return null;
}

function renderExercises() {
    exerciseContainer.innerHTML = '';
    const currentExercises = workoutData[activeGroup];

    if (currentExercises.length === 0) {
        exerciseContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); margin-top: 20px;">No exercises added yet.</p>`;
        return;
    }

    currentExercises.forEach((exercise) => {
        const card = document.createElement('div');
        card.className = 'exercise-card';

        // Fetch past performance to display
        let pastPerformance = getPreviousPerformance(activeGroup, exercise.name);
        let pastPerformanceHtml = pastPerformance
            ? `<div class="prev-performance">Last time: ${pastPerformance}</div>`
            : '';

        let html = `
            <div class="card-header">
                <input type="text" class="exercise-name-input"
                    list="preset-${activeGroup}"
                    placeholder="Exercise Name"
                    value="${exercise.name}" onchange="updateExerciseName(${exercise.id}, this.value)">
                <button class="delete-btn" onclick="deleteExercise(${exercise.id})">×</button>
            </div>
            ${pastPerformanceHtml}
            <div class="set-headers">
                <span>Set</span><span>kg / lbs</span><span>Reps</span>
            </div>
        `;

        exercise.sets.forEach((set, index) => {
            html += `
                <div class="set-row">
                    <span class="set-number">${index + 1}</span>
                    <input type="number" placeholder="Weight" value="${set.weight}"
                        onchange="updateSet(${exercise.id}, ${index}, 'weight', this.value)">
                    <input type="number" placeholder="Reps" value="${set.reps}"
                        onchange="updateSet(${exercise.id}, ${index}, 'reps', this.value)">
                </div>
            `;
        });

        card.innerHTML = html;
        exerciseContainer.appendChild(card);
    });
}

function saveSession() {
    const currentExercises = workoutData[activeGroup];
    if (currentExercises.length === 0) return alert(`No exercises added for ${activeGroup}!`);

    const isConfirmed = confirm(`Are you sure you want to finish and save your ${activeGroup} workout?`);
    if (!isConfirmed) return;

    const dateOptions = { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' };
    const today = new Date().toLocaleString('en-US', dateOptions);

    let history = JSON.parse(localStorage.getItem('gymHistoryData')) || {};
    if (!history[activeGroup]) history[activeGroup] = [];

    const sessionRecord = {
        date: today,
        exercises: JSON.parse(JSON.stringify(currentExercises))
    };

    history[activeGroup].unshift(sessionRecord);
    if (history[activeGroup].length > 3) history[activeGroup].pop();

    localStorage.setItem('gymHistoryData', JSON.stringify(history));
    alert(`Success! Saved ${activeGroup} workout.`);

    workoutData[activeGroup] = [];
    saveLiveDraft();
    renderExercises();
}

// --- History & Trash Modal Logic ---
function openHistoryModal() {
    document.getElementById('history-modal').style.display = 'flex';
    activeHistoryGroup = activeGroup;
    renderHistoryNav();
    renderHistoryList();
}

function renderHistoryNav() {
    const nav = document.getElementById('history-nav');
    nav.innerHTML = '';
    [...MUSCLE_GROUPS, 'Trash ♻️'].forEach(group => {
        const btn = document.createElement('button');
        btn.textContent = group;
        if (group === activeHistoryGroup) btn.classList.add('active');
        btn.onclick = () => {
            activeHistoryGroup = group;
            renderHistoryNav();
            renderHistoryList();
        };
        nav.appendChild(btn);
    });
}

function renderHistoryList() {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    if (activeHistoryGroup === 'Trash ♻️') return renderTrashList(list);

    let history = JSON.parse(localStorage.getItem('gymHistoryData')) || {};
    let groupHistory = history[activeHistoryGroup] || [];
    if (groupHistory.length === 0) {
        list.innerHTML = `<p style='color: var(--text-muted);'>No saved workouts here.</p>`;
        return;
    }

    groupHistory.forEach((session, index) => {
        let html = `
        <div class="history-session">
            <div class="history-header-row">
                <span class="history-date">${session.date}</span>
                <button class="history-action-btn delete-history-btn" onclick="moveToTrash('${activeHistoryGroup}', ${index})">Delete</button>
            </div>`;
        session.exercises.forEach(ex => {
            html += `<div class="history-exercise">${ex.name || "Unnamed"}</div>`;
            ex.sets.forEach((set, sIndex) => {
                if (set.weight !== "" && set.reps !== "") {
                    html += `<div style="color: var(--text-muted); font-size: 0.85rem; padding-left: 10px; margin-bottom: 2px;">Set ${sIndex+1}: ${set.weight} × ${set.reps}</div>`;
                }
            });
            html += `<div style="margin-bottom: 12px;"></div>`;
        });
        html += `</div>`;
        list.innerHTML += html;
    });
}

function renderTrashList(list) {
    let trash = JSON.parse(localStorage.getItem('gymTrashData')) || [];
    if (trash.length === 0) {
        list.innerHTML = `<p style='color: var(--text-muted);'>Trash is empty.</p>`;
        return;
    }

    trash.forEach((session, index) => {
        let html = `
        <div class="history-session" style="opacity: 0.6;">
            <div class="history-header-row">
                <div>
                    <span class="history-date" style="margin: 0;">${session.date}</span>
                    <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px;">(Was: ${session.originalGroup})</div>
                </div>
                <button class="history-action-btn restore-btn" onclick="restoreFromTrash(${index})">Restore</button>
            </div>
            <div class="history-exercise" style="font-weight: 400;">Contains ${session.exercises.length} exercises</div>
        </div>`;
        list.innerHTML += html;
    });
}

function moveToTrash(group, index) {
    if(!confirm("Move this session to trash?")) return;
    let history = JSON.parse(localStorage.getItem('gymHistoryData')) || {};
    let trash = JSON.parse(localStorage.getItem('gymTrashData')) || [];
    let deletedItem = history[group].splice(index, 1)[0];
    deletedItem.originalGroup = group;
    trash.unshift(deletedItem);
    localStorage.setItem('gymHistoryData', JSON.stringify(history));
    localStorage.setItem('gymTrashData', JSON.stringify(trash));
    renderHistoryList();
}

function restoreFromTrash(trashIndex) {
    let history = JSON.parse(localStorage.getItem('gymHistoryData')) || {};
    let trash = JSON.parse(localStorage.getItem('gymTrashData')) || [];
    let itemToRestore = trash.splice(trashIndex, 1)[0];
    let group = itemToRestore.originalGroup;
    if (!history[group]) history[group] = [];
    history[group].unshift(itemToRestore);
    if (history[group].length > 3) history[group].pop();
    localStorage.setItem('gymHistoryData', JSON.stringify(history));
    localStorage.setItem('gymTrashData', JSON.stringify(trash));
    renderHistoryList();
}

function closeHistoryModal() { document.getElementById('history-modal').style.display = 'none'; }
window.onclick = function(event) { if (event.target == document.getElementById('history-modal')) closeHistoryModal(); }

// --- NEW: 90s Rest Timer ---
let restTimer = null;
let restTimeRemaining = 90; // 90 seconds
const REST_DURATION = 90;

function updateRestDisplay() {
    const mins = Math.floor(restTimeRemaining / 60).toString().padStart(2, '0');
    const secs = (restTimeRemaining % 60).toString().padStart(2, '0');
    document.getElementById('stopwatch-display').textContent = `${mins}:${secs}`;
}

function toggleRestTimer() {
    const btn = document.getElementById('rest-timer-btn');
    const display = document.getElementById('stopwatch-display');

    if (restTimer) {
        // Cancel Timer
        clearInterval(restTimer);
        restTimer = null;
        btn.textContent = "Start 90s Rest";
        restTimeRemaining = REST_DURATION;
        updateRestDisplay();
    } else {
        // Start Timer
        restTimeRemaining = REST_DURATION;
        btn.textContent = "Cancel Rest";
        updateRestDisplay();

        restTimer = setInterval(() => {
            restTimeRemaining--;
            updateRestDisplay();

            if (restTimeRemaining <= 0) {
                // Time is up!
                clearInterval(restTimer);
                restTimer = null;
                btn.textContent = "Start 90s Rest";
                restTimeRemaining = REST_DURATION;

                // Trigger phone vibration (3 distinct pulses)
                if ("vibrate" in navigator) {
                    navigator.vibrate([500, 200, 500, 200, 500]);
                }

                display.textContent = "DONE!";
                setTimeout(() => { updateRestDisplay(); }, 3000); // Reset display after 3 seconds
            }
        }, 1000);
    }
}

// Boot up
init();