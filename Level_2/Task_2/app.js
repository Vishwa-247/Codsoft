// DOM Elements
const pages = document.querySelectorAll(".page");
const navAuthenticated = document.getElementById("nav-authenticated");
const navUnauthenticated = document.getElementById("nav-unauthenticated");
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mainNav = document.getElementById("main-nav");
const toast = document.getElementById("toast");

// Navigation Elements
const navHome = document.getElementById("nav-home");
const navCreate = document.getElementById("nav-create");
const navMyQuizzes = document.getElementById("nav-my-quizzes");
const navProfile = document.getElementById("nav-profile");
const navLogout = document.getElementById("nav-logout");
const navLogin = document.getElementById("nav-login");
const navRegister = document.getElementById("nav-register");
const switchToRegister = document.getElementById("switch-to-register");
const switchToLogin = document.getElementById("switch-to-login");

// Form Elements
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const createQuizForm = document.getElementById("create-quiz-form");
const addQuestionBtn = document.getElementById("add-question");
const questionsContainer = document.getElementById("questions-list");

// Quiz Taking Elements
const prevQuestionBtn = document.getElementById("prev-question");
const nextQuestionBtn = document.getElementById("next-question");
const submitQuizBtn = document.getElementById("submit-quiz");
const returnHomeBtn = document.getElementById("return-home");
const retryQuizBtn = document.getElementById("retry-quiz");

// Tab Elements
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

// Current State
let currentUser = null;
let currentPage = "login-page";
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];

// Initialize the application
function init() {
  // Check if user is logged in
  const storedUser = localStorage.getItem("currentUser");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    showAuthenticatedUI();
    navigateTo("home-page");
    loadQuizzes();
    updateProfileInfo();
  } else {
    showUnauthenticatedUI();
    navigateTo("login-page");
  }

  // Add event listeners
  addEventListeners();
}

// Add all event listeners
function addEventListeners() {
  // Navigation
  navHome.addEventListener("click", () => navigateTo("home-page"));
  navCreate.addEventListener("click", () => navigateTo("create-quiz-page"));
  navMyQuizzes.addEventListener("click", () => {
    navigateTo("my-quizzes-page");
    loadMyQuizzes();
  });
  navProfile.addEventListener("click", () => {
    navigateTo("profile-page");
    updateProfileInfo();
  });
  navLogout.addEventListener("click", logout);
  navLogin.addEventListener("click", () => navigateTo("login-page"));
  navRegister.addEventListener("click", () => navigateTo("register-page"));
  switchToRegister.addEventListener("click", () => navigateTo("register-page"));
  switchToLogin.addEventListener("click", () => navigateTo("login-page"));

  // Mobile menu
  mobileMenuToggle.addEventListener("click", toggleMobileMenu);

  // Forms
  loginForm.addEventListener("submit", handleLogin);
  registerForm.addEventListener("submit", handleRegister);
  createQuizForm.addEventListener("submit", handleCreateQuiz);
  addQuestionBtn.addEventListener("click", addQuestion);

  // Quiz navigation
  prevQuestionBtn.addEventListener("click", goToPreviousQuestion);
  nextQuestionBtn.addEventListener("click", goToNextQuestion);
  submitQuizBtn.addEventListener("click", submitQuiz);
  returnHomeBtn.addEventListener("click", () => navigateTo("home-page"));
  retryQuizBtn.addEventListener("click", retryQuiz);

  // Tabs
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.getAttribute("data-tab");
      switchTab(tabName);
    });
  });

  // Search
  document.getElementById("quiz-search").addEventListener("input", handleSearch);
}

// Navigation Functions
function navigateTo(pageId) {
  pages.forEach((page) => {
    page.classList.add("hidden");
  });
  document.getElementById(pageId).classList.remove("hidden");
  currentPage = pageId;

  // Special page initialization
  if (pageId === "home-page") {
    loadQuizzes();
  } else if (pageId === "create-quiz-page") {
    resetCreateQuizForm();
  }
}

function showAuthenticatedUI() {
  navUnauthenticated.classList.add("hidden");
  navAuthenticated.classList.remove("hidden");
}

function showUnauthenticatedUI() {
  navAuthenticated.classList.add("hidden");
  navUnauthenticated.classList.remove("hidden");
}

function toggleMobileMenu() {
  mainNav.classList.toggle("active");
}

// Authentication Functions
function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Find user
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // Login successful
    currentUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    showAuthenticatedUI();
    navigateTo("home-page");
    showToast("Login successful!");
  } else {
    // Login failed
    showToast("Invalid email or password!", "error");
  }
}

function handleRegister(e) {
  e.preventDefault();

  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById("register-confirm-password").value;

  // Validate passwords match
  if (password !== confirmPassword) {
    showToast("Passwords do not match!", "error");
    return;
  }

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if email already exists
  if (users.some((user) => user.email === email)) {
    showToast("Email already in use!", "error");
    return;
  }

  // Create new user
  const newUser = {
    id: generateId(),
    name,
    email,
    password,
    quizzesCreated: [],
    quizzesTaken: [],
  };

  // Add user to users array
  users.push(newUser);

  // Save to localStorage
  localStorage.setItem("users", JSON.stringify(users));

  // Auto login
  currentUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  };

  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  showAuthenticatedUI();
  navigateTo("home-page");
  showToast("Registration successful!");
}

function logout() {
  localStorage.removeItem("currentUser");
  currentUser = null;
  showUnauthenticatedUI();
  navigateTo("login-page");
  showToast("Logged out successfully!");
}

// Quiz Creation Functions
function resetCreateQuizForm() {
  createQuizForm.reset();
  questionsContainer.innerHTML = "";
  addQuestion(); // Add one question by default
}

function addQuestion() {
  const questionNumber = questionsContainer.children.length + 1;

  const questionItem = document.createElement("div");
  questionItem.className = "question-item";
  questionItem.innerHTML = `
        <div class="question-header">
            <span class="question-number">Question ${questionNumber}</span>
            ${
              questionNumber > 1
                ? '<button type="button" class="remove-question">&times;</button>'
                : ""
            }
        </div>
        <div class="form-group">
            <label for="question-${questionNumber}">Question Text</label>
            <input type="text" id="question-${questionNumber}" name="question-${questionNumber}" required>
        </div>
        <div class="options-container" id="options-container-${questionNumber}">
            <div class="option-item">
                <input type="radio" id="correct-option-${questionNumber}-1" name="correct-option-${questionNumber}" value="1" required>
                <input type="text" class="option-text" name="option-${questionNumber}-1" placeholder="Option 1" required>
            </div>
            <div class="option-item">
                <input type="radio" id="correct-option-${questionNumber}-2" name="correct-option-${questionNumber}" value="2" required>
                <input type="text" class="option-text" name="option-${questionNumber}-2" placeholder="Option 2" required>
            </div>
        </div>
        <button type="button" class="add-option" data-question="${questionNumber}">+ Add Option</button>
    `;

  questionsContainer.appendChild(questionItem);

  // Add event listeners for the new question
  const removeBtn = questionItem.querySelector(".remove-question");
  if (removeBtn) {
    removeBtn.addEventListener("click", () => {
      questionItem.remove();
      updateQuestionNumbers();
    });
  }

  const addOptionBtn = questionItem.querySelector(".add-option");
  addOptionBtn.addEventListener("click", () => {
    addOption(questionNumber);
  });
}

function addOption(questionNumber) {
  const optionsContainer = document.getElementById(`options-container-${questionNumber}`);
  const optionCount = optionsContainer.children.length + 1;

  const optionItem = document.createElement("div");
  optionItem.className = "option-item";
  optionItem.innerHTML = `
        <input type="radio" id="correct-option-${questionNumber}-${optionCount}" name="correct-option-${questionNumber}" value="${optionCount}" required>
        <input type="text" class="option-text" name="option-${questionNumber}-${optionCount}" placeholder="Option ${optionCount}" required>
        <button type="button" class="remove-option">&times;</button>
    `;

  optionsContainer.appendChild(optionItem);

  // Add event listener for remove option button
  const removeOptionBtn = optionItem.querySelector(".remove-option");
  removeOptionBtn.addEventListener("click", () => {
    optionItem.remove();
    updateOptionNumbers(questionNumber);
  });
}

function updateQuestionNumbers() {
  const questionItems = questionsContainer.querySelectorAll(".question-item");
  questionItems.forEach((item, index) => {
    const questionNumber = index + 1;
    item.querySelector(".question-number").textContent = `Question ${questionNumber}`;

    // Update question input id and name
    const questionInput = item.querySelector('input[id^="question-"]');
    questionInput.id = `question-${questionNumber}`;
    questionInput.name = `question-${questionNumber}`;

    // Update options container id
    const optionsContainer = item.querySelector(".options-container");
    optionsContainer.id = `options-container-${questionNumber}`;

    // Update add option button data-question attribute
    const addOptionBtn = item.querySelector(".add-option");
    addOptionBtn.setAttribute("data-question", questionNumber);

    // Update option inputs
    const optionItems = item.querySelectorAll(".option-item");
    optionItems.forEach((optionItem, optionIndex) => {
      const optionNumber = optionIndex + 1;

      // Update radio button
      const radioBtn = optionItem.querySelector('input[type="radio"]');
      radioBtn.id = `correct-option-${questionNumber}-${optionNumber}`;
      radioBtn.name = `correct-option-${questionNumber}`;
      radioBtn.value = optionNumber;

      // Update text input
      const textInput = optionItem.querySelector(".option-text");
      textInput.name = `option-${questionNumber}-${optionNumber}`;
      textInput.placeholder = `Option ${optionNumber}`;
    });
  });
}

function updateOptionNumbers(questionNumber) {
  const optionsContainer = document.getElementById(`options-container-${questionNumber}`);
  const optionItems = optionsContainer.querySelectorAll(".option-item");

  optionItems.forEach((item, index) => {
    const optionNumber = index + 1;

    // Update radio button
    const radioBtn = item.querySelector('input[type="radio"]');
    radioBtn.id = `correct-option-${questionNumber}-${optionNumber}`;
    radioBtn.value = optionNumber;

    // Update text input
    const textInput = item.querySelector(".option-text");
    textInput.name = `option-${questionNumber}-${optionNumber}`;
    textInput.placeholder = `Option ${optionNumber}`;
  });
}

function handleCreateQuiz(e) {
  e.preventDefault();

  const title = document.getElementById("quiz-title").value;
  const description = document.getElementById("quiz-description").value;

  // Get questions
  const questions = [];
  const questionItems = questionsContainer.querySelectorAll(".question-item");

  questionItems.forEach((item, index) => {
    const questionNumber = index + 1;
    const questionText = document.getElementById(`question-${questionNumber}`).value;

    // Get options
    const options = [];
    const optionsContainer = document.getElementById(`options-container-${questionNumber}`);
    const optionItems = optionsContainer.querySelectorAll(".option-item");

    let correctOptionIndex = 0;
    const selectedRadio = item.querySelector(
      `input[name="correct-option-${questionNumber}"]:checked`,
    );
    if (selectedRadio) {
      correctOptionIndex = Number.parseInt(selectedRadio.value) - 1;
    }

    optionItems.forEach((optionItem, optionIndex) => {
      const optionNumber = optionIndex + 1;
      const optionText = optionItem.querySelector(`.option-text`).value;

      options.push({
        text: optionText,
        isCorrect: optionIndex === correctOptionIndex,
      });
    });

    questions.push({
      text: questionText,
      options: options,
    });
  });

  // Create quiz object
  const quiz = {
    id: generateId(),
    title,
    description,
    author: currentUser.id,
    authorName: currentUser.name,
    createdAt: new Date().toISOString(),
    questions,
  };

  // Save quiz to localStorage
  const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
  quizzes.push(quiz);
  localStorage.setItem("quizzes", JSON.stringify(quizzes));

  // Update user's created quizzes
  updateUserCreatedQuizzes(quiz.id);

  // Navigate to home page
  navigateTo("home-page");
  showToast("Quiz created successfully!");
}

function updateUserCreatedQuizzes(quizId) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userIndex = users.findIndex((u) => u.id === currentUser.id);

  if (userIndex !== -1) {
    if (!users[userIndex].quizzesCreated) {
      users[userIndex].quizzesCreated = [];
    }

    users[userIndex].quizzesCreated.push(quizId);
    localStorage.setItem("users", JSON.stringify(users));
  }
}

// Quiz Loading Functions
function loadQuizzes() {
  const quizList = document.getElementById("quiz-list");
  const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

  if (quizzes.length === 0) {
    quizList.innerHTML = '<p class="text-center">No quizzes available. Create one!</p>';
    return;
  }

  quizList.innerHTML = "";

  quizzes.forEach((quiz) => {
    const quizCard = createQuizCard(quiz);
    quizList.appendChild(quizCard);
  });
}

function loadMyQuizzes() {
  // Load created quizzes
  const createdQuizList = document.getElementById("created-quiz-list");
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.id === currentUser.id);

  if (!user) return;

  const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

  // Created quizzes
  const createdQuizIds = user.quizzesCreated || [];
  const createdQuizzes = quizzes.filter((quiz) => createdQuizIds.includes(quiz.id));

  if (createdQuizzes.length === 0) {
    createdQuizList.innerHTML = '<p class="text-center">You haven\'t created any quizzes yet.</p>';
  } else {
    createdQuizList.innerHTML = "";
    createdQuizzes.forEach((quiz) => {
      const quizCard = createQuizCard(quiz, true);
      createdQuizList.appendChild(quizCard);
    });
  }

  // Taken quizzes
  const takenQuizList = document.getElementById("taken-quiz-list");
  const takenQuizzes = user.quizzesTaken || [];

  if (takenQuizzes.length === 0) {
    takenQuizList.innerHTML = '<p class="text-center">You haven\'t taken any quizzes yet.</p>';
  } else {
    takenQuizList.innerHTML = "";
    takenQuizzes.forEach((result) => {
      const quiz = quizzes.find((q) => q.id === result.quizId);
      if (quiz) {
        const resultItem = document.createElement("div");
        resultItem.className = "result-item";
        resultItem.innerHTML = `
                    <div class="result-info">
                        <h4>${quiz.title}</h4>
                        <p class="result-date">Taken on ${new Date(
                          result.takenAt,
                        ).toLocaleDateString()}</p>
                    </div>
                    <div class="result-score">${result.score}%</div>
                `;

        resultItem.addEventListener("click", () => {
          viewQuizResult(result);
        });

        takenQuizList.appendChild(resultItem);
      }
    });
  }
}

function createQuizCard(quiz, isMyQuiz = false) {
  const quizCard = document.createElement("div");
  quizCard.className = "quiz-card";
  quizCard.innerHTML = `
        <div class="quiz-card-body">
            <h3 class="quiz-card-title">${quiz.title}</h3>
            <p class="quiz-card-text">${quiz.description}</p>
        </div>
        <div class="quiz-card-footer">
            <div class="quiz-meta">
                <p>By ${quiz.authorName}</p>
                <p>${quiz.questions.length} questions</p>
            </div>
            <button class="btn btn-primary take-quiz-btn">Take Quiz</button>
        </div>
    `;

  // Add event listener for take quiz button
  const takeQuizBtn = quizCard.querySelector(".take-quiz-btn");
  takeQuizBtn.addEventListener("click", () => {
    startQuiz(quiz);
  });

  return quizCard;
}

// Quiz Taking Functions
function startQuiz(quiz) {
  currentQuiz = quiz;
  currentQuestionIndex = 0;
  userAnswers = new Array(quiz.questions.length).fill(null);

  navigateTo("take-quiz-page");
  updateQuizHeader();
  showQuestion(currentQuestionIndex);
}

function updateQuizHeader() {
  document.getElementById("quiz-title-display").textContent = currentQuiz.title;
  document.getElementById("quiz-description-display").textContent = currentQuiz.description;
  document.getElementById("total-questions").textContent = currentQuiz.questions.length;
}

function showQuestion(index) {
  const question = currentQuiz.questions[index];
  const quizContent = document.getElementById("quiz-content");

  // Update progress
  document.getElementById("current-question").textContent = index + 1;
  const progressFill = document.querySelector(".progress-fill");
  progressFill.style.width = `${((index + 1) / currentQuiz.questions.length) * 100}%`;

  // Create question container
  quizContent.innerHTML = "";
  const questionContainer = document.createElement("div");
  questionContainer.className = "question-container";

  // Add question text
  const questionText = document.createElement("div");
  questionText.className = "question-text";
  questionText.textContent = question.text;
  questionContainer.appendChild(questionText);

  // Add options
  const optionsList = document.createElement("div");
  optionsList.className = "options-list";

  question.options.forEach((option, optionIndex) => {
    const optionElement = document.createElement("div");
    optionElement.className = "option";
    optionElement.textContent = option.text;

    // Check if this option was previously selected
    if (userAnswers[index] === optionIndex) {
      optionElement.classList.add("selected");
    }

    optionElement.addEventListener("click", () => {
      // Remove selected class from all options
      const options = optionsList.querySelectorAll(".option");
      options.forEach((opt) => opt.classList.remove("selected"));

      // Add selected class to clicked option
      optionElement.classList.add("selected");

      // Save user's answer
      userAnswers[index] = optionIndex;

      // Enable next button if it was disabled
      nextQuestionBtn.disabled = false;
    });

    optionsList.appendChild(optionElement);
  });

  questionContainer.appendChild(optionsList);
  quizContent.appendChild(questionContainer);

  // Update navigation buttons
  prevQuestionBtn.disabled = index === 0;

  if (index === currentQuiz.questions.length - 1) {
    nextQuestionBtn.classList.add("hidden");
    submitQuizBtn.classList.remove("hidden");
  } else {
    nextQuestionBtn.classList.remove("hidden");
    submitQuizBtn.classList.add("hidden");
    nextQuestionBtn.disabled = userAnswers[index] === null;
  }
}

function goToPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion(currentQuestionIndex);
  }
}

function goToNextQuestion() {
  if (currentQuestionIndex < currentQuiz.questions.length - 1) {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  }
}

function submitQuiz() {
  // Check if all questions are answered
  const unansweredQuestions = userAnswers.findIndex((answer) => answer === null);

  if (unansweredQuestions !== -1) {
    showToast(`Please answer question ${unansweredQuestions + 1} before submitting.`, "error");
    currentQuestionIndex = unansweredQuestions;
    showQuestion(currentQuestionIndex);
    return;
  }

  // Calculate score
  let correctAnswers = 0;

  userAnswers.forEach((answer, index) => {
    const question = currentQuiz.questions[index];
    if (question.options[answer].isCorrect) {
      correctAnswers++;
    }
  });

  const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);

  // Save quiz result
  saveQuizResult(score);

  // Show results page
  navigateTo("quiz-results-page");
  showQuizResults(score, correctAnswers);
}

function saveQuizResult(score) {
  const result = {
    quizId: currentQuiz.id,
    score,
    userAnswers,
    takenAt: new Date().toISOString(),
  };

  // Update user's taken quizzes
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userIndex = users.findIndex((u) => u.id === currentUser.id);

  if (userIndex !== -1) {
    if (!users[userIndex].quizzesTaken) {
      users[userIndex].quizzesTaken = [];
    }

    users[userIndex].quizzesTaken.push(result);
    localStorage.setItem("users", JSON.stringify(users));
  }
}

function showQuizResults(score, correctAnswers) {
  document.getElementById("score-percentage").textContent = `${score}%`;
  document.getElementById("correct-answers").textContent = correctAnswers;
  document.getElementById("total-questions-results").textContent = currentQuiz.questions.length;

  // Show question breakdown
  const questionsBreakdown = document.getElementById("questions-breakdown");
  questionsBreakdown.innerHTML = "";

  currentQuiz.questions.forEach((question, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = question.options[userAnswer].isCorrect;

    const questionResult = document.createElement("div");
    questionResult.className = "question-result";

    const questionHeader = document.createElement("div");
    questionHeader.className = "question-result-header";

    const questionText = document.createElement("div");
    questionText.className = "question-text";
    questionText.textContent = `${index + 1}. ${question.text}`;

    const resultStatus = document.createElement("div");
    resultStatus.className = `result-status ${isCorrect ? "correct" : "incorrect"}`;
    resultStatus.textContent = isCorrect ? "Correct" : "Incorrect";

    questionHeader.appendChild(questionText);
    questionHeader.appendChild(resultStatus);

    const userAnswerText = document.createElement("p");
    userAnswerText.innerHTML = `Your answer: <strong>${question.options[userAnswer].text}</strong>`;

    questionResult.appendChild(questionHeader);
    questionResult.appendChild(userAnswerText);

    if (!isCorrect) {
      const correctAnswerIndex = question.options.findIndex((option) => option.isCorrect);
      const correctAnswerText = document.createElement("p");
      correctAnswerText.innerHTML = `Correct answer: <strong>${question.options[correctAnswerIndex].text}</strong>`;
      questionResult.appendChild(correctAnswerText);
    }

    questionsBreakdown.appendChild(questionResult);
  });
}

function retryQuiz() {
  startQuiz(currentQuiz);
}

function viewQuizResult(result) {
  const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
  const quiz = quizzes.find((q) => q.id === result.quizId);

  if (quiz) {
    currentQuiz = quiz;
    userAnswers = result.userAnswers;

    navigateTo("quiz-results-page");
    showQuizResults(result.score, Math.round((result.score / 100) * quiz.questions.length));
  }
}

// Profile Functions
function updateProfileInfo() {
  if (!currentUser) return;

  document.getElementById("profile-name").textContent = currentUser.name;
  document.getElementById("profile-email").textContent = currentUser.email;

  // Get user data
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.id === currentUser.id);

  if (user) {
    const quizzesCreated = user.quizzesCreated || [];
    const quizzesTaken = user.quizzesTaken || [];

    document.getElementById("quizzes-created-count").textContent = quizzesCreated.length;
    document.getElementById("quizzes-taken-count").textContent = quizzesTaken.length;

    // Calculate average score
    if (quizzesTaken.length > 0) {
      const totalScore = quizzesTaken.reduce((sum, result) => sum + result.score, 0);
      const averageScore = Math.round(totalScore / quizzesTaken.length);
      document.getElementById("average-score").textContent = `${averageScore}%`;

      // Calculate best score
      const bestScore = Math.max(...quizzesTaken.map((result) => result.score));
      document.getElementById("best-score").textContent = `${bestScore}%`;
    } else {
      document.getElementById("average-score").textContent = "N/A";
      document.getElementById("best-score").textContent = "N/A";
    }
  }
}

// Utility Functions
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function showToast(message, type = "success") {
  const toastMessage = document.getElementById("toast-message");
  toastMessage.textContent = message;

  toast.className = "toast";
  if (type === "error") {
    toast.classList.add("error");
  } else {
    toast.classList.remove("error");
  }

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function switchTab(tabName) {
  // Update tab buttons
  tabBtns.forEach((btn) => {
    if (btn.getAttribute("data-tab") === tabName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Update tab content
  tabContents.forEach((content) => {
    if (content.id === `${tabName}-quizzes`) {
      content.classList.add("active");
    } else {
      content.classList.remove("active");
    }
  });
}

function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
  const quizList = document.getElementById("quiz-list");

  if (quizzes.length === 0) {
    return;
  }

  quizList.innerHTML = "";

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm) ||
      quiz.description.toLowerCase().includes(searchTerm),
  );

  if (filteredQuizzes.length === 0) {
    quizList.innerHTML = '<p class="text-center">No quizzes match your search.</p>';
    return;
  }

  filteredQuizzes.forEach((quiz) => {
    const quizCard = createQuizCard(quiz);
    quizList.appendChild(quizCard);
  });
}

// Initialize the application
document.addEventListener("DOMContentLoaded", init);
