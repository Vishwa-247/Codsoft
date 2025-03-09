let display = document.getElementById('display');
let currentInput = '';
let currentOperator = '';
let previousInput = '';

function appendNumber(number) {
    currentInput += number;
    updateDisplay();
}

function setOperator(operator) {
    if (currentInput !== '') {
        if (previousInput !== '') {
            calculate();
        }
        previousInput = currentInput;
        currentInput = '';
        currentOperator = operator;
        updateDisplay();
    }
}

function calculate() {
    if (previousInput !== '' && currentInput !== '') {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        
        switch(currentOperator) {
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
                result = prev / current;
                break;
            default:
                return;
        }
        
        currentInput = result.toString();
        previousInput = '';
        currentOperator = '';
        updateDisplay();
    }
}

function clearDisplay() {
    currentInput = '';
    previousInput = '';
    currentOperator = '';
    updateDisplay();
}

function updateDisplay() {
    display.value = currentInput || '0';
}
