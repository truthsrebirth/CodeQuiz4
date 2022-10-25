// This section if for the high scores 
// target the scores/buttons/viewScores id's in the html file
let scoresDiv = document.getElementById("scores");
let buttonsDiv = document.getElementById("buttons")
let viewScoresBtn = document.getElementById("viewScores")

// the arrays for local storage and high scores
let emptyArray = [];
let storedArray = JSON.parse(window.localStorage.getItem("highScores")); // local storage
let score = 0

// time 
let secondsLeft = 30; // leave 30 secs for each question
let timer = document.getElementById("timer"); // here I target the id = timer in the html file

// Here I target the results & choices id'd from the html file
var choices = document.getElementById("choices");
let results = document.getElementById("results");

// This is for the start button 
let startButton = document.getElementById("startButton"); // target the startButton id in the html file
startButton.addEventListener("click", setTime); // when the user clicks the button, it will run the setTime function below

var questionDiv = document.getElementById("question"); // target the id=question in the html file
var questionCount = 0;

// This function starts the time for the quiz 
function setTime() { // function on line 22
  displayQuestions();
  let timerInterval = setInterval(function() {
    secondsLeft--;
    timer.textContent = "";
    timer.textContent = "Time: " + secondsLeft;
    if (secondsLeft <= 0 || questionCount === questions.length) {
      clearInterval(timerInterval); // must have this for timer
      captureUserScore();
    } 
  }, 1000); // 1000 milliseconds is 1 second
}

// This function lets the user go back and restart the quiz 
function goBackBtn() {
    let backBtn = document.createElement("input");
    backBtn.setAttribute("type", "button");
    backBtn.setAttribute("value", "Go Back");
    backBtn.addEventListener("click", function(event){ // add event listener
      event.preventDefault();
      window.location.reload();
    })
    buttonsDiv.append(backBtn)
  }

  // Here is a function that displays the questions for my quiz
function displayQuestions() {
  removeEls(startButton);

  if (questionCount < questions.length) {
    questionDiv.innerHTML = questions[questionCount].title;
    choices.textContent = "";

    for (let i = 0; i < questions[questionCount].multiChoice.length; i++) {
      let el = document.createElement("button");
      el.innerText = questions[questionCount].multiChoice[i];
      el.setAttribute("data-id", i);
      el.addEventListener("click", function (event) {
        event.stopPropagation(); // use this for forms

        if (el.innerText === questions[questionCount].answer) {
          score += secondsLeft;
        } else {
          score -= 10;
          secondsLeft = secondsLeft - 15;
        }
        
        questionDiv.innerHTML = "";

        if (questionCount === questions.length) {
          return;
        } else {
          questionCount++;
          displayQuestions();
        }
      });
      choices.append(el);
    }
  }
}

// Use this function below to capture the user's score
function captureUserScore() {
  timer.remove();
  choices.textContent = "";

  // target the input element in the html file
  let initialsInput = document.createElement("input"); 
  let postScoreBtn = document.createElement("input");

  results.innerHTML = `You scored ${score} points! Enter initials: `;
  initialsInput.setAttribute("type", "text");
  postScoreBtn.setAttribute("type", "button");
  postScoreBtn.setAttribute("value", "Post My Score!");
  postScoreBtn.addEventListener("click", function (event) {
    event.preventDefault();
    let scoresArray = defineScoresArray(storedArray, emptyArray);

    let initials = initialsInput.value;
    let userAndScore = {
      initials: initials,
      score: score,
    };

    scoresArray.push(userAndScore);
    saveScores(scoresArray);
    displayAllScores();
    clearScoresBtn();
    goBackBtn();
    viewScoresBtn.remove();
  });
  results.append(initialsInput);
  results.append(postScoreBtn);
}

const saveScores = (array) => {
  window.localStorage.setItem("highScores", JSON.stringify(array));
}

const defineScoresArray = (arr1, arr2) => {
  if(arr1 !== null) {
    return arr1
  } else {
    return arr2
  }
}

const removeEls = (...els) => {
  for (let el of els) el.remove();
}

function viewScores() { // Function to view the scores
  viewScoresBtn.addEventListener("click", function(event) {
    event.preventDefault();
    removeEls(timer, startButton);
    displayAllScores();
    removeEls(viewScoresBtn);
    clearScoresBtn();
    goBackBtn();
  });
}

function clearScoresBtn() { // clears the scores
    let clearBtn = document.createElement("input");
    clearBtn.setAttribute("type", "button");
    clearBtn.setAttribute("value", "Clear Scores");
    clearBtn.addEventListener("click", function(event){
      event.preventDefault();
      removeEls(scoresDiv);
      window.localStorage.removeItem("highScores");
    })
    scoresDiv.append(clearBtn)
  }

function displayAllScores() { // display the scores on screen
    removeEls(timer, startButton, results);
    let scoresArray = defineScoresArray(storedArray, emptyArray);
  
    scoresArray.forEach(obj => {
      let initials = obj.initials;
      let storedScore = obj.score;
      let resultsP = document.createElement("p");
      resultsP.innerText = `${initials}: ${storedScore}`;
      scoresDiv.append(resultsP);
    });
  }

viewScores(); // call the view scores function from line 139