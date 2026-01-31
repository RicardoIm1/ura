function calculadora(a, b, operacion) {
    switch(operacion) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            return b !== 0 ? a / b : "Error: División por cero";
        default:
            return "Operación no válida";
    }
}

// Uso:
console.log(calculadora(10, 5, '+')); // 15
console.log(calculadora(10, 5, '-')); // 5
console.log(calculadora(10, 5, '*')); // 50
console.log(calculadora(10, 5, '/')); // 2
console.log(calculadora(10, 0, '/')); // Error: División por cero
