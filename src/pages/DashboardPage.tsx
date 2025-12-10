import { useEffect, useState } from 'react';
import { TrendingUp, Target, Flame, Award, BookOpen, Brain } from 'lucide-react';
import { getStatistics, getVerbsDueForReview } from '../lib/progress';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalVerbs: 0,
    newCount: 0,
    learningCount: 0,
    masteredCount: 0,
    dueForReview: 0,
    accuracy: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
  });

  useEffect(() => {
    loadStats();

    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  function loadStats() {
    const statistics = getStatistics();
    setStats(statistics);
  }

  const progressPercentage = stats.totalVerbs > 0
    ? Math.round((stats.masteredCount / stats.totalVerbs) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">Your Progress</h1>
        <p className="text-lg text-gray-600">Track your learning journey</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <BookOpen size={28} />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.totalVerbs}</div>
              <div className="text-blue-100 text-sm">Total Studied</div>
            </div>
          </div>
          <div className="text-blue-100 text-sm">Verbs you've practiced</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Award size={28} />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.masteredCount}</div>
              <div className="text-green-100 text-sm">Mastered</div>
            </div>
          </div>
          <div className="text-green-100 text-sm">You know these well!</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Brain size={28} />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.learningCount}</div>
              <div className="text-orange-100 text-sm">Learning</div>
            </div>
          </div>
          <div className="text-orange-100 text-sm">Keep practicing!</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Target size={28} />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.accuracy}%</div>
              <div className="text-purple-100 text-sm">Accuracy</div>
            </div>
          </div>
          <div className="text-purple-100 text-sm">Your success rate</div>
        </div>
      </div>

      {stats.dueForReview > 0 && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Flame size={48} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-1">{stats.dueForReview} verbs ready to review!</h3>
              <p className="text-yellow-100">These verbs need your attention. Review them now to keep your streak!</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={24} />
            Learning Progress
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span className="font-semibold">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.newCount}</div>
                <div className="text-xs text-gray-600">New</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.learningCount}</div>
                <div className="text-xs text-gray-600">Learning</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.masteredCount}</div>
                <div className="text-xs text-gray-600">Mastered</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="text-green-600" size={24} />
            Performance Stats
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Correct Answers</div>
                <div className="text-2xl font-bold text-green-600">{stats.totalCorrect}</div>
              </div>
              <div className="text-4xl">✓</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Incorrect Answers</div>
                <div className="text-2xl font-bold text-red-600">{stats.totalIncorrect}</div>
              </div>
              <div className="text-4xl">✗</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Total Attempts</div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalCorrect + stats.totalIncorrect}
                </div>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
        </div>
      </div>

      {stats.totalVerbs === 0 && (
        <div className="bg-blue-50 rounded-xl p-8 text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Start Your Learning Journey!</h3>
          <p className="text-gray-600 mb-4">
            Head to Learn Mode to start practicing verbs and track your progress here.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="text-3xl mb-2">🎯</div>
          <h4 className="font-bold text-gray-800 mb-1">Daily Goal</h4>
          <p className="text-sm text-gray-600">Practice at least 10 verbs every day to build consistency</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="text-3xl mb-2">🔥</div>
          <h4 className="font-bold text-gray-800 mb-1">Stay Consistent</h4>
          <p className="text-sm text-gray-600">Regular practice leads to better retention and mastery</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="text-3xl mb-2">⭐</div>
          <h4 className="font-bold text-gray-800 mb-1">Spaced Repetition</h4>
          <p className="text-sm text-gray-600">Review verbs at optimal intervals for long-term memory</p>
        </div>
      </div>
    </div>
  );
}
