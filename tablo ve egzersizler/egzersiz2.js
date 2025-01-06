// Flyweight: sorular için yalnız bir nesne kullanılır
// bellek tasarrufu
//Bu sınıf, soruları, seçenekleri ve doğru cevabı tutar. 
// Bu sınıfın amacı yalnızca verileri taşımaktır, 
// başka bir işlevi yoktur.
class QuestionFlyweight {
    constructor(question, options, correct) {
        this.question = question;
        this.options = options;
        this.correct = correct;
    }
}

class QuestionFactory {
    constructor() {
        this.questions = new Map();
    }

    getQuestion(question, options, correct) {
        const key = JSON.stringify({ question, options, correct });
        if (!this.questions.has(key)) {
            this.questions.set(key, new QuestionFlyweight(question, options, correct));
        }
        return this.questions.get(key);
    }
}

const questionFactory = new QuestionFactory();

const questionsEnToTr = [
    questionFactory.getQuestion(" blue?", ["mavi", "yeşil", "kırmızı", "sarı"], "mavi"),
    questionFactory.getQuestion(" red?", ["mavi", "yeşil", "kırmızı", "sarı"], "kırmızı"),
    questionFactory.getQuestion(" green?", ["mavi", "yeşil", "kırmızı", "sarı"], "yeşil"),
    questionFactory.getQuestion(" yellow?", ["mavi", "yeşil", "kırmızı", "sarı"], "sarı"),
    questionFactory.getQuestion(" blue?", ["mavi", "yeşil", "kırmızı", "sarı"], "mavi"),
    questionFactory.getQuestion(" blue?", ["mavi", "yeşil", "kırmızı", "sarı"], "mavi"),
    questionFactory.getQuestion(" blue?", ["mavi", "yeşil", "kırmızı", "sarı"], "mavi"),
    questionFactory.getQuestion(" blue?", ["mavi", "yeşil", "kırmızı", "sarı"], "mavi"),
    questionFactory.getQuestion(" blue?", ["mavi", "yeşil", "kırmızı", "sarı"], "mavi"),
    questionFactory.getQuestion(" blue?", ["mavi", "yeşil", "kırmızı", "sarı"], "mavi"),
];

const questionsTrToEn = [
    questionFactory.getQuestion("Elma'nın İngilizcesi nedir?", ["Apple", "Banana", "Grape", "Peach"], "Apple"),
    questionFactory.getQuestion("muzun İngilizcesi nedir?", ["Apple", "Banana", "Grape", "Peach"], "Banana"),
    questionFactory.getQuestion("üzümün İngilizcesi nedir?", ["Apple", "Banana", "Grape", "Peach"], "Grape"),
    questionFactory.getQuestion("şeftalinin İngilizcesi nedir?", ["Apple", "Banana", "Grape", "Peach"], "Peach"),
    questionFactory.getQuestion("Elma'nın İngilizcesi nedir?", ["Apple", "Banana", "Grape", "Peach"], "Apple"),
    questionFactory.getQuestion("Elma'nın İngilizcesi nedir?", ["Apple", "Banana", "Grape", "Peach"], "Apple"),
    questionFactory.getQuestion("Elma'nın İngilizcesi nedir?", ["Apple", "Banana", "Grape", "Peach"], "Apple"),
    questionFactory.getQuestion("Elma'nın İngilizcesi nedir?", ["Apple", "Banana", "Grape", "Peach"], "Apple"),
    questionFactory.getQuestion("Elma'nın İngilizcesi nedir?", ["Apple", "Banana", "Grape", "Peach"], "Apple"),
    questionFactory.getQuestion("Türkçe 'Köpek' kelimesi İngilizceye nasıl çevrilir?", ["Dog", "Cat", "Rabbit", "Horse"], "Dog")
];

// Adapter: soru nesneleri, soruların farklı formatlarını 
// kabul eden bir arabirimle 
// (adapter) uyumlu hale getirilmiştir.
class QuestionAdapter {
    static adapt(question) {
        return {
            questionText: question.question,
            options: question.options,
            correctAnswer: question.correct
        };
    }
}

const adaptedQuestionsEnToTr = questionsEnToTr.map(QuestionAdapter.adapt);
const adaptedQuestionsTrToEn = questionsTrToEn.map(QuestionAdapter.adapt);

class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.currentIndex = 0;
        this.score = 0;
    }

    get currentQuestion() {
        return this.questions[this.currentIndex];
    }

    next() {
        this.currentIndex++;
    }

    isFinished() {
        return this.currentIndex >= this.questions.length;
    }
}

class QuizController {
    constructor(quiz) {
        this.quiz = quiz;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
    }

    //OBSERVER kullanıcını cevabını izler buna göre skor doğru
    //yanlış sayılarını günceller
    updateScoreboard() {
        document.getElementById("correct-answers").textContent = this.correctAnswers;
        document.getElementById("wrong-answers").textContent = this.wrongAnswers;
        document.getElementById("score").textContent = this.quiz.score;
    }

    startQuiz() {
        // Başlangıç ekranını gizle, quiz ekranını göster
        document.getElementById("start-screen").classList.add("hidden");
        document.getElementById("quiz-screen").classList.remove("hidden");
        this.loadQuestion();
    }

    loadQuestion() {
        const question = this.quiz.currentQuestion;
        document.getElementById("question-text").textContent = question.questionText;
        const optionsContainer = document.getElementById("options-container");
        optionsContainer.innerHTML = "";

        question.options.forEach(option => {
            const button = document.createElement("button");
            button.textContent = option;
            button.classList.add("option-button");
            button.addEventListener("click", () => this.selectOption(button, option));
            optionsContainer.appendChild(button);
        });
    }

    selectOption(button, selectedOption) {
        const correctOption = this.quiz.currentQuestion.correctAnswer;
        if (selectedOption === correctOption) {
            this.quiz.score += 10;
            this.correctAnswers++;
            button.style.backgroundColor = "green";
        } else {
            this.wrongAnswers++;
            button.style.backgroundColor = "red";
        }

        this.updateScoreboard();

        setTimeout(() => {
            button.style.backgroundColor = "";
            if (this.quiz.isFinished()) {
                this.showResult();
            } else {
                this.quiz.next();
                this.loadQuestion();
            }
        }, 1000);
    }

    showResult() {
        document.getElementById("quiz-screen").classList.add("hidden");
        document.getElementById("result-screen").classList.remove("hidden");
        document.getElementById("final-score").textContent = this.quiz.score;
        document.getElementById("final-correct").textContent = this.correctAnswers;
        document.getElementById("final-wrong").textContent = this.wrongAnswers;
    }

    // "Pas" butonunun işlevi
    skipQuestion() {
        if (!this.quiz.isFinished()) {
            this.quiz.next();
            this.loadQuestion();
        }
    }
}

// Event Listeners
document.getElementById("btn-en-to-tr").addEventListener("click", () => {
    const quiz = new Quiz(adaptedQuestionsEnToTr);
    const controller = new QuizController(quiz);
    controller.startQuiz();
    document.getElementById("btn-pass").addEventListener("click", () => {
        controller.skipQuestion();
    });
});

document.getElementById("btn-tr-to-en").addEventListener("click", () => {
    const quiz = new Quiz(adaptedQuestionsTrToEn);
    const controller = new QuizController(quiz);
    controller.startQuiz();
    document.getElementById("btn-pass").addEventListener("click", () => {
        controller.skipQuestion();
    });
});

document.getElementById("btn-restart").addEventListener("click", () => {
    document.getElementById("result-screen").classList.add("hidden");
    document.getElementById("start-screen").classList.remove("hidden");
});

document.getElementById("dinleme0").onclick = function () {
    window.location.href = "dinleme2.html";
};
document.getElementById("okuma").onclick = function () {
    window.location.href = "okuma3.html";
};
document.getElementById("yazma").onclick = function () {
    window.location.href = "yazma.html";
};

//---------------------------------------------------------

// Başlangıç ekranını gösterme ve gizleme işlevleri
function showStartScreen() {
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('quiz-screen').classList.add('hidden');
}

function showQuizScreen() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
}

// Tarayıcı geçmişi için durumu ekleyin
document.getElementById('btn-en-to-tr').addEventListener('click', function() {
    showQuizScreen();
    history.pushState({ screen: 'quiz' }, 'Quiz Screen', '#quiz');
});

document.getElementById('btn-tr-to-en').addEventListener('click', function() {
    showQuizScreen();
    history.pushState({ screen: 'quiz' }, 'Quiz Screen', '#quiz');
});

// Tarayıcı geçmişindeki değişikliklere tepki verin
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.screen === 'quiz') {
        showQuizScreen();
    } else {
        showStartScreen();
    }
});

// İlk sayfa yüklendiğinde doğru ekranı göster
if (window.location.hash === '#quiz') {
    showQuizScreen();
} else {
    showStartScreen();
}
