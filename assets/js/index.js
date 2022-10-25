// This section if for the high scores 
let scoresDiv = document.getElementById("scores");
let buttonsDiv = document.getElementById("buttons")
let viewScoresBtn = document.getElementById("viewScores")

// arrays for highscores and for local storage 
let emptyArray = [];
let storedArray = JSON.parse(window.localStorage.getItem("highScores"));
let score = 0

// time 
let secondsLeft = 76;
let timer = document.getElementById("timer");

//choices section 
var choices = document.getElementById("choices");
let results = document.getElementById("results");

//start button 
let startButton = document.getElementById("startButton");
startButton.addEventListener("click", setTime);

//questions
var questionDiv = document.getElementById("question");
var questionCount = 0;




// This funtion will set the timer as soon as quiz is started 
function setTime() {
  displayQuestions();
  let timerInterval = setInterval(function() {
    secondsLeft--;
    timer.textContent = "";
    timer.textContent = "Time: " + secondsLeft;
    if (secondsLeft <= 0 || questionCount === questions.length) {
      clearInterval(timerInterval);
      captureUserScore();
    } 
  }, 1000);
}

// This funtion will let the user go back and restart the quiz 
function goBackBtn() {
    let backBtn = document.createElement("input");
    backBtn.setAttribute("type", "button");
    backBtn.setAttribute("value", "Go Back");
    backBtn.addEventListener("click", function(event){
      event.preventDefault();
      window.location.reload();
    })
    buttonsDiv.append(backBtn)
  }


  // This funtion displays questions 
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
        event.stopPropagation();

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

// This funtion will capture the users score 
function captureUserScore() {
  timer.remove();
  choices.textContent = "";

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


// This funtion will help view the scores 
function viewScores() {
  viewScoresBtn.addEventListener("click", function(event) {
    event.preventDefault();
    removeEls(timer, startButton);
    displayAllScores();
    removeEls(viewScoresBtn);
    clearScoresBtn();
    goBackBtn();
  });
}

// This funciton will clear all scores from local drive 
function clearScoresBtn() {    
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

// This funtion helps with the displaying of the scores on the local storage
function displayAllScores() {
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
  



viewScores();