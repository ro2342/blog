var height = 9; // número de tentativas
var width = 5; // tamanho das palavras

var row = 0; // tentativa atual
var col = 0; // letra atual

var gameOver = false;

var wordList; // Lista de palavras a ser obtida do Gist
var word = ""; // Palavra atual a ser adivinhada

// URL raw do Gist com a lista de palavras
var GIST_URL = 'https://gist.githubusercontent.com/ro2342/cccb744260bc4528dcfce42a0eb79ac0/raw/cca0ccd62710a4e03dd4da3c96550e780e76a926/wordlist';

window.onload = function () {
    carregarListaPalavras(GIST_URL)
        .then(lista => {
            wordList = lista;
            iniciarJogo();
        })
        .catch(erro => {
            console.error('Erro ao carregar a lista de palavras:', erro);
        });
};

function carregarListaPalavras(gistURL) {
    return fetch(gistURL)
        .then(response => response.text())
        .then(text => text.split('\n').filter(palavra => palavra.trim() !== ''));
}

function iniciarJogo() {
    word = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
    console.log(word);
    intialize();
}

function removerAcentos(palavra) {
    return palavra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function restaurarAcentos(palavraDigitada) {
    const palavraSemAcento = removerAcentos(palavraDigitada);
    for (let palavraOriginal of wordList) {
        if (removerAcentos(palavraOriginal).toUpperCase() === palavraSemAcento.toUpperCase()) {
            return palavraOriginal.toUpperCase();
        }
    }
    return palavraDigitada; // Retorna a palavra sem alterações se não encontrar uma versão com acentos
}

function validarPalavra(palavra) {
    const palavraCorrigida = restaurarAcentos(palavra);
    return wordList.some(item => removerAcentos(item).toUpperCase() === removerAcentos(palavraCorrigida).toUpperCase());
}

function intialize() {
    let board = document.getElementById("board");

    // Define as variáveis CSS para ajustar automaticamente as dimensões do tabuleiro
    document.documentElement.style.setProperty("--linhas", height);
    document.documentElement.style.setProperty("--colunas", width);

    board.innerHTML = ""; // Limpa o tabuleiro antes de recriar

    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = `${r}-${c}`;
            tile.classList.add("tile");
            board.appendChild(tile);
        }

    }

    // Criando o teclado
    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ç"],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
    ];

    for (let i = 0; i < keyboard.length; i++) {
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for (let key of keyboard[i]) {
            let keyTile = document.createElement("div");
            keyTile.innerText = key;
            keyTile.id = key === "Enter" ? "Enter" : key === "⌫" ? "Backspace" : "Key" + key;
            keyTile.classList.add(key === "Enter" ? "enter-key-tile" : "key-tile");
            keyTile.addEventListener("click", processKey);
            keyboardRow.appendChild(keyTile);
        }
        document.body.appendChild(keyboardRow);
    }

    document.addEventListener("keyup", processInput);
}

function processKey() {
    processInput({ "code": this.id });
}

function processInput(e) {
    if (gameOver) return;

    if (/^Key[A-ZÇ]$/.test(e.code)) {
        if (col < width) {
            let currTile = document.getElementById(`${row}-${col}`);
            if (currTile.innerText === "") {
                currTile.innerText = e.code === "KeyÇ" ? "Ç" : e.code[3];
                col++;
            }
        }
    } else if (e.code === "Backspace") {
        if (col > 0) {
            col--;
            document.getElementById(`${row}-${col}`).innerText = "";
        }
    } else if (e.code === "Enter") {
        let guess = "";
        for (let c = 0; c < width; c++) {
            guess += document.getElementById(`${row}-${c}`).innerText;
        }

        if (validarPalavra(guess)) {
            let guessCorrigido = restaurarAcentos(guess);

            for (let c = 0; c < width; c++) {
                document.getElementById(`${row}-${c}`).innerText = guessCorrigido[c];
            }

            update();
        } else {
            alert('Palavra inválida!');
        }
    }

    if (!gameOver && row === height) {
        gameOver = true;
        document.getElementById("answer").innerText = word;
        setTimeout(() => window.location.reload(false), 2000);
    }
}

function update() {
    let correct = 0;
    let letterCount = {};

    for (let letter of word) {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    }

    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(`${row}-${c}`);
        let letter = currTile.innerText;

        if (word[c] === letter) {
            currTile.classList.add("correct");
            document.getElementById("Key" + letter)?.classList.add("correct");
            correct++;
            letterCount[letter]--;
        }
    }

    if (correct === width) {
        gameOver = true;
        setTimeout(() => window.location.reload(false), 2000);
    }

    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(`${row}-${c}`);
        let letter = currTile.innerText;

        if (!currTile.classList.contains("correct")) {
            if (word.includes(letter) && letterCount[letter] > 0) {
                currTile.classList.add("present");
                document.getElementById("Key" + letter)?.classList.add("present");
                letterCount[letter]--;
            } else {
                currTile.classList.add("absent");
                document.getElementById("Key" + letter)?.classList.add("absent");
            }
        }
    }

    row++;
    col = 0;
}
