import { useState, useEffect } from 'react';
import { Star, BookOpen, Trash2, Heart, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FavoriteVerb {
  id: string;
  displayText: string;
  turkish: string;
  category: string;
  type: string;
  details?: {
    past?: string;
    pastParticiple?: string;
    definition?: string;
    patternType?: string;
  };
  example?: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteVerbs, setFavoriteVerbs] = useState<FavoriteVerb[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    setLoading(true);
    const saved = localStorage.getItem('favorite-verbs');
    if (!saved) {
      setLoading(false);
      return;
    }

    try {
      const favoriteIds = JSON.parse(saved);
      setFavorites(favoriteIds);

      const verbs: FavoriteVerb[] = [];

      const irregularIds = favoriteIds
        .filter((id: string) => id.startsWith('irregular-'))
        .map((id: string) => id.replace('irregular-', ''));

      const phrasalIds = favoriteIds
        .filter((id: string) => id.startsWith('phrasal-'))
        .map((id: string) => id.replace('phrasal-', ''));

      const stativeIds = favoriteIds
        .filter((id: string) => id.startsWith('stative-'))
        .map((id: string) => id.replace('stative-', ''));

      const patternIds = favoriteIds
        .filter((id: string) => id.startsWith('pattern-'))
        .map((id: string) => id.replace('pattern-', ''));

      const promises = [];

      if (irregularIds.length > 0) {
        promises.push(
          supabase
            .from('irregular_verbs')
            .select('*')
            .in('id', irregularIds)
            .then(res => {
              if (res.data) {
                res.data.forEach(verb => {
                  verbs.push({
                    id: `irregular-${verb.id}`,
                    displayText: verb.base_form,
                    turkish: verb.turkish || 'No Turkish meaning',
                    category: 'Irregular Verbs',
                    type: 'irregular',
                    details: {
                      past: verb.simple_past,
                      pastParticiple: verb.past_participle,
                    },
                    example: verb.example,
                  });
                });
              }
            })
        );
      }

      if (phrasalIds.length > 0) {
        promises.push(
          supabase
            .from('phrasal_verbs')
            .select('*')
            .in('id', phrasalIds)
            .then(res => {
              if (res.data) {
                res.data.forEach(verb => {
                  verbs.push({
                    id: `phrasal-${verb.id}`,
                    displayText: verb.full_verb,
                    turkish: verb.turkish || verb.definition || 'No Turkish meaning',
                    category: 'Phrasal Verbs',
                    type: 'phrasal',
                    details: {
                      definition: verb.definition,
                    },
                    example: verb.example,
                  });
                });
              }
            })
        );
      }

      if (stativeIds.length > 0) {
        promises.push(
          supabase
            .from('stative_verbs')
            .select('*')
            .in('id', stativeIds)
            .then(res => {
              if (res.data) {
                res.data.forEach(verb => {
                  verbs.push({
                    id: `stative-${verb.id}`,
                    displayText: verb.verb,
                    turkish: verb.turkish || 'No Turkish meaning',
                    category: 'Stative Verbs',
                    type: 'stative',
                    example: verb.example,
                  });
                });
              }
            })
        );
      }

      if (patternIds.length > 0) {
        promises.push(
          supabase
            .from('verb_patterns')
            .select('*')
            .in('id', patternIds)
            .then(res => {
              if (res.data) {
                res.data.forEach(verb => {
                  verbs.push({
                    id: `pattern-${verb.id}`,
                    displayText: verb.verb,
                    turkish: verb.turkish || 'No Turkish meaning',
                    category: 'Verb Patterns',
                    type: 'pattern',
                    details: {
                      patternType: verb.pattern_type,
                    },
                    example: verb.example,
                  });
                });
              }
            })
        );
      }

      await Promise.all(promises);
      setFavoriteVerbs(verbs);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }

  function removeFavorite(verbId: string) {
    const newFavorites = favorites.filter(id => id !== verbId);
    setFavorites(newFavorites);
    setFavoriteVerbs(favoriteVerbs.filter(v => v.id !== verbId));
    localStorage.setItem('favorite-verbs', JSON.stringify(newFavorites));
  }

  function clearAllFavorites() {
    if (confirm('Are you sure you want to clear all favorites?')) {
      setFavorites([]);
      setFavoriteVerbs([]);
      localStorage.setItem('favorite-verbs', JSON.stringify([]));
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Star size={32} className="fill-white" />
              <h1 className="text-3xl font-bold">My Favorites</h1>
            </div>
            <p className="text-yellow-100 text-lg">
              {loading ? 'Loading...' : `${favoriteVerbs.length} verbs saved for quick access`}
            </p>
          </div>
          {favoriteVerbs.length > 0 && (
            <button
              onClick={clearAllFavorites}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all flex items-center gap-2"
            >
              <Trash2 size={18} />
              Clear All
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Loader2 size={48} className="mx-auto text-yellow-600 animate-spin mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading favorites...</h3>
          <p className="text-gray-600">Please wait</p>
        </div>
      ) : favoriteVerbs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">No favorites yet</h3>
          <p className="text-gray-600 mb-6">
            Start adding verbs to your favorites from the Search page
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
            <Star size={18} className="fill-yellow-600 text-yellow-600" />
            <span className="text-sm font-medium">Tap the star icon to add favorites</span>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {favoriteVerbs.map(verb => (
            <div
              key={verb.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-2xl font-bold text-gray-800">{verb.displayText}</h3>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      {verb.category}
                    </span>
                  </div>
                  <p className="text-lg text-gray-600">{verb.turkish}</p>
                </div>

                <button
                  onClick={() => removeFavorite(verb.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-500"
                  title="Remove from favorites"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {verb.details && (
                <div className="mb-4">
                  {(verb.details.past || verb.details.pastParticiple) && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 block mb-1">Base</span>
                          <span className="font-semibold">{verb.displayText}</span>
                        </div>
                        {verb.details.past && (
                          <div>
                            <span className="text-gray-600 block mb-1">Past</span>
                            <span className="font-semibold">{verb.details.past}</span>
                          </div>
                        )}
                        {verb.details.pastParticiple && (
                          <div>
                            <span className="text-gray-600 block mb-1">Past Participle</span>
                            <span className="font-semibold">{verb.details.pastParticiple}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {verb.details.patternType && (
                    <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium mt-2">
                      Pattern: {verb.details.patternType.replace(/_/g, ' ')}
                    </div>
                  )}
                </div>
              )}

              {verb.example && (
                <div className="space-y-2 mt-3">
                  <h4 className="text-sm font-semibold text-gray-700">Example:</h4>
                  <div className="flex items-start gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span className="italic">{verb.example}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
        <div className="flex items-start gap-4">
          <BookOpen className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Pro Tip</h3>
            <p className="text-gray-600 text-sm">
              Use favorites to create your personal study list. Focus on verbs you find challenging or use frequently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
