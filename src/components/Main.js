import React, { useEffect, useState, useCallback } from 'react';
import './css/Main.css';

function Main() {
  const [quizData, setQuizData] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answerExplanation, setAnswerExplanation] = useState(null);
  const [timer, setTimer] = useState(30);
  const [streak, setStreak] = useState(0);
  const [error, setError] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const apiUrl = "https://thingproxy.freeboard.io/fetch/https://api.jsonserve.com/Uw5CrX";

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.questions && Array.isArray(data.questions)) {
          setQuizData(data);
        } else {
          throw new Error("Quiz data format is incorrect.");
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setError(error.message);
      }
    };

    fetchQuizData();
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 < quizData.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setAnswerExplanation(null);
      setTimer(30);
    } else {

      setQuizFinished(true);
    }
  }, [currentQuestionIndex, quizData]);

  useEffect(() => {
    if (quizStarted && timer > 0 && !quizFinished) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer === 0 && !quizFinished) {
      nextQuestion();
    }
  }, [quizStarted, timer, nextQuestion, quizFinished]);

  const startQuiz = () => {
    setLoading(true);
    setTimeout(() => {
      setQuizStarted(true);
      setLoading(false);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedOption(null);
      setShowFeedback(false);
      setStreak(0);
      setAnswerExplanation(null);
      setTimer(30);
      setQuizFinished(false); 
    }, 2000); 
  };

  const handleOptionClick = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);
    setShowFeedback(true);

    const currentQuestion = quizData.questions[currentQuestionIndex];
    setAnswerExplanation(currentQuestion.detailed_solution || "No explanation provided.");

    if (option.is_correct) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  return (
    <div className="main-container">
      {!quizStarted && !quizFinished ? (
        <>
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading Quiz...</p>
            </div>
          ) : (
            <button className="start-btn" onClick={startQuiz}>Start Quiz</button>
          )}
        </>
      ) : quizFinished ? (
        <div className="quiz-results">
          <h2>Quiz Finished!</h2>
          <p>Your Score: {score}</p>
          <p>Your Streak: {streak}</p>
          <button className="restart-btn" onClick={startQuiz}>Restart Quiz</button>
        </div>
      ) : (
        
        <div className="quiz-card">
          {error ? (
            <div className="error">Error: {error}</div>
          ) : quizData ? (
            <>
              <h2>{quizData.title}</h2>
              <p className="timer">⏳ Time Left: {timer}s</p>
              <h3>Question {currentQuestionIndex + 1} of {quizData.questions.length}</h3>
              <p className="question-text">{quizData.questions[currentQuestionIndex].description}</p>
              <div className="options-container">
                {quizData.questions[currentQuestionIndex].options.map((option, index) => (
                  <button 
                    key={index}
                    className={`option-btn ${selectedOption ? (option.is_correct ? 'correct' : selectedOption.id === option.id ? 'incorrect' : '') : ''}`}
                    onClick={() => handleOptionClick(option)}
                    disabled={selectedOption !== null}
                  >
                    {option.description}
                  </button>
                ))}
              </div>
              {showFeedback && (
                <>
                  <p className="explanation">{answerExplanation}</p>
                  <button className="next-btn" onClick={nextQuestion}>Next Question</button>
                </>
              )}
              <div className="score-display">🏆 Score: {score}</div>
              <div className="streak-display">🔥 Streak: {streak}</div>
            </>
          ) : (
            <div>Loading Questions...</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Main;
