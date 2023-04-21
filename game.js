const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName('choice-text'));

const questionCounterText = document.getElementById("questionCounter");
const progressText = document.getElementById("progressText");
const pointText = document.getElementById("points");

const progressBarFull = document.getElementById("progressBarFull");


let currentQuestion = {};
let acceptAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];


// Use question stored in the questions.json file

/*
let questions = [];

fetch('questions.json')
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions;
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

      */

// Use question fetched from the Open trivia API 



let questions = [];

fetch("https://opentdb.com/api.php?amount=50&category=18&difficulty=medium&type=multiple")

.then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });


//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;


startGame = () => {
    questionCounter = 0
    score = 0;
    availableQuesions = [...questions];
    getNewQuestions();

};

getNewQuestions = () => {


    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score)
        return window.location.assign("/end.html");
    }
    questionCounter++;
    progressText.innerText = `Questions ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    //questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion["choice" + number];
    });


    availableQuesions.splice(questionIndex, 1);
    acceptAnswers = true;
}

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if (!acceptAnswers) return;

        acceptAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];


        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";



        if (classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
        }


        selectedChoice.parentElement.classList.add(classToApply);


        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestions();

        }, 1000);



    });
})

incrementScore = num => {
    score += num;
    pointText.innerText = score;
};