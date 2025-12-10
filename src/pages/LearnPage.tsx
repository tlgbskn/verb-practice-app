import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, X, RotateCcw, Loader, Sparkles } from 'lucide-react';
import { supabase, IrregularVerb, PhrasalVerb } from '../lib/supabase';
import { updateVerbProgress, getVerbProgress, markVerbAsKnown } from '../lib/progress';

type VerbItem = {
  id: string;
  type: 'irregular' | 'phrasal';
  front: string;
  back: string;
  example?: string;
  details?: string;
};

export default function LearnPage() {
  const [verbs, setVerbs] = useState<VerbItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'all' | 'irregular' | 'phrasal'>('all');
  const [showResult, setShowResult] = useState(false);
  const [resultType, setResultType] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    loadVerbs();
  }, [selectedType]);

  async function loadVerbs() {
    setLoading(true);
    try {
      const items: VerbItem[] = [];

      if (selectedType === 'all' || selectedType === 'irregular') {
        const { data: irregularData } = await supabase
          .from('irregular_verbs')
          .select('*')
          .limit(50);

        if (irregularData) {
          irregularData.forEach((verb: IrregularVerb) => {
            items.push({
              id: verb.id,
              type: 'irregular',
              front: verb.base_form,
              back: `Past: ${verb.simple_past}\nPast Participle: ${verb.past_participle}`,
              details: `${verb.base_form} → ${verb.simple_past} → ${verb.past_participle}`,
            });
          });
        }
      }

      if (selectedType === 'all' || selectedType === 'phrasal') {
        const { data: phrasalData } = await supabase
          .from('phrasal_verbs')
          .select('*')
          .limit(50);

        if (phrasalData) {
          phrasalData.forEach((verb: PhrasalVerb) => {
            items.push({
              id: verb.id,
              type: 'phrasal',
              front: verb.full_verb,
              back: verb.definition,
              example: verb.example || undefined,
            });
          });
        }
      }

      const shuffled = items.sort(() => Math.random() - 0.5);
      setVerbs(shuffled);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error('Error loading verbs:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleFlip() {
    setIsFlipped(!isFlipped);
  }

  function handleKnow() {
    if (!isFlipped) {
      setIsFlipped(true);
      return;
    }

    const currentVerb = verbs[currentIndex];
    updateVerbProgress(currentVerb.id, currentVerb.type, true);

    setShowResult(true);
    setResultType('correct');

    setTimeout(() => {
      moveToNext();
    }, 800);
  }

  function handleDontKnow() {
    if (!isFlipped) {
      setIsFlipped(true);
      return;
    }

    const currentVerb = verbs[currentIndex];
    updateVerbProgress(currentVerb.id, currentVerb.type, false);

    setShowResult(true);
    setResultType('incorrect');

    setTimeout(() => {
      moveToNext();
    }, 800);
  }

  function handleMarkAsKnown() {
    const currentVerb = verbs[currentIndex];
    markVerbAsKnown(currentVerb.id, currentVerb.type);
    moveToNext();
  }

  function moveToNext() {
    setShowResult(false);
    setResultType(null);
    setIsFlipped(false);

    if (currentIndex < verbs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      loadVerbs();
    }
  }

  function moveToPrevious() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowResult(false);
      setResultType(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (verbs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No verbs available for learning.</p>
        <button
          onClick={loadVerbs}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Reload Verbs
        </button>
      </div>
    );
  }

  const currentVerb = verbs[currentIndex];
  const progress = getVerbProgress(currentVerb.id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Learn Mode</h1>
          <p className="text-gray-600 mt-1">
            Card {currentIndex + 1} of {verbs.length}
          </p>
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">All Verbs</option>
          <option value="irregular">Irregular Only</option>
          <option value="phrasal">Phrasal Only</option>
        </select>
      </header>

      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / verbs.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="relative min-h-[400px] perspective-1000">
        <div
          onClick={handleFlip}
          className={`relative w-full min-h-[400px] cursor-pointer transition-all duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          <div
            className={`absolute inset-0 backface-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center text-white ${
              showResult && resultType === 'correct' ? 'ring-4 ring-green-400' : ''
            } ${showResult && resultType === 'incorrect' ? 'ring-4 ring-red-400' : ''}`}
          >
            <div className="text-center space-y-6">
              <div className="inline-flex px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-semibold">
                {currentVerb.type === 'irregular' ? 'Irregular Verb' : 'Phrasal Verb'}
              </div>

              <h2 className="text-5xl font-bold">{currentVerb.front}</h2>

              <p className="text-blue-100 text-lg">Tap to see answer</p>

              {progress && (
                <div className="flex gap-4 justify-center text-sm">
                  <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    ✓ {progress.correctCount}
                  </div>
                  <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    ✗ {progress.incorrectCount}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center text-white rotate-y-180"
          >
            <div className="text-center space-y-6">
              <div className="inline-flex px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-semibold">
                Answer
              </div>

              <h2 className="text-3xl font-bold whitespace-pre-line">{currentVerb.back}</h2>

              {currentVerb.details && (
                <p className="text-purple-100 text-lg">{currentVerb.details}</p>
              )}

              {currentVerb.example && (
                <div className="bg-white bg-opacity-20 rounded-lg p-4 max-w-md">
                  <p className="text-sm italic">"{currentVerb.example}"</p>
                </div>
              )}

              <p className="text-purple-100 text-sm">Did you know this?</p>
            </div>
          </div>
        </div>

        {showResult && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`text-6xl animate-bounce ${
                resultType === 'correct' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {resultType === 'correct' ? '✓' : '✗'}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleDontKnow}
          disabled={showResult}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed"
        >
          <X size={24} />
          Don't Know
        </button>

        <button
          onClick={handleKnow}
          disabled={showResult}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed"
        >
          <Check size={24} />
          I Know
        </button>
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          onClick={moveToPrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
          Previous
        </button>

        <button
          onClick={handleMarkAsKnown}
          className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-800 font-semibold"
        >
          <Sparkles size={20} />
          Already Know This
        </button>

        <button
          onClick={loadVerbs}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          <RotateCcw size={20} />
          New Set
        </button>
      </div>

      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-800 mb-2">💡 How It Works</h3>
        <ul className="text-gray-700 space-y-1 text-sm">
          <li>• Tap the card to flip and see the answer</li>
          <li>• Mark "I Know" if you knew the answer</li>
          <li>• Mark "Don't Know" if you need more practice</li>
          <li>• Verbs you know well will appear less frequently</li>
          <li>• Keep practicing to master all verbs!</li>
        </ul>
      </div>
    </div>
  );
}
