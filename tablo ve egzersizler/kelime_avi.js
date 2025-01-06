const WordSearchGame = (() => {
    // İlk bulmaca kelimeleri
    const wordLists = [
        ["APPLE", "ORANGE", "GRAPE", "BANANA", "PEAR"],  // İlk bulmaca kelimeleri
        ["MELON", "CHERRY", "LEMON", "PEACH", "BERRY"],   // İkinci bulmaca kelimeleri
        ["STRAWBERRY", "BLUEBERRY", "WATERMELON", "PINEAPPLE", "KIWI"]  // Üçüncü bulmaca kelimeleri
    ];
    const gridSize = 10;
    const directions = [
        { x: 0, y: 1 }, // right
        { x: 1, y: 0 }, // down
        { x: 1, y: 1 }, // diagonal down-right
    ];

    let currentWords = wordLists[0];  // Başlangıçta ilk bulmaca kelimeleri
    let grid = [];
    let selectedCells = [];
    let foundWords = new Set();
    let gameCompleted = false;

    const createGrid = () => {
        grid = Array.from({ length: gridSize }, () =>
            Array.from({ length: gridSize }, () => "")
        );

        currentWords.forEach(word => placeWord(word));
        fillEmptyCells();
    };

    const placeWord = (word) => {
        let placed = false;
        while (!placed) {
            const startX = Math.floor(Math.random() * gridSize);
            const startY = Math.floor(Math.random() * gridSize);
            const direction = directions[Math.floor(Math.random() * directions.length)];
            if (canPlaceWord(word, startX, startY, direction)) {
                for (let i = 0; i < word.length; i++) {
                    grid[startX + i * direction.x][startY + i * direction.y] = word[i];
                }
                placed = true;
            }
        }
    };

    const canPlaceWord = (word, x, y, direction) => {
        for (let i = 0; i < word.length; i++) {
            const newX = x + i * direction.x;
            const newY = y + i * direction.y;
            if (
                newX < 0 ||
                newY < 0 ||
                newX >= gridSize ||
                newY >= gridSize ||
                (grid[newX][newY] && grid[newX][newY] !== word[i])
            ) {
                return false;
            }
        }
        return true;
    };

    const fillEmptyCells = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (!grid[i][j]) {
                    grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }
    };

    const renderGrid = () => {
        const gridContainer = document.getElementById("grid-container");
        gridContainer.innerHTML = "";
        for (let i = 0; i < gridSize; i++) {
            const row = document.createElement("div");
            row.className = "grid-row";
            for (let j = 0; j < gridSize; j++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.textContent = grid[i][j];
                cell.dataset.x = i;
                cell.dataset.y = j;
                cell.addEventListener("click", handleCellClick);
                row.appendChild(cell);
            }
            gridContainer.appendChild(row);
        }
    };

    const renderWordList = () => {
        const wordList = document.getElementById("word-list");
        wordList.innerHTML = "";
        currentWords.forEach(word => {
            const listItem = document.createElement("li");
            listItem.textContent = word;
            listItem.id = `word-${word}`;
            wordList.appendChild(listItem);
        });
    };

    const handleCellClick = (e) => {
        const cell = e.target;
        cell.classList.toggle("selected");

        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        const cellPosition = `${x},${y}`;
        if (selectedCells.includes(cellPosition)) {
            selectedCells = selectedCells.filter(pos => pos !== cellPosition);
        } else {
            selectedCells.push(cellPosition);
        }

        checkWord();
    };

    const checkWord = () => {
        const selectedWord = selectedCells
            .map(pos => {
                const [x, y] = pos.split(",").map(Number);
                return grid[x][y];
            })
            .join("");
        if (currentWords.includes(selectedWord) && !foundWords.has(selectedWord)) {
            foundWords.add(selectedWord);
            document.getElementById(`word-${selectedWord}`).style.textDecoration = "line-through";
            selectedCells.forEach(pos => {
                const [x, y] = pos.split(",").map(Number);
                document.querySelector(`[data-x="${x}"][data-y="${y}"]`).classList.add("found");
            });
            selectedCells = [];
        }

        if (foundWords.size === currentWords.length) {
            gameCompleted = true;
            showNotification();
        }
    };

    const showNotification = () => {
        const notification = document.getElementById("notification");
        notification.classList.add("visible");
    };

    const restartGame = () => {
        foundWords.clear();
        selectedCells = [];
        gameCompleted = false;
        const notification = document.getElementById("notification");
        notification.classList.remove("visible");

        // Sonraki bulmacaya geçiş yapıyoruz
        moveToNextPuzzle();
    };

    const moveToNextPuzzle = () => {
        // Geçerli kelimeler listesini değiştirelim (sonraki bulmaca için)
        const currentPuzzleIndex = wordLists.indexOf(currentWords);
        let nextPuzzleIndex = (currentPuzzleIndex + 1) % wordLists.length;
        currentWords = wordLists[nextPuzzleIndex];

        createGrid();
        renderGrid();
        renderWordList();
    };

    const nextPuzzle = () => {
        if (gameCompleted) {
            restartGame();
        } else {
            alert("Bulmaca tamamlanmadan yeni bir bulmacaya geçilemez!");
        }
    };

    return {
        init: () => {
            createGrid();
            renderGrid();
            renderWordList();
            document.getElementById("restart-btn").addEventListener("click", restartGame);
            document.getElementById("next-btn").addEventListener("click", nextPuzzle);
        },
    };
})();

document.addEventListener("DOMContentLoaded", () => {
    WordSearchGame.init();
});
