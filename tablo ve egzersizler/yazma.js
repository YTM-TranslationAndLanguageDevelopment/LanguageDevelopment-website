const questions = [
    {
        words: ["blue", "sky", "beautiful"],
        example: "The sky is blue and beautiful."
    },
    {
        words: ["fast", "car", "expensive"],
        example: "A fast car is often expensive."
    },
    {
        words: ["dogs", "loyal", "friends"],
        example: "Dogs are loyal friends."
    }
];

let currentQuestionIndex = 0;

const wordListElement = document.getElementById("word-list");
const userInput = document.getElementById("user-input");
const feedback = document.getElementById("feedback");
const currentQuestionElement = document.getElementById("current-question");
const totalQuestionsElement = document.getElementById("total-questions");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");

function loadQuestion(index) {
    const question = questions[index];
    wordListElement.innerHTML = "";
    question.words.forEach(word => {
        const li = document.createElement("li");
        li.textContent = word;
        wordListElement.appendChild(li);
    });
    currentQuestionElement.textContent = index + 1;
    totalQuestionsElement.textContent = questions.length;
    userInput.value = "";
    feedback.textContent = "";
    feedback.className = "";
    prevButton.style.display = index > 0 ? "block" : "none";  // Önceki soruya gitmek için butonu göster
    nextButton.style.display = index < questions.length - 1 ? "block" : "none";  // Sonraki soruya gitmek için butonu göster
}

function checkSentence() {
    const userSentence = userInput.value.trim().toLowerCase();
    const question = questions[currentQuestionIndex];

    // Kelimelerin tamamının cümlede yer alıp almadığını kontrol et
    const allWordsUsed = question.words.every(word => userSentence.includes(word));
    
    // Cümlede mantıklı bir yapı olup olmadığını kontrol et (örnek basit kontrol)
    const isLogical = userSentence.includes(".") && userSentence.split(" ").length > 3;

    // Dilbilgisel hata ve mantıklı cümle kontrolü
    if (allWordsUsed && isLogical) {
        feedback.textContent = "✅ Harika iş! Cümleniz doğru.";
        feedback.className = "success";
    } else {
        feedback.textContent = "❌ Lütfen tüm kelimeleri kullandığınızdan ve mantıklı bir cümle yazdığınızdan emin olun.";
        feedback.className = "error";
    }
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion(currentQuestionIndex);
    }
}

document.getElementById("check-button").addEventListener("click", checkSentence);
nextButton.addEventListener("click", nextQuestion);
prevButton.addEventListener("click", prevQuestion);

loadQuestion(currentQuestionIndex);
