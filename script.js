// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);

document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const nicknameInput = document.getElementById('nickname');
    const userForm = document.getElementById('user-form');
    const introScreen = document.getElementById('intro-screen');
    const gameScreen = document.getElementById('game-screen');
    const startGameBtn = document.getElementById('start-game');
    const difficultyScreen = document.getElementById('difficulty-screen');
    const easyBtn = document.getElementById('easy');
    const mediumBtn = document.getElementById('medium');
    const hardBtn = document.getElementById('hard');
    const wavesContainer = document.getElementById('waves-container');
    const scoreBoard = document.getElementById('score-board');
    const scoreSpan = document.getElementById('score');
    const quizGame = document.getElementById('quiz-game');
    const trainer = document.getElementById('trainer');
    const loadingScreen = document.getElementById('loading-screen');

    let score = 0;
    let difficulty = 'easy';
    let quizScore = 0;
    let currentQuestion = 0;

    const questions = [
        {
            question: "Что такое инфразвук?",
            options: ["Звук с высокой частотой", "Звук с низкой частотой", "Тишина", "Звук не слышимый человеческим ухом"],
            correct: 1
        },
        {
            question: "Какая частота инфразвука?",
            options: ["15 Гц", "20 Гц", "50 Гц", "80 Гц"],
            correct: 1
        },
        {
            question: "Какое оборудование используется для создания инфразвука?",
            options: ["Генератор инфразвука", "Генератор радиоволн", "Микрофон", "Эхолот"],
            correct: 0
        },
        {
            question: "Человек может воспринимать инфразвук?",
            options: ["Да", "Нет", "Только животные", "Только в определённом возрасте"],
            correct: 1
        },
        {
            question: "Какова основная опасность инфразвука?",
            options: ["Может вызывать головные боли", "Порушает нормальное восприятие света", "Не оказывает воздействия", "Вызывает сильное чувство счастья"],
            correct: 0
        }
    ];

    // Действия при старте игры
    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = nameInput.value;
        const nickname = nicknameInput.value;

        saveUserData(name, nickname);

        introScreen.style.display = 'none';
        gameScreen.style.display = 'block';
    });

    // Выбор сложности
    startGameBtn.addEventListener('click', () => {
        gameScreen.style.display = 'none';
        difficultyScreen.style.display = 'block';
    });

    easyBtn.addEventListener('click', () => {
        difficulty = 'easy';
        difficultyScreen.style.display = 'none';
        startInfrasoundGame();
    });

    mediumBtn.addEventListener('click', () => {
        difficulty = 'medium';
        difficultyScreen.style.display = 'none';
        startInfrasoundGame();
    });

    hardBtn.addEventListener('click', () => {
        difficulty = 'hard';
        difficultyScreen.style.display = 'none';
        startInfrasoundGame();
    });

    // Игра на инфразвук
    function startInfrasoundGame() {
        score = 0;
        scoreSpan.innerText = `Счет: ${score}`;
        wavesContainer.innerHTML = '';  // Очистка волны

        const waveInterval = setInterval(() => {
            if (score >= 10) {
                clearInterval(waveInterval);
                alert("Игра завершена! Ваш счет: " + score);
                return;
            }
            generateWave();
        }, 2000); // генерируем волны каждую секунду

        function generateWave() {
            const wave = document.createElement('div');
            wave.classList.add('wave');
            const frequency = Math.random() * 50;
            wave.innerText = `${frequency.toFixed(2)} Гц`;

            wave.addEventListener('click', () => {
                if (frequency <= 20) {
                    score += 10;
                    scoreSpan.innerText = `Счет: ${score}`;
                } else {
                    score -= 5;
                    scoreSpan.innerText = `Счет: ${score}`;
                }
            });

            wavesContainer.appendChild(wave);
        }
    }

    // Викторина
    function startQuizGame() {
        quizGame.style.display = 'block';
        loadQuestion();

        function loadQuestion() {
            const question = questions[currentQuestion];
            const questionContainer = document.getElementById('question-container');
            questionContainer.innerHTML = `
                <h2>${question.question}</h2>
                ${question.options.map((option, index) => `
                    <button class="quiz-option" data-index="${index}">${option}</button>
                `).join('')}
            `;

            document.querySelectorAll('.quiz-option').forEach(button => {
                button.addEventListener('click', (e) => {
                    const selectedOption = parseInt(e.target.dataset.index);
                    if (selectedOption === question.correct) {
                        quizScore += 10;
                    } else {
                        quizScore -= 5;
                    }
                    currentQuestion++;

                    if (currentQuestion >= questions.length) {
                        alert("Викторина завершена! Ваш счет: " + quizScore);
                        quizGame.style.display = 'none';
                    } else {
                        loadQuestion();
                    }
                    document.getElementById('quiz-score').innerText = `Счет: ${quizScore}`;
                });
            });
        }
    }

    // Сохранение данных пользователя
    function saveUserData(name, nickname) {
        const userRef = db.ref('users/' + nickname);
        userRef.set({
            name: name,
            nickname: nickname
        });
    }

    // Для тренажера инфразвука
    document.getElementById('generate-wave').addEventListener('click', () => {
        const wave = generateRandomWave();
        document.getElementById('trainer-info').innerText = `Частота волны: ${wave.toFixed(2)} Гц`;
    });

    function generateRandomWave() {
        return Math.random() * 50;
    }

    // Загрузка экрана
    loadingScreen.style.display = 'none';
});
