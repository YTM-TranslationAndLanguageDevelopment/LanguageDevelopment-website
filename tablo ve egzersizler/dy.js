const questions = [
    { english: 'Fluctuate', turkish: 'Dalgalanmak', correct: true },
    { english: 'Book', turkish: 'Kitap', correct: true },
    { english: 'Enhance', turkish: 'Geliştirmek', correct: true },
    { english: 'Reliable', turkish: 'Güvenilir', correct: true },
    { english: 'Grateful', turkish: 'Minnettar', correct: true },
    { english: 'Adapt', turkish: 'Uyumsuz', correct: false },
    { english: 'Cat', turkish: 'Köpek', correct: false },
    { english: 'Perspective', turkish: 'Pencere', correct: false },
    { english: 'Love', turkish: 'Aşk', correct: true },
    { english: 'Dog', turkish: 'Kedi', correct: false }
];

let currentQuestion = 0;
let timerInterval;
let timeLeft = 30; // Zamanlı mod için 30 saniye
let gameEnded = false; // Oyun bitip bitmediğini kontrol etmek için
let correctAnswers = 0;
let incorrectAnswers = 0;

const questionElement = document.getElementById('question');
const feedbackElement = document.getElementById('feedback');
const timerElement = document.getElementById('timer');
const trueButton = document.getElementById('true-button');
const falseButton = document.getElementById('false-button');
const nextButton = document.getElementById('next-button');

const popup = document.getElementById('popup');
const correctCountElement = document.getElementById('correct-count');
const incorrectCountElement = document.getElementById('incorrect-count');
const playAgainButton = document.getElementById('play-again');
const homeButton = document.getElementById('home');

function showQuestion() {
    if (currentQuestion < questions.length) {
        const question = questions[currentQuestion];
        questionElement.textContent = `${question.english} - ${question.turkish}`;
        feedbackElement.textContent = '';
        if (timeLeft === 30) { // Oyun başında zaman sıfırlanır
            timerElement.textContent = timeLeft;
            startTimer();
        }
    }
}

function startTimer() {
    if (gameEnded) return; // Oyun bitmişse zamanlayıcıyı başlatma

    if (timerInterval) clearInterval(timerInterval); // Eski zamanlayıcıyı temizle
    timerInterval = setInterval(() => {
        timerElement.textContent = timeLeft;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timerInterval);
            feedbackElement.textContent = 'Zaman bitti!';
            nextButton.style.display = 'block';
            showPopup(); // Zaman bittiğinde popup'ı göster
        }
    }, 1000);
}

function checkAnswer(isTrue) {
    const question = questions[currentQuestion];
    const correct = question.correct;

    if ((isTrue && correct) || (!isTrue && !correct)) {
        feedbackElement.textContent = 'Doğru!';
        correctAnswers++;
    } else {
        feedbackElement.textContent = 'Yanlış!';
        incorrectAnswers++;
    }

    nextButton.style.display = 'block';
}

trueButton.addEventListener('click', () => checkAnswer(true));
falseButton.addEventListener('click', () => checkAnswer(false));

nextButton.addEventListener('click', () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
        nextButton.style.display = 'none'; // Sonraki butonunu gizle
    } else {
        feedbackElement.textContent = 'Tüm soruları tamamladınız!';
        nextButton.style.display = 'none';
        gameEnded = true; // Oyun bitti
        showPopup(); // Popup'ı göster
    }
});

function showPopup() {
    // Popup'ta doğru ve yanlış sayısını göster
    correctCountElement.textContent = correctAnswers;
    incorrectCountElement.textContent = incorrectAnswers;
    popup.style.display = 'block';
}

playAgainButton.addEventListener('click', () => {
    // Yeni oyuna başla
    currentQuestion = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    gameEnded = false;
    timeLeft = 30; // Zamanı sıfırla
    popup.style.display = 'none'; // Popup'ı gizle
    showQuestion();
});

homeButton.addEventListener('click', () => {
    // Anasayfaya dön
    window.location.href = "o.html"; // Anasayfaya gidiş URL'sini buraya yazabilirsiniz
});

// Başlangıçta ilk soruyu göster
showQuestion();
