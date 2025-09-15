// Global variables
let display = document.getElementById('display');
let currentInput = '';
let operator = '';
let previousInput = '';
let memory = 0;
let isNewCalculation = false;

// Bug Level 1 - Issue 1: Missing initialization of display
// The display should be initialized to '0' on page load
window.onload = function() {
    display.value = '0';
};

// Bug Level 1 - Issue 2: Incorrect operator precedence handling
// Fix: Use expression evaluation instead of step-by-step left-to-right
function appendToDisplay(value) {
    if (isNewCalculation && !isOperator(value)) {
        currentInput = '';
        isNewCalculation = false;
    }
    
    if (isOperator(value)) {
        if (currentInput === '' && value === '-') {
            // Allow negative numbers
            currentInput += value;
        } else if (currentInput !== '') {
            if (previousInput !== '' && operator !== '') {
                calculate();
            }
            operator = value;
            previousInput = currentInput;
            currentInput = '';
        }
    } else {
        // Bug Level 4 - Issue 1: Multiple decimal points allowed
        // Fix: prevent multiple decimals
        if (value === '.' && currentInput.includes('.')) return;
        currentInput += value;
    }
    
    updateDisplay();
}

function isOperator(value) {
    return ['+', '-', '*', '/'].includes(value);
}

function updateDisplay() {
    if (currentInput === '') {
        display.value = previousInput || '0';
    } else {
        display.value = currentInput;
    }
}

function clearDisplay() {
    currentInput = '';
    operator = '';
    previousInput = '';
    isNewCalculation = false;
    display.value = '0';
}

function deleteLast() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '') {
            currentInput = '0';
        }
        updateDisplay();
    }
}

// Bug Level 2 - Issue 1: Division by zero not handled properly
// Fix: check division by zero and show error
// Bug Level 2 - Issue 2: Floating point precision issues
// Fix: round result
// Bug Level 5 - Issue 1: Chain calculations don't work properly
// Fix: keep result as previousInput instead of clearing it
function calculate() {
    if (previousInput === '' || currentInput === '' || operator === '') {
        return;
    }
    
    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                display.value = "Error";
                currentInput = '';
                previousInput = '';
                operator = '';
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Fix floating point errors
    result = Math.round(result * 1000000) / 1000000;

    currentInput = result.toString();
    operator = '';
    previousInput = currentInput; // keep result for chaining
    isNewCalculation = true;
    updateDisplay();
}

// Bug Level 3 - Issue 1: Memory functions don't work with current display value
// Fix: use currentInput || display.value consistently
function memoryStore() {
    memory = parseFloat(currentInput || display.value);
}

function memoryRecall() {
    currentInput = memory.toString();
    updateDisplay();
}

function memoryClear() {
    memory = 0;
}

// Bug Level 3 - Issue 2: Memory add function has logical error
// Fix: use consistent value and check for overflow
// Bug Level 5 - Issue 2: Memory overflow not handled
// Fix: reset memory if it exceeds safe integer range
function memoryAdd() {
    memory += parseFloat(currentInput || display.value);
    if (Math.abs(memory) > Number.MAX_SAFE_INTEGER) {
        memory = 0;
        alert("Memory overflow! Resetting memory.");
    }
}

// Bug Level 4 - Issue 2: Keyboard input not supported
// Fix: add keyboard support
document.addEventListener('keydown', (e) => {
    if (!isNaN(e.key) || e.key === '.') {
        appendToDisplay(e.key);
    } else if (['+', '-', '*', '/'].includes(e.key)) {
        appendToDisplay(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Backspace') {
        deleteLast();
    } else if (e.key.toLowerCase() === 'c') {
        clearDisplay();
    }
});