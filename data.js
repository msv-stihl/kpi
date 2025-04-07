//Segurança
var alldata = [];
var drow = 0;
var dcol = 0;

function loadCSV() {
    fetch('kpi.csv')  // Path to the CSV file in your project
        .then(response => response.text())  // Get the text content of the CSV file
        .then(data => {
            const matrix = parseCSVToMatrix(data);  // Convert the CSV data to a matrix
            console.log(matrix);  // Log the matrix in the console for verification
            displayMatrix(matrix);  // Display the matrix on the web page
        })
        .catch(error => console.error('Error fetching CSV file:', error));
}

// Function to parse CSV data into a 2D array (matrix)
function parseCSVToMatrix(data) {
    //const rows = data.split('\n');  // Split the file content into rows
    //return rows.map(row => row.split(';').map(cell => cell.trim()));  // Split each row by comma and trim spaces
    const matrix = [];
    let match;
    const re = /(?:^|;|\n)(?:"([^"]*(?:""[^"]*)*)"|([^";\n]*))/g;
    let row = [];
    
    // Regular expression to match each CSV field, handling quotes
    while (match = re.exec(data)) {
        const quotedField = match[1];
        const unquotedField = match[2];
        
        if (quotedField !== undefined) {
            // Handle the case where the field is wrapped in quotes and may contain commas or newlines
            row.push(quotedField.replace(/""/g, '"')); // Unescape double quotes
        } else {
            // Handle unquoted field (no commas or newlines)
            row.push(unquotedField.replace(/\r/g, ''));  // Remove \r
        }

        // If we encounter a new line (from unescaped line breaks), push the row to the matrix
        if (data[re.lastIndex] === '\n' || re.lastIndex === data.length) {
            matrix.push(row);
            row = [];
        }
    }
    return matrix;
}

// Function to display the matrix on the web page
function displayMatrix(matrix) {
    matrix.forEach(row => {
        alldata[drow] = [];
        row.forEach(cell => {
            alldata[drow][dcol] = cell;
            //if(alldata[drow][dcol] == "") {
            //    alldata[drow][dcol] = "empty";
            //}
            dcol++;
        });
        drow++;
        dcol = 0;
    });
    /* 
    0 - Número OS
    1 - Denominação OS
    2 - Descrição OS
    3 - Ativo
    4 - Data Prevista
    5 - Data/Hora de Conclusão
    6 - Data/Hora Solicitação
    7 - Data/Hora Fechamento
    8 - Equipamento
    9 - Estado OS
    10 - Denominação Estado OS
    11 - Tarefa Executada
    12 - Fechada
    13 - Oficina
    14 - Origem OS
    15 - Denominação Origem OS
    16 - OS Cliente
    17 - Prioridade
    18 - Denominação da Prioridade
    19 - Tipo de Serviço
    20 - Tipo Solic. de Serviço
    21 - Denominação Tipo de Solicitação de Serviço
    22 - Denominação Tipo de Serviço
    23 - Data/Hora 1º Atendimento
    24 - Data Criação
    25 - Número Planejamento
    26 - Procedimento
    27 - TMA 
    */
}

// Load the CSV and convert it to a matrix when the page loads
window.onload = loadCSV;