'use strict';
const QUIZ_API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';
const quizTitle = document.getElementById('quizTitle');
const quizGenre = document.getElementById('quizGenre');
const quizDifficulty = document.getElementById('quizDifficulty');
const quiz = document.getElementById('quiz');
const answerList = document.getElementById('answerList');
const returnHomeBtn = document.getElementById('returnHomeBtn');
const startQuizBtn = document.getElementById('startQuizBtn');

class Quiz {
  constructor(quizData) {
    this._quizResults = quizData.results;
    this._correctAnswersNum = 0;
  }

  getQuizCategory(index) {
    return this._quizResults[index - 1].category;
  }

  getQuizDifficulty(index) {
    return this._quizResults[index - 1].difficulty;
  }

  getQuizQuestion(index) {
    return this._quizResults[index - 1].question;
  }

  getQuizCorrectAnswer(index) {
    return this._quizResults[index - 1].correct_answer;
  }

  getNumOfQuiz() {
    return this._quizResults.length;
  }

  countCorrectAnswersNum(index, answer) {
    const correctAnswer = this._quizResults[index - 1].correct_answer;
    if (answer === correctAnswer) {
      return this._correctAnswersNum++;
    }
  }

  getQuizIncorrectAnswers(index) {
    return this._quizResults[index - 1].incorrect_answers;
  }

  getCorrectAnswersNum() {
    return this._correctAnswersNum;
  }
}

const finishQuiz = quizInstance => {
  quizTitle.textContent = `あなたの正当数は${quizInstance.getCorrectAnswersNum()}です！`;
  quizGenre.innerHTML = '';
  quizDifficulty.innerHTML = '';
  answerList.innerHTML = '';
  quiz.textContent = '再度チャレンジしたい場合は以下をクリック';
  startQuizBtn.classList.add('hidden');
  returnHomeBtn.classList.remove('hidden');
};

const nextQuiz = (quizInstance, index) => {
  if (index <= quizInstance.getNumOfQuiz()) {
    makeQuiz(quizInstance, index);
  } else {
    finishQuiz(quizInstance);
  }
};

const shuffleArray = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const createAnswersArr = (quizInstance, index) => {
  const answers = [
    quizInstance.getQuizCorrectAnswer(index),
    ...quizInstance.getQuizIncorrectAnswers(index),
  ];
  return shuffleArray(answers);
};

const makeQuiz = (quizInstance, index) => {
  answerList.innerHTML = '';
  quizTitle.innerHTML = `問題${index}`;
  quizGenre.innerHTML = `[ジャンル]${quizInstance.getQuizCategory(index)}`;
  quizDifficulty.innerHTML = `[難易度]${quizInstance.getQuizDifficulty(index)}`;
  quiz.innerHTML = `${quizInstance.getQuizQuestion(index)}`;

  const answers = createAnswersArr(quizInstance, index);

  answers.forEach(answer => {
    const answerLi = document.createElement('li');
    const answerBtn = document.createElement('button');
    answerBtn.textContent = answer;
    answerLi.appendChild(answerBtn);
    answerList.appendChild(answerLi);

    answerBtn.addEventListener('click', function () {
      quizInstance.countCorrectAnswersNum(index, answer);
      index++;
      nextQuiz(quizInstance, index);
    });
  });
};

startQuizBtn.addEventListener('click', function () {
  quizTitle.textContent = '取得中';
  quiz.textContent = '少々お待ちください';
  startQuizBtn.classList.toggle('hidden');
  fetchQuiz();
});

returnHomeBtn.addEventListener('click', function () {
  quizTitle.textContent = 'ようこそ';
  quiz.textContent = '以下のボタンをクリックしてください';
  returnHomeBtn.classList.toggle('hidden');
  startQuizBtn.classList.toggle('hidden');
});

const fetchQuiz = async function () {
  try {
    const quizRes = await fetch(QUIZ_API_URL);
    const quizData = await quizRes.json();
    const quizInstance = new Quiz(quizData);
    const index = 1;
    makeQuiz(quizInstance, index);
  } catch (err) {
    alert(err);
    returnHomeBtn.classList.toggle('hidden');
  }
};
