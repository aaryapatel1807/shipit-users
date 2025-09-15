// Global variables
let currentIntake = 0;
let dailyGoal = 2000;
let reminderInterval;
let reminderTimer;
let waterLog = [];

// Level 1 Bug 1: Missing initialization on page load
// Page loads with empty progress, should show initial state

// Level 1 Bug 2: Goal input doesn't validate properly
function setGoal() {
    const goalInput = document.getElementById('goal-input');
    const newGoal = goalInput.value;
    
    // Bug: No validation for empty or invalid values
    dailyGoal = newGoal;
    updateProgress();
    showNotification('Goal updated!', 'success');
}

function addWater(amount) {
    // Level 2 Bug 1: Amount parameter not validated
    // Bug: Negative numbers or invalid amounts can be passed
    currentIntake += amount;
    
    // Level 2 Bug 2: Date/time not properly tracked for log entries
    const logEntry = {
        amount: amount,
        time: new Date().toTimeString() // Bug: Should use toLocaleTimeString() for better format
    };
    waterLog.push(logEntry);
    
    updateProgress();
    updateWaterLog();
    checkGoalAchievement();
}

function addCustomWater() {
    const customInput = document.getElementById('custom-amount');
    const amount = parseInt(customInput.value);
    
    if (amount) {
        addWater(amount);
        customInput.value = '';
    }
}

function updateProgress() {
    // Level 3 Bug 1: Division by zero possible when goal is 0
    const percentage = (currentIntake / dailyGoal) * 100;
    
    document.getElementById('progress-text').textContent = `${currentIntake} / ${dailyGoal} ml`;
    document.getElementById('progress-bar').style.width = `${percentage}%`;
    
    // Level 3 Bug 2: Percentage can exceed 100% and display incorrectly
    document.getElementById('percentage-display').textContent = `${Math.round(percentage)}%`;
}

function updateWaterLog() {
    const logContainer = document.getElementById('water-log');
    logContainer.innerHTML = '';
    
    waterLog.forEach((entry, index) => {
        const logItem = document.createElement('div');
        logItem.className = 'flex justify-between items-center p-2 bg-gray-50 rounded';
        logItem.innerHTML = `
            <span>💧 ${entry.amount}ml</span>
            <span class="text-sm text-gray-500">${entry.time}</span>
            <button onclick="removeLogEntry(${index})" class="text-red-500 hover:text-red-700 text-sm">✕</button>
        `;
        logContainer.appendChild(logItem);
    });
}

function removeLogEntry(index) {
    // Level 4 Bug 1: Removing entry doesn't update total intake
    // Bug: Only removes from log but doesn't subtract from currentIntake
    waterLog.splice(index, 1);
    updateWaterLog();
}

function setReminder() {
    const intervalInput = document.getElementById('reminder-interval');
    const minutes = parseInt(intervalInput.value);
    
    if (minutes) {
        // Level 4 Bug 2: Multiple timers can be set without clearing previous ones
        // Bug: Doesn't clear existing timer before setting new one
        reminderInterval = minutes;
        reminderTimer = setInterval(() => {
            showNotification('Time to drink water! 💧', 'reminder');
        }, minutes * 60 * 1000);
        
        document.getElementById('reminder-status').textContent = `Reminder every ${minutes} minutes`;
    }
}

function stopReminder() {
    clearInterval(reminderTimer);
    document.getElementById('reminder-status').textContent = 'No reminder set';
}

function checkGoalAchievement() {
    if (currentIntake >= dailyGoal) {
        showNotification('🎉 Congratulations! You reached your daily goal!', 'success');
    }
}

function resetDaily() {
    currentIntake = 0;
    waterLog = [];
    updateProgress();
    updateWaterLog();
    showNotification('Daily progress reset', 'info');
}

let notificationTimeout;
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    
    // Remove all color classes before applying new ones
    notification.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-blue-500', 'bg-gray-700', 'text-white');
    
    let icon = '';
    if (type === 'success') {
        notification.classList.add('bg-green-500', 'text-white');
        icon = '✅ ';
    } else if (type === 'reminder') {
        notification.classList.add('bg-yellow-500', 'text-white');
        icon = '⏰ ';
    } else if (type === 'info') {
        notification.classList.add('bg-blue-500', 'text-white');
        icon = 'ℹ️ ';
    } else {
        notification.classList.add('bg-gray-700', 'text-white');
        icon = '⚠️ ';
    }

    notification.textContent = `${icon}${message}`;
    notification.className += ' fixed top-4 right-4 p-4 rounded-lg shadow-lg';

    notification.classList.remove('hidden');
    notification.style.opacity = '1';

    // Clear previous timeout and set new one
    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 300);
    }, 2500);
}

// Missing initialization - Level 1 Bug 1
// Should initialize display on page load
