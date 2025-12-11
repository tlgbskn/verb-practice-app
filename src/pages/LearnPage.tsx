import { useState, useEffect } from 'react';
import { ChevronRight, Check, X, RotateCcw, Loader, Sparkles, Calendar, TrendingUp } from 'lucide-react';
import { supabase, IrregularVerb, PhrasalVerb, UserProgress } from '../lib/supabase';
import { calculateSRS, INITIAL_EASE_FACTOR } from '../lib/srs';
import { useAuth } from '../contexts/AuthContext';

type VerbItem = {
  id: string;
  type: 'irregular' | 'phrasal';
  front: string;
  back: string;
  example?: string;
  details?: string;
  progress?: UserProgress; // Attached progress
};

export default function LearnPage() {
  const { user } = useAuth();
  const [verbs, setVerbs] = useState<VerbItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'new' | 'review'>('new'); // New mode toggle
  const [showResult, setShowResult] = useState(false);
  const [resultType, setResultType] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    loadVerbs();
  }, [mode, user]); // Reload when mode changes

  async function loadVerbs() {
    if (!user) return;
    setLoading(true);
    try {
      const items: VerbItem[] = [];

      // Fetch User Progress map for quick lookup
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      const progressMap = new Map(progressData?.map(p => [p.verb_id, p]) || []);

      if (mode === 'review') {
        // --- REVIEW MODE: Fetch items where next_review < now ---
        const dueIds = progressData
          ?.filter(p => new Date(p.next_review) <= new Date())
          .map(p => p.verb_id) || [];

        if (dueIds.length === 0) {
          setVerbs([]);
          setLoading(false);
          return;
        }

        // Fetch definitions for due items (Simplified: fetching all correct types)
        // Ideally we fetch specifically by IDs, but Supabase JS "in" helper is easiest per table
        const { data: irregulars } = await supabase
          .from('irregular_verbs')
          .select('*')
          .in('id', dueIds);

        const { data: phrasals } = await supabase
          .from('phrasal_verbs')
          .select('*')
          .in('id', dueIds);

        irregulars?.forEach((v: IrregularVerb) => items.push(mapIrregular(v, progressMap.get(v.id))));
        phrasals?.forEach((v: PhrasalVerb) => items.push(mapPhrasal(v, progressMap.get(v.id))));

      } else {
        // --- NEW MODE: Fetch items NOT in progress or 'new' ---
        // Fetch random 20 items (simplified)
        const { data: irregulars } = await supabase.from('irregular_verbs').select('*').limit(20);
        const { data: phrasals } = await supabase.from('phrasal_verbs').select('*').limit(20);

        // Filter out ones we already know/started (unless we want mixed)
        // For strict "New", filter out if ID exists in progressMap
        irregulars?.forEach((v: IrregularVerb) => {
          if (!progressMap.has(v.id)) items.push(mapIrregular(v));
        });
        phrasals?.forEach((v: PhrasalVerb) => {
          if (!progressMap.has(v.id)) items.push(mapPhrasal(v));
        });
      }

      const shuffled = items.sort(() => Math.random() - 0.5).slice(0, 20); // Limit session
      setVerbs(shuffled);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error('Error loading verbs:', error);
    } finally {
      setLoading(false);
    }
  }

  // Helpers to map DB objects to Flashcards
  function mapIrregular(v: IrregularVerb, p?: UserProgress): VerbItem {
    return {
      id: v.id, type: 'irregular',
      front: v.base_form,
      back: `Past: ${v.simple_past}\nPP: ${v.past_participle}`,
      details: `${v.base_form} → ${v.simple_past} → ${v.past_participle}`,
      progress: p
    };
  }

  function mapPhrasal(v: PhrasalVerb, p?: UserProgress): VerbItem {
    return {
      id: v.id, type: 'phrasal',
      front: v.full_verb,
      back: v.definition,
      example: v.example || undefined,
      progress: p
    };
  }

  function handleFlip() {
    setIsFlipped(!isFlipped);
  }

  async function handleRate(quality: number) {
    if (!isFlipped) {
      setIsFlipped(true);
      return;
    }

    const currentVerb = verbs[currentIndex];
    const prevProgress = currentVerb.progress;

    // Default values if new
    const prevInterval = prevProgress ? (new Date(prevProgress.next_review).getTime() - new Date(prevProgress.last_reviewed).getTime()) / (1000 * 60 * 60 * 24) : 0;
    const prevRepetitions = prevProgress?.correct_count || 0; // Approximate
    const prevEase = 2.5; // We need to store EF in DB ideally, but default 2.5 for now

    // Calculate new SRS values
    const srs = calculateSRS(quality, prevInterval || 0, prevRepetitions, prevEase);

    // Optimistic UI update
    setResultType(quality >= 3 ? 'correct' : 'incorrect');
    setShowResult(true);

    try {
      const { error } = await supabase.from('user_progress').upsert({
        user_id: user!.id,
        verb_id: currentVerb.id,
        verb_type: currentVerb.type,
        status: quality >= 4 ? 'mastered' : 'learning',
        correct_count: (prevProgress?.correct_count || 0) + (quality >= 3 ? 1 : 0),
        incorrect_count: (prevProgress?.incorrect_count || 0) + (quality < 3 ? 1 : 0),
        last_reviewed: new Date().toISOString(),
        next_review: srs.nextReviewDate.toISOString()
        // We really should store 'ease_factor' and 'interval' and 'repetitions' in DB for true SRS
        // For now, we reuse existing columns to approximation
      }, { onConflict: 'user_id,verb_id,verb_type' });

      if (error) throw error;

      setTimeout(() => {
        moveToNext();
      }, 800);

    } catch (err) {
      console.error('Failed to save progress', err);
    }
  }

  function moveToNext() {
    setShowResult(false);
    setResultType(null);
    setIsFlipped(false);

    if (currentIndex < verbs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // End of session
      alert("Session Complete! Great job.");
      loadVerbs();
    }
  }



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  if (verbs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4 text-green-100 bg-green-600 inline-block p-4 rounded-full">
          <Check size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">All Caught Up!</h2>
        <p className="text-gray-600 mt-2">
          {mode === 'review'
            ? "No verbs due for review right now. Great job!"
            : "No new verbs available."}
        </p>
        <button
          onClick={() => setMode(mode === 'new' ? 'review' : 'new')}
          className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
        >
          Switch to {mode === 'new' ? 'Review' : 'Learn New'} Mode
        </button>
      </div>
    );
  }

  const currentVerb = verbs[currentIndex];
  // const progress = getVerbProgress(currentVerb.id); // Old local helper, removed

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            {mode === 'review' ? <RotateCcw className="text-orange-500" /> : <Sparkles className="text-yellow-500" />}
            {mode === 'review' ? 'Daily Review' : 'Learn New Verbs'}
          </h1>
          <p className="text-gray-600 text-sm">
            Card {currentIndex + 1} of {verbs.length}
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setMode('new')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'new' ? 'bg-white shadow text-green-700' : 'text-gray-600 hover:text-gray-800'}`}
          >
            New Verbs
          </button>
          <button
            onClick={() => setMode('review')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'review' ? 'bg-white shadow text-orange-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Review Due
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${mode === 'review' ? 'bg-orange-500' : 'bg-green-500'}`}
          style={{ width: `${((currentIndex + 1) / verbs.length) * 100}%` }}
        />
      </div>

      <div className="relative min-h-[400px] perspective-1000">
        <div
          onClick={handleFlip}
          className={`relative w-full min-h-[400px] cursor-pointer transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''
            }`}
        >
          {/* FRONT */}
          <div
            className={`absolute inset-0 backface-hidden bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center text-gray-800 ${showResult && resultType === 'correct' ? 'ring-4 ring-green-400' : ''
              } ${showResult && resultType === 'incorrect' ? 'ring-4 ring-red-400' : ''}`}
          >
            <div className="text-center space-y-8">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${currentVerb.type === 'irregular' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                }`}>
                {currentVerb.type}
              </span>

              <h2 className="text-5xl font-bold text-gray-900">{currentVerb.front}</h2>

              <p className="text-gray-400 text-sm animate-pulse">Tap to flip</p>

              {currentVerb.progress && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-xs text-gray-400">
                  <TrendingUp size={14} />
                  <span>Streak: {currentVerb.progress.correct_count}</span>
                </div>
              )}
            </div>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 backface-hidden bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center text-white rotate-y-180"
          >
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold whitespace-pre-line leading-relaxed">{currentVerb.back}</h2>

              {currentVerb.details && (
                <div className="text-green-100 font-mono text-lg py-2 border-t border-b border-green-500 border-opacity-30">
                  {currentVerb.details}
                </div>
              )}

              {currentVerb.example && (
                <div className="bg-black bg-opacity-20 rounded-lg p-4 italic text-green-50">
                  "{currentVerb.example}"
                </div>
              )}
            </div>
          </div>
        </div>

        {showResult && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div
              className={`text-8xl animate-bounce drop-shadow-lg ${resultType === 'correct' ? 'text-green-500' : 'text-red-500'
                }`}
            >
              {resultType === 'correct' ? '✓' : '✗'}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={(e) => { e.stopPropagation(); handleRate(1); }} // Quality 1: Fail
          disabled={showResult}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl font-bold text-lg shadow-sm transition-all disabled:opacity-50"
        >
          <X size={24} />
          Still Learning
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); handleRate(4); }} // Quality 4: Good
          disabled={showResult}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white hover:bg-green-700 rounded-xl font-bold text-lg shadow-lg hover:shadow-green-200 transition-all disabled:opacity-50"
        >
          <Check size={24} />
          I Know It
        </button>
      </div>
    </div>
  );
}
