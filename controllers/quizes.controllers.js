const ErrorResponse = require("../utils/errorResponse");

// Function to generate a random integer between min (inclusive) and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a quiz question
function generateQuiz() {
  const num1 = getRandomInt(1, 10); // Generate random number between 1 and 10
  const num2 = getRandomInt(1, 10); // Generate random number between 1 and 10
  const operations = ['+', '-', '*'];
  const operation = operations[getRandomInt(0, 2)]; // Select a random operation
  let answer;
  switch (operation) {
    case '+':
      answer = num1 + num2;
      break;
    case '-':
      answer = num1 - num2;
      break;
    case '*':
      answer = num1 * num2;
      break;
  }
  return {
    question: `${num1} ${operation} ${num2}`,
    answer: answer
  };
}

exports.getQuizes = async (req, res, next) => {
  try {
    const quizzes = [];
    for (let i = 0; i < 10; i++) {
      quizzes.push(generateQuiz());
    }
    return res.status(200).json({
      success: true,
      message: "Quizes found",
      data: quizzes,
    });
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};
