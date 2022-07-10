const QUESTIONS_API_URL = 'http://localhost:5000/questions';
const SUBMISSIONS_API_URL = 'http://localhost:5000/submissions';

async function fetchQuestionsAndSubmissions() {
  const questions = await fetch(QUESTIONS_API_URL);
  const submissions = await fetch(SUBMISSIONS_API_URL);
  const questionsJson = await questions.json();
  const submissionsJson = await submissions.json();
  const promisesArray = [questionsJson, submissionsJson];
  const responses = await Promise.all(promisesArray);

  return responses;
}

async function oneStructureData() {
  const dataArray = await fetchQuestionsAndSubmissions();
  const questions = dataArray[0];
  const submissions = dataArray[1];
  const modifiedQuestionArray = questions.map((question) => {
    const status = submissions.filter(
      (submission) => submission.questionId === question.id
    );
    return {
      ...question,
      status: status.length > 0 ? status[0].status : 'Not Submitted',
    };
  });

  return modifiedQuestionArray;
}

async function groupByCategory() {
  const dataArray = await oneStructureData();
  console.log('🚀 ~ dataArray', dataArray);

  const categoryArray = dataArray.reduce((curr, next) => {
    if (curr[next.category]) {
      curr[next.category].push(next);
    } else {
      curr[next.category] = [];
    }
    return curr;
  }, {});
  console.log(categoryArray);
  return categoryArray;
}

// <div class="category">
// <h2>HTML</h2>
// <div class="question">
// <h3>Stopwatch</h3>
// </div>
// <div class="question">
// <h3>Tic Tac Toe</h3>
// </div>
// </div>

async function drawHtmlElements() {
  const questions = await groupByCategory();
  const questionsContainer = document.getElementById('container');

  for (let question in questions) {
    const categoryArray = questions[question];
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category');
    const categoryTitle = document.createElement('h2');
    categoryTitle.innerText = question;
    categoryContainer.appendChild(categoryTitle);

    ////////////////////////////////////////////////////

    ////////////////////////////////////////////////////
    categoryArray.forEach((element) => {
      const questionContainer = document.createElement('div');
      questionContainer.classList.add('question');
      const questionTitle = document.createElement('h3');
      const questionStatus = document.createElement('div');
      questionStatus.classList.add('status');
      questionStatus.style.backgroundColor =
        element.status === 'CORRECT'
          ? 'green'
          : element.status === 'PARTIALLY_CORRECT'
          ? 'orange'
          : element.status === 'Not Submitted'
          ? null
          : 'red';

      questionTitle.innerText = element.name;
      questionContainer.appendChild(questionStatus);
      questionContainer.appendChild(questionTitle);
      categoryContainer.appendChild(questionContainer);
    });
    questionsContainer.appendChild(categoryContainer);
  }
}
drawHtmlElements();
