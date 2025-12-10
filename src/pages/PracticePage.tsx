import { useState, useEffect } from 'react';
import { Trophy, Loader, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { supabase, IrregularVerb, PhrasalVerb } from '../lib/supabase';

type QuizType = 'irregular' | 'phrasal';
type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
};

export default function PracticePage() {
  const [quizType, setQuizType] = useState<QuizType | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  async function startQuiz(type: QuizType) {
    setLoading(true);
    setQuizType(type);
    setScore(0);
    setCurrentQuestionIndex(0);
    setQuizComplete(false);

    try {
      if (type === 'irregular') {
        await generateIrregularQuiz();
      } else {
        await generatePhrasalQuiz();
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setLoading(false);
    }
  }

  async function generateIrregularQuiz() {
    const { data, error } = await supabase
      .from('irregular_verbs')
      .select('*')
      .limit(100);

    if (error) throw error;

    const verbs = data as IrregularVerb[];
    const shuffled = verbs.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);

    const quizQuestions: QuizQuestion[] = selected.map((verb) => {
      const questionType = Math.random() > 0.5 ? 'past' : 'participle';
      const correctAnswer = questionType === 'past' ? verb.simple_past : verb.past_participle;

      const wrongAnswers = verbs
        .filter((v) => v.id !== verb.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((v) => (questionType === 'past' ? v.simple_past : v.past_participle));

      const options = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());

      return {
        question: `What is the ${questionType === 'past' ? 'simple past' : 'past participle'} of "${verb.base_form}"?`,
        options,
        correctAnswer,
        explanation: `${verb.base_form} → ${verb.simple_past} → ${verb.past_participle}`,
      };
    });

    setQuestions(quizQuestions);
  }

  async function generatePhrasalQuiz() {
    const { data, error } = await supabase
      .from('phrasal_verbs')
      .select('*')
      .limit(100);

    if (error) throw error;

    const verbs = data as PhrasalVerb[];
    const shuffled = verbs.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);

    const quizQuestions: QuizQuestion[] = selected.map((verb) => {
      const wrongAnswers = verbs
        .filter((v) => v.id !== verb.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((v) => v.definition);

      const options = [verb.definition, ...wrongAnswers].sort(() => 0.5 - Math.random());

      return {
        question: `What does "${verb.full_verb}" mean?`,
        options,
        correctAnswer: verb.definition,
        explanation: verb.example || undefined,
      };
    });

    setQuestions(quizQuestions);
  }

  function handleAnswerSelect(answer: string) {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  }

  function handleNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  }

  function restartQuiz() {
    setQuizType(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!quizType) {
    return (
      <div className="space-y-8">
        <header className="text-center space-y-4">
          <Trophy className="mx-auto text-yellow-500" size={64} />
          <h1 className="text-4xl font-bold text-gray-800">Practice Mode</h1>
          <p className="text-lg text-gray-600">
            Test your knowledge with interactive quizzes
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <button
            onClick={() => startQuiz('irregular')}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Irregular Verbs Quiz</h3>
              <p className="text-gray-600">
                Test your knowledge of irregular verb forms
              </p>
              <div className="pt-4">
                <span className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">
                  Start Quiz
                </span>
              </div>
            </div>
          </button>

          <button
            onClick={() => startQuiz('phrasal')}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Phrasal Verbs Quiz</h3>
              <p className="text-gray-600">
                Match phrasal verbs with their meanings
              </p>
              <div className="pt-4">
                <span className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold">
                  Start Quiz
                </span>
              </div>
            </div>
          </button>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 max-w-2xl mx-auto">
          <h3 className="font-bold text-gray-800 mb-2">🎯 Quiz Format</h3>
          <ul className="text-gray-700 space-y-1 text-sm">
            <li>• 10 multiple-choice questions</li>
            <li>• Instant feedback on each answer</li>
            <li>• Track your score as you progress</li>
            <li>• Learn from explanations</li>
          </ul>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPerfect = score === questions.length;
    const isGood = percentage >= 70;

    return (
      <div className="space-y-8 max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-xl p-8 shadow-xl">
          <div className="mb-6">
            {isPerfect ? (
              <div className="text-6xl mb-4">🏆</div>
            ) : isGood ? (
              <div className="text-6xl mb-4">⭐</div>
            ) : (
              <div className="text-6xl mb-4">📚</div>
            )}
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>

          <div className="text-6xl font-bold mb-4">
            <span className="text-blue-600">{score}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{questions.length}</span>
          </div>

          <p className="text-2xl text-gray-600 mb-6">{percentage}% Correct</p>

          {isPerfect && (
            <p className="text-lg text-green-600 font-semibold mb-4">
              Perfect score! You're a verb master! 🎉
            </p>
          )}
          {isGood && !isPerfect && (
            <p className="text-lg text-blue-600 font-semibold mb-4">
              Great job! Keep practicing to reach perfection!
            </p>
          )}
          {!isGood && (
            <p className="text-lg text-orange-600 font-semibold mb-4">
              Keep studying! Practice makes perfect!
            </p>
          )}

          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={() => startQuiz(quizType)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <RotateCcw size={20} />
              Try Again
            </button>
            <button
              onClick={restartQuiz}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="text-lg font-bold text-blue-600">Score: {score}</div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-xl p-8 shadow-xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">{currentQuestion.question}</h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === currentQuestion.correctAnswer;
            let className = 'w-full p-4 text-left rounded-lg border-2 transition-all ';

            if (showResult) {
              if (isCorrectOption) {
                className += 'border-green-500 bg-green-50';
              } else if (isSelected) {
                className += 'border-red-500 bg-red-50';
              } else {
                className += 'border-gray-200 opacity-50';
              }
            } else {
              className += isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
                className={className}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-800">{option}</span>
                  {showResult && isCorrectOption && <CheckCircle className="text-green-500" size={24} />}
                  {showResult && isSelected && !isCorrect && <XCircle className="text-red-500" size={24} />}
                </div>
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-6">
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </p>
              {currentQuestion.explanation && (
                <p className="text-gray-700 mt-2 text-sm">{currentQuestion.explanation}</p>
              )}
            </div>

            <button
              onClick={handleNextQuestion}
              className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
