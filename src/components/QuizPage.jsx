import React, { useEffect, useState, useCallback } from 'react';
import { CiLogout } from "react-icons/ci";
import { BiRightArrowAlt } from "react-icons/bi";
import { IoCloseSharp } from "react-icons/io5";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import { GoChevronRight } from "react-icons/go";
import { useNavigate, useParams, Link } from 'react-router-dom';
import { quizData } from '../data/quizzes'; // Ensure this path is correct and quizData is complete

const QuizPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  // Find the topic based on topicId
  const topic = quizData.flatMap(cat => cat.topics).find(t => t.id === parseInt(topicId));

  // State for quiz logic
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null); // Stores the letter of the selected option (A, B, C, D)
  const [showNextButton, setShowNextButton] = useState(false);
  const [score, setScore] = useState(0); // This score is for display in QuizPage
  const [userAnswers, setUserAnswers] = useState({}); // { questionId: 'userAnswerText', ... }
  const [quizStartTime, setQuizStartTime] = useState(null); // NEW: Track quiz start time
  const [quizEndTime, setQuizEndTime] = useState(null);     // NEW: Track quiz end time


  // Timer states
  const initialTimer = 15; // Set a default time for each question
  const [timer, setTimer] = useState(initialTimer);
  const [timeUp, setTimeUp] = useState(false);
  const [showTimeUpPopup, setShowTimeUpPopup] = useState(false);

  // Exit popup
  const [showExitPopup, setShowExitPopup] = useState(false);

  // If topic or questions are not found, handle gracefully
  if (!topic || !topic.questions || topic.questions.length === 0) {
    return (
      <div className="container mx-auto py-20 px-4 text-center text-white bg-[#100421] min-h-screen">
        <p className="text-2xl text-red-500">Quiz not found or no questions available for this topic.</p>
        <Link to="/categories" className="text-blue-500 mt-4 inline-block">Go back to Categories</Link>
      </div>
    );
  }

  const currentQuestion = topic.questions[currentQuestionIndex];
  const totalQuestions = topic.questions.length;
  // Using an array for option letters to easily map them
  const optionLetters = ['A', 'B', 'C', 'D'];

  // Find the category ID for navigation back and for performance page
  const category = quizData.find(cat => cat.topics.some(t => t.id === parseInt(topicId)));
  const categoryId = category ? category.id : '';

  // Start quiz time when component mounts
  useEffect(() => {
    setQuizStartTime(Date.now());
  }, []); // Empty dependency array means this runs once on mount


  // Handles moving to the next question or showing results
  const handleNextQuestion = useCallback(() => {
    // Record "unattempted" if no option was selected and it wasn't timeUp
    if (selectedOption === null && !timeUp) {
      setUserAnswers(prevAnswers => ({
        ...prevAnswers,
        [currentQuestion.id]: null // Record as not answered/skipped
      }));
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setTimer(initialTimer); // Reset timer for the new question
      setTimeUp(false); // Reset timeUp status
      setShowTimeUpPopup(false); // Hide time up popup
      setSelectedOption(null); // Clear selected option for the new question
      setShowNextButton(false); // Hide next button
    } else {
      // End of quiz: record end time and navigate to performance page
      const endTime = Date.now();
      setQuizEndTime(endTime); // Set end time
      
      const timeTakenInSeconds = quizStartTime ? Math.floor((endTime - quizStartTime) / 1000) : 0;

      navigate(`/performance/${categoryId}/${topicId}`, {
        state: {
          userAnswers: userAnswers,
          topicQuestions: topic.questions, // Pass all questions for the performance review
          quizTitle: topic.title, // Pass the quiz title for the performance page header
          timeTaken: timeTakenInSeconds // NEW: Pass the total time taken
        }
      });
    }
  }, [currentQuestionIndex, totalQuestions, initialTimer, selectedOption, timeUp, currentQuestion, navigate, categoryId, topicId, userAnswers, topic.questions, topic.title, quizStartTime]);


  useEffect(() => {
    // This effect runs to manage the timer.
    if (selectedOption !== null || timeUp) {
      return; // Early exit, no timer needed.
    }

    let timerInterval;
    if (timer > 0) {
      timerInterval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else { // Timer reached 0
      setTimeUp(true);
      setShowTimeUpPopup(true);
      setShowNextButton(true); // Show next button when time is up
      // Automatically proceed after a short delay if time ran out
      setTimeout(() => {
        setShowTimeUpPopup(false);
        handleNextQuestion(); // This will record as unattempted and move to next or finish
      }, 2000); // Show "Time's Up!" for 2 seconds
    }

    // Cleanup function to clear the interval when component unmounts or dependencies change
    return () => clearInterval(timerInterval);
  }, [timer, selectedOption, timeUp, handleNextQuestion]);


  const handleGoBack = () => {
    setShowExitPopup(false);
    navigate(`/categories/${categoryId}`);
  };

  // Coin animation function
  const animateCoin = () => {
    const coin = document.createElement("img");
    coin.src = "https://quizard.app/images/coin.png"; // Using the provided link
    coin.className = "coin-fly";
    document.body.appendChild(coin);
    setTimeout(() => {
      coin.remove();
    }, 1000);
  };

  const handleOptionClick = (optionText, index) => {
    if (selectedOption !== null || timeUp) return; // Prevent multiple selections or selection after time's up

    const clickedOptionLetter = optionLetters[index]; // Get the letter (A, B, C, D)

    setSelectedOption(clickedOptionLetter); // Set the selected option immediately
    setShowNextButton(true); // Show next button

    // Store user's answer
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [currentQuestion.id]: optionText // Store the full option text
    }));

    if (optionText === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 1);
      animateCoin(); // Re-enabled coin animation for correct answers
    } else {
      // Add shake animation to the incorrect selected option
      document.getElementById(`option-${clickedOptionLetter}`)?.classList.add("shake");
      setTimeout(() => {
        document.getElementById(`option-${clickedOptionLetter}`)?.classList.remove("shake");
      }, 500);
    }
  };

  // Render Quiz Page
  return (
    <div className='bg-[#0b0317] min-h-screen relative'>
      {/* Header */}
      <div className='flex justify-between items-center bg-[#461F7F] py-4 px-4 sm:px-10 lg:px-40 sticky top-0 z-50'>
        <h1 className='capitalize font-semibold text-2xl sm:text-3xl text-amber-300'>{topic.title}</h1> {/* Topic Name */}
        <div className='flex items-center gap-4'>
          <button onClick={() => setShowExitPopup(true)}>
            <CiLogout className='text-3xl text-white cursor-pointer transition-all duration-100 hover:scale-110' />
          </button>
          <div className='flex items-center gap-1 bg-amber-600 border border-white h-8 px-3 rounded-full'>
            <img src="https://quizard.app/images/coin.png" alt="coin" className='w-5 h-5' />
            <span className='text-white font-bold'>{score}</span> {/* Display current score */}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className='flex flex-col justify-center items-center p-2'>
        <div className='text-white p-3 flex h-full max-w-2xl w-full flex-col rounded-2xl shadow-5xl'>
          <div className='flex justify-between items-center p-3'>
            <h3>Question: <span>{currentQuestionIndex + 1}</span> / {totalQuestions}</h3>
            <div className='relative w-12 h-12'>
              <svg className='absolute top-0 left-0' width="48" height="48">
                <circle cx="24" cy="24" r="22" stroke="#FF0000" strokeWidth="4" fill="none"
                  strokeDasharray={138} strokeDashoffset={ (timer / initialTimer) * 138 } strokeLinecap="round" />
              </svg>
              <div className='absolute inset-0 flex items-center justify-center font-semibold text-white'>{timer}</div>
            </div>
          </div>

          <img src={currentQuestion.image || 'https://via.placeholder.com/600x300?text=Quiz+Image'} alt="question visual" className='w-full h-75 object-cover rounded-xl shadow-xl' />
          <h1 className='text-2xl font-semibold text-white capitalize items-start p-3'>{currentQuestion.question}</h1> {/* Question Heading */}
          <hr className='py-1.5 opacity-5' />

          <div className='flex flex-col gap-2.5 text-xl font-medium py-2 capitalize'>
            {currentQuestion.options.map((optionText, index) => {
              const optionLetter = optionLetters[index]; // A, B, C, D
              const isCorrectOption = optionText === currentQuestion.correctAnswer;
              const isSelectedOption = selectedOption === optionLetter;

              return (
                <div
                  key={optionLetter}
                  id={`option-${optionLetter}`} // Unique ID for shake animation
                  className={`flex gap-5 border rounded-xl p-3 px-4 transition-all duration-200 items-center relative
                    ${selectedOption !== null && isCorrectOption ? 'bg-green-500 border-green-700' : ''}
                    ${isSelectedOption && !isCorrectOption ? 'bg-red-500 border-red-700' : ''}
                    ${selectedOption === null ? 'border-gray-500 hover:border-blue-400 cursor-pointer' : 'border-gray-700 pointer-events-none'}
                  `}
                  onClick={() => handleOptionClick(optionText, index)}
                >
                  <span>{optionLetter}. </span>
                  <div className="w-px h-8 bg-gray-300"></div>
                  <span className="flex-1">{optionText}</span> {/* Option Text */}
                  {selectedOption !== null && isCorrectOption && <MdCheckCircle className="text-white text-2xl" />}
                  {isSelectedOption && !isCorrectOption && <MdCancel className="text-white text-2xl" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Next Button */}
      {showNextButton && (
        <div className='flex items-center justify-center sticky bottom-0 z-50 bg-[#30125e] h-20 w-screen animate-slide-up'>
          <button
            onClick={handleNextQuestion}
            className='relative flex items-center gap-2 text-white text-xl font-semibold px-6 py-3 cursor-pointer'
          >
            {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}
            <GoChevronRight className='text-2xl' />
          </button>
        </div>
      )}

      {/* Exit Popup */}
      {showExitPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-transparent">
          <div className="bg-white relative p-6 sm:p-8 rounded-xl shadow-xl text-center max-w-sm w-full">
            <button
              onClick={() => setShowExitPopup(false)}
              className="absolute top-3 cursor-pointer right-3 text-gray-600 hover:text-red-500 transition-transform duration-300 hover:rotate-90"
            >
              <IoCloseSharp size={26} />
            </button>
            <h2 className="text-xl font-semibold text-[#100421] mb-6 mt-2">Do you want to exit this quiz?</h2>
            <button
              onClick={handleGoBack}
              className="group cursor-pointer bg-[#461F7F] text-white px-6 py-3 rounded-full text-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:gap-3 hover:shadow-lg"
            >
              Go Back
              <BiRightArrowAlt className="text-2xl cursor-pointer transition-transform duration-300 transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}

      {/* Time's Up Popup */}
      {showTimeUpPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-transparent">
          <div className="bg-white relative p-6 sm:p-8 rounded-xl shadow-xl text-center max-w-sm w-full">
            <h2 className="text-xl font-semibold text-[#100421] mb-6 mt-2">Time's Up!</h2>
            <p className="text-gray-700">Moving to the next question...</p>
          </div>
        </div>
      )}

      <style>{`
        .shake {
          animation: shake 0.4s;
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }

        .coin-fly {
          position: absolute;
          bottom: 15%;
          left: 50%;
          width: 30px;
          height: 30px;
          animation: flyCoin 1s ease forwards;
          z-index: 1000;
        }
        @keyframes flyCoin {
          0% {
            transform: translate(-50%, 0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -100px) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate(calc(100vw - 100px - 50%), -90vh) scale(0.5);
            opacity: 0;
          }
        }

        .animate-slide-up {
          animation: slideUp 0.4s ease-in-out;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default QuizPage;