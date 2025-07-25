import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { IoArrowBackOutline } from "react-icons/io5"; // For the back arrow icon
import { MdOutlineShare } from "react-icons/md"; // For the share icon
import { RiFileListLine } from "react-icons/ri"; // For the review questions icon
import { FaCrown } from "react-icons/fa"; // For the leaderboard icon

function Performance() {
  const { categoryId, topicId } = useParams();
  const location = useLocation();
  const { userAnswers = {}, topicQuestions = [] } = location.state || {};

  if (!topicQuestions || topicQuestions.length === 0) {
    return (
      <div className="bg-[#100421] min-h-screen flex items-center justify-center p-4">
        <div className="container mx-auto p-6 max-w-2xl bg-white rounded-lg shadow-xl text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz Performance</h1>
          <p className="text-lg text-gray-700 mb-6">No quiz data available. Please complete a quiz first.</p>
          <Link
            to={`/categories/${categoryId}/${topicId}`}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Go back to Quiz
          </Link>
        </div>
      </div>
    );
  }

  const correctAnswersCount = topicQuestions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
  const totalQuestions = topicQuestions.length;
  const incorrectAnswersCount = totalQuestions - correctAnswersCount;
  const unattemptedCount = topicQuestions.filter(q => userAnswers[q.id] === null || userAnswers[q.id] === undefined).length;

  // Assuming some average time per question for simplicity, or you could track actual time in QuizPage
  // For now, let's use a dummy value if actual time tracking isn't implemented.
  const timeSpent = "0 sec"; // Placeholder for actual time if not tracked
  const timePerQuestion = "0 sec"; // Placeholder for actual time if not tracked

  // Calculate Accuracy (as a percentage)
  const accuracy = totalQuestions > 0 ? ((correctAnswersCount / totalQuestions) * 100).toFixed(0) : 0;

  return (
    <div className='bg-[#0b0317] min-h-screen relative p-4 sm:p-6 lg:p-8'>
      {/* Header with Back Button and Quiz Name */}
      <div className='flex items-center gap-4 text-white mb-6'>
        <Link to={"/"} className="text-3xl hover:text-purple-400 transition-colors">
          <IoArrowBackOutline />
        </Link>
        <h1 className='text-3xl font-bold capitalize'>
          {topicQuestions[0]?.topicTitle || "Quiz"} {/* Assuming all questions in topic have same topicTitle or pass it via state */}
        </h1>
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto'>

        {/* Coin Earned */}
        <div className='bg-[#1F0C3B] p-5 rounded-2xl flex flex-col justify-center items-center text-white text-center shadow-lg border border-[#461F7F]'>
          <p className='text-lg sm:text-xl text-gray-300 mb-2'>Coin Earned</p>
          <div className='flex items-center gap-2'>
            <img src="https://quizard.app/images/coin.png" alt="coin" className='w-8 h-8' />
            <span className='text-4xl font-bold'>{correctAnswersCount}</span> {/* 1 coin per correct answer */}
          </div>
        </div>

        {/* Your Score */}
        <div className='bg-[#1F0C3B] p-5 rounded-2xl flex flex-col justify-center items-center text-white text-center shadow-lg border border-[#461F7F]'>
          <p className='text-lg sm:text-xl text-gray-300 mb-2'>Your Score</p>
          <div className='flex items-center gap-2'>
            <img src="https://quizard.app/images/trophy.png" alt="trophy" className='w-8 h-8' /> {/* Placeholder for trophy */}
            <span className='text-4xl font-bold'>{correctAnswersCount}</span>
          </div>
        </div>

        {/* Correct */}
        <div className='bg-[#1F0C3B] p-5 rounded-2xl flex flex-col justify-center items-center text-white text-center shadow-lg border border-[#461F7F]'>
          <p className='text-lg sm:text-xl text-gray-300 mb-2'>Correct</p>
          <span className='text-4xl font-bold text-green-400'>{correctAnswersCount}</span>
        </div>

        {/* Incorrect */}
        <div className='bg-[#1F0C3B] p-5 rounded-2xl flex flex-col justify-center items-center text-white text-center shadow-lg border border-[#461F7F]'>
          <p className='text-lg sm:text-xl text-gray-300 mb-2'>Incorrect</p>
          <span className='text-4xl font-bold text-red-400'>{incorrectAnswersCount}</span>
        </div>

        {/* Accuracy */}
        <div className='bg-[#1F0C3B] p-5 rounded-2xl flex flex-col justify-center items-center text-white text-center shadow-lg border border-[#461F7F]'>
          <p className='text-lg sm:text-xl text-gray-300 mb-2'>Accuracy</p>
          <span className='text-4xl font-bold text-blue-400'>{accuracy}%</span>
        </div>

        {/* Time Spent (Placeholder) */}
        <div className='bg-[#1F0C3B] p-5 rounded-2xl flex flex-col justify-center items-center text-white text-center shadow-lg border border-[#461F7F]'>
          <p className='text-lg sm:text-xl text-gray-300 mb-2'>Time Spent</p>
          <span className='text-4xl font-bold'>{timeSpent}</span>
        </div>

        {/* Unattempted */}
        <div className='bg-[#1F0C3B] p-5 rounded-2xl flex flex-col justify-center items-center text-white text-center shadow-lg border border-[#461F7F]'>
          <p className='text-lg sm:text-xl text-gray-300 mb-2'>Unattempted</p>
          <span className='text-4xl font-bold text-yellow-400'>{unattemptedCount}</span>
        </div>

        {/* Time/Ques (Placeholder) */}
        <div className='bg-[#1F0C3B] p-5 rounded-2xl flex flex-col justify-center items-center text-white text-center shadow-lg border border-[#461F7F]'>
          <p className='text-lg sm:text-xl text-gray-300 mb-2'>Time/Ques</p>
          <span className='text-4xl font-bold'>{timePerQuestion}</span>
        </div>

        {/* Live Rank (Placeholder) */}
        <div className='bg-[#1F0C3B] p-5 rounded-2xl flex flex-col justify-center items-center text-white text-center shadow-lg border border-[#461F7F] sm:col-span-2'>
          <p className='text-lg sm:text-xl text-gray-300 mb-2'>Live Rank</p>
          <span className='text-4xl font-bold text-purple-400'>4</span> {/* Dummy rank */}
        </div>
      </div>

      {/* Action Buttons */}
      <div className='max-w-2xl mx-auto mt-8 flex flex-col sm:flex-row justify-center gap-4'>
        <button className='bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-800 transition-colors duration-200 shadow-md'>
          Share Score <MdOutlineShare className='text-xl' />
        </button>
        <Link to={"/"} className='bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-800 transition-colors duration-200 shadow-md'>
          Review Questions <RiFileListLine className='text-xl' />
        </Link>
        <button className='bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-800 transition-colors duration-200 shadow-md'>
          Leaderboard <FaCrown className='text-xl' />
        </button>
      </div>

      {/* Removed the detailed question review section from this page as it's typically a separate "Review Questions" page */}
      {/* If you want to integrate it here, let me know. */}
    </div>
  );
}

export default Performance;