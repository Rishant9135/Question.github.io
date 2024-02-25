let quizData; // Global variable to store quiz data
let currentQuestion = 0;
let totalMarks = 0;
let obtainedMarks = 0;


function fetchQuizData() {
  fetch('DBMS.json')
    .then(response => response.json())
    .then(data => {
      quizData = data;
      showQuestion();
    })
    .catch(error => console.error('Error loading quiz data:', error));
}

function showQuestion() {
  const questionElement = document.getElementById('question');
  const optionsElement = document.getElementById('options');
  const currentQuestionNumber = currentQuestion + 1; // Calculate the current question number

  const currentQuizData = quizData[currentQuestion];
  questionElement.textContent = `${currentQuestionNumber}. ${currentQuizData.question}`; // Display question number along with the question text
  optionsElement.innerHTML = '';
  currentQuizData.options.forEach((option, index) => {
    const optionElement = document.createElement('label');
    optionElement.style.display = 'inline-block'; // Set display to inline-block
    optionElement.style.marginRight = '10px'; // Add some space between options
    const inputElement = document.createElement('input');
    inputElement.type = 'radio';
    inputElement.name = 'option';
    inputElement.value = option;
    inputElement.addEventListener('change', () => {
      highlightCorrectOption(option);
      disableOptions();
    });
    optionElement.appendChild(inputElement);
    optionElement.appendChild(document.createTextNode(option));
    optionsElement.appendChild(optionElement);
    optionsElement.appendChild(document.createElement('br')); // Add line break after each option
  });

  const nextButton = document.getElementById('nextButton');
  if (currentQuestion === quizData.length - 1) {
    nextButton.textContent = 'Submit';
    nextButton.setAttribute('onclick', 'submitQuiz()');
  } else {
    nextButton.textContent = 'Next Question';
    nextButton.setAttribute('onclick', 'showNextQuestion()');
  }
}

function submitQuiz() {
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (!selectedOption) {
    alert("Please Select any Option.");
    return; // Do nothing if no option is selected
  }

  // Evaluate the last question
  checkAnswer();

  // Display the result
  showResult();
}

function disableOptions() {
  const options = document.querySelectorAll('input[name="option"]');
  options.forEach(option => {
    option.disabled = true;
  });
}

function highlightCorrectOption(chosenOption) {
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (selectedOption) {
    selectedOption.parentElement.classList.remove('correct', 'incorrect');
  }

  const currentQuizData = quizData[currentQuestion];
  const correctOption = currentQuizData.answer;
  const options = document.querySelectorAll('input[name="option"]');
  options.forEach(option => {
    if (option.value === chosenOption) {
      option.parentElement.classList.add(chosenOption === correctOption ? 'correct' : 'incorrect');
    }
    if (option.value === correctOption) {
      option.parentElement.classList.add('correct');
    }
  });
}

function checkAnswer() {
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (!selectedOption) {
    alert("Please select an option.");
    return;
  }

  const currentQuizData = quizData[currentQuestion];
  if (!currentQuizData) {
    return; // Exit if currentQuizData is undefined
  }

  const correctOption = currentQuizData.answer;
  const selectedValue = selectedOption.value;

  if (selectedValue === correctOption) {
    obtainedMarks++;
  }
  totalMarks++;

  // Move to the next question or submit the quiz
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    submitQuiz();
  }
}

function showNextQuestion() {
  if (quizData) {
    if (currentQuestion === quizData.length - 1) {
      submitQuiz(); // Call submitQuiz directly when on the last question
    } else {
      checkAnswer();
    }
  } else {
    fetchQuizData();
  }
}

function showResult() {
  const resultElement = document.getElementById('result');
  const percentage = (obtainedMarks / totalMarks) * 100;
  resultElement.textContent = `You scored ${obtainedMarks} out of ${totalMarks}. Your percentage is ${percentage.toFixed(2)}%.`;
  resultElement.style.display = 'block';
  document.getElementById("resetButton").disabled = false;

}

// Initially fetch quiz data to show the first question
fetchQuizData();

function resetConfirmation() {
  const confirmReset = confirm("Are you sure you want to reset the quiz?");
  if (confirmReset) {
    resetQuiz();
  }
}

function resetQuiz() {
  currentQuestion = 0;
  obtainedMarks = 0;
  totalMarks = 0;

  // Show the first question
  showQuestion();
  document.getElementById('result').style.display = 'none';
}