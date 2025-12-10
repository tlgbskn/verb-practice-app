import { BookOpen, Brain, List, Sparkles, Trophy, TrendingUp, GraduationCap, BarChart3 } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const categories = [
    {
      id: 'irregular',
      title: 'Irregular Verbs',
      description: 'Master 100+ irregular verb forms',
      icon: List,
      color: 'from-blue-500 to-blue-600',
      count: '100+ verbs',
    },
    {
      id: 'phrasal',
      title: 'Phrasal Verbs',
      description: 'Learn essential phrasal verbs',
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      count: '150+ phrases',
    },
    {
      id: 'stative',
      title: 'Stative Verbs',
      description: 'Understand state and action verbs',
      icon: Sparkles,
      color: 'from-purple-500 to-purple-600',
      count: '50+ verbs',
    },
    {
      id: 'patterns',
      title: 'Verb Patterns',
      description: 'Gerunds, infinitives, and more',
      icon: Brain,
      color: 'from-orange-500 to-orange-600',
      count: '100+ patterns',
    },
  ];

  return (
    <div className="space-y-8">
      <header className="text-center space-y-4 py-8">
        <h1 className="text-5xl font-bold text-gray-800">
          Welcome to <span className="text-blue-600">EnglishVerbs</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your comprehensive platform for mastering English verbs through interactive learning and practice
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={() => onNavigate('learn')}
          className="group relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-bl-full transform group-hover:scale-110 transition-transform duration-300" />

          <div className="relative z-10">
            <div className="inline-flex p-4 rounded-xl bg-white bg-opacity-20 mb-4">
              <GraduationCap size={36} className="text-white" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-3">Learn Mode</h2>
            <p className="text-green-100 mb-4 text-lg">
              Flashcard-style learning with spaced repetition. Mark verbs as known or learning and review them at optimal intervals.
            </p>

            <div className="flex items-center gap-2 text-white font-semibold group-hover:translate-x-2 transition-transform duration-300">
              <span className="text-lg">Start Learning</span>
              <span className="text-2xl">→</span>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('dashboard')}
          className="group relative bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-bl-full transform group-hover:scale-110 transition-transform duration-300" />

          <div className="relative z-10">
            <div className="inline-flex p-4 rounded-xl bg-white bg-opacity-20 mb-4">
              <BarChart3 size={36} className="text-white" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-3">Dashboard</h2>
            <p className="text-purple-100 mb-4 text-lg">
              Track your progress, view statistics, and see which verbs need review. Monitor your learning journey.
            </p>

            <div className="flex items-center gap-2 text-white font-semibold group-hover:translate-x-2 transition-transform duration-300">
              <span className="text-lg">View Progress</span>
              <span className="text-2xl">→</span>
            </div>
          </div>
        </button>
      </div>

      <div className="border-t border-gray-200 pt-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Browse by Category</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => onNavigate(category.id)}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden text-left"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${category.color} opacity-10 rounded-bl-full transform group-hover:scale-110 transition-transform duration-300`} />

              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${category.color} text-white mb-4`}>
                  <Icon size={28} />
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500">{category.count}</span>
                  <span className="text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Start Learning →
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <Trophy size={48} className="opacity-90" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Ready to Practice?</h2>
            <p className="text-blue-100 mb-4">
              Test your knowledge with interactive quizzes and exercises designed to reinforce your learning
            </p>
            <button
              onClick={() => onNavigate('practice')}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Start Practicing
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen size={24} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-800">Comprehensive</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Complete coverage of all essential English verb types and patterns
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Brain size={24} className="text-green-600" />
            </div>
            <h3 className="font-bold text-gray-800">Interactive</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Engaging exercises and quizzes to reinforce your learning
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-800">Progressive</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Track your progress and build confidence step by step
          </p>
        </div>
      </div>
    </div>
  );
}
