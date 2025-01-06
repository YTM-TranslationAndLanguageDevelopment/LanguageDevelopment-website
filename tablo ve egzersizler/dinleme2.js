let score = 0;
let currentExerciseIndex = 0;
const exerciseContainer = document.getElementById('exercise-container');
const scoreElement = document.getElementById('score');
const previousButton = document.getElementById('previous-button');
const nextButton = document.getElementById('next-button');

// Doğru ve yanlış cevaplar için sayaçları tutan liste
const exercises = [
    { word: 'hello', audio: 'sample-audio-1.mp3' },
    { word: 'world', audio: 'sample-audio-2.mp3' },
    { word: 'apple', audio: 'sample-audio-3.mp3' }
];

const feedbackCounters = exercises.map(() => ({ correct: 0, incorrect: 0 }));

// --- Observer Patter, STATE PATERN
// Alıştırmayı ekrana getir
//Olayları dinleyip tetikleyen işlevler (ör. harfe tıklama, cevap gönderme).
// Alıştırmayı ekrana getir
function displayExercise(index) {
    const exercise = exercises[index];
    const exerciseDiv = document.createElement('div');
    exerciseDiv.classList.add('exercise');
    exerciseDiv.id = `exercise-${index}`;

    exerciseDiv.innerHTML = `
        <h2>Çalışma ${index + 1}</h2>
        <audio id="audio-${index}" src="${exercise.audio}" controls></audio>
        <p>Duyduğunuz kelimeyi yazın:</p>
        <input type="text" id="input-${index}" placeholder="Enter the word">
        <div class="letters-container" id="letters-${index}"></div>
        <button onclick="checkAnswer(${index})">Gönder</button>
        <p id="feedback-${index}"></p>
        <div class="feedback-buttons" id="feedback-buttons-${index}">
            <button disabled>Doğru (<span id="correct-count-${index}">${feedbackCounters[index].correct}</span>)</button>
            <button disabled>Yanlış (<span id="incorrect-count-${index}">${feedbackCounters[index].incorrect}</span>)</button>
        </div>
    `;

    exerciseContainer.innerHTML = '';
    exerciseContainer.appendChild(exerciseDiv);
    exerciseContainer.style.display = 'block';

    displayLetters(exercise.word, index);
    updateNavigationButtons();
}

// --- Decorator Pattern ---
// Harfleri dinamik olarak oluştur
//Harflere dinamik işlevler ekleme (ör. tıklama ile harf ekleme hover).
// Harfleri dinamik olarak oluştur
function displayLetters(word, index) {
    const lettersContainer = document.getElementById(`letters-${index}`);
    
    // Kelimenin benzersiz harflerini al
    const uniqueLetters = [...new Set(word.split(''))];
    
    // Alfabe harfleri (ekstra harfler için)
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    
    // Rastgele harfler ekleme miktarı 4 olacak
    const extraLettersCount = 4; // 4 ekstra harf ekle
    
    const extraLetters = [];
    
    while (extraLetters.length < extraLettersCount) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!uniqueLetters.includes(randomLetter) && !extraLetters.includes(randomLetter)) {
            extraLetters.push(randomLetter);
        }
    }
    
    // Tüm harfleri birleştir ve karıştır
    const allLetters = [...uniqueLetters, ...extraLetters];
    const shuffledLetters = allLetters.sort(() => Math.random() - 0.5);
    
    // Harf kutularını oluştur
    shuffledLetters.forEach(letter => {
        const letterButton = document.createElement('button');
        letterButton.textContent = letter;
        letterButton.onclick = () => addLetter(index, letter);
        lettersContainer.appendChild(letterButton);
    });
}

// Harfleri inputa ekle
function addLetter(index, letter) {
    const input = document.getElementById(`input-${index}`);
    input.value += letter;
}

// Cevap kontrol et ve doğru/yanlış sayaçlarını güncelle
function checkAnswer(index) {
    const input = document.getElementById(`input-${index}`).value.toLowerCase();
    const word = exercises[index].word;
    const feedback = document.getElementById(`feedback-${index}`);
    const correctCountElement = document.getElementById(`correct-count-${index}`);
    const incorrectCountElement = document.getElementById(`incorrect-count-${index}`);

    if (input === word) {
        feedback.textContent = 'Correct!';
        feedback.style.color = 'green';

        // Doğru sayaç artır
        feedbackCounters[index].correct++;
        correctCountElement.textContent = feedbackCounters[index].correct;

        updateScore(10); // Puan artır
    } else {
        feedback.textContent = 'Incorrect!';
        feedback.style.color = 'red';

        // Yanlış sayaç artır
        feedbackCounters[index].incorrect++;
        incorrectCountElement.textContent = feedbackCounters[index].incorrect;
    }
}

// --- State Pattern ---
//displayExercise, updateNavigationButtons ve updateScore işlevleri, uygulamanın durumuna göre davranışı değiştirir.
// Puan güncelle
function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
}

// Navigasyon butonlarını güncelle
function updateNavigationButtons() {
    previousButton.disabled = currentExerciseIndex === 0;
    nextButton.disabled = currentExerciseIndex === exercises.length - 1;
}

// Önceki soruya git
function goToPreviousExercise() {
    if (currentExerciseIndex > 0) {
        currentExerciseIndex--;
        displayExercise(currentExerciseIndex);
    }
}

// Sonraki soruya git
function goToNextExercise() {
    if (currentExerciseIndex < exercises.length - 1) {
        currentExerciseIndex++;
        displayExercise(currentExerciseIndex);
    }
}

// İlk soruyu göster
displayExercise(currentExerciseIndex);
//------------------------------------------------
