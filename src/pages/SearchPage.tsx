import { useState, useEffect, useMemo } from 'react';
import { Search, BookOpen, Star, StarOff, Filter, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SearchResult {
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

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'Irregular Verbs', 'Phrasal Verbs', 'Stative Verbs', 'Verb Patterns'];

  useEffect(() => {
    loadAllVerbs();
    loadFavorites();
  }, []);

  function loadFavorites() {
    const saved = localStorage.getItem('favorite-verbs');
    if (saved) {
      try {
        setFavorites(new Set(JSON.parse(saved)));
      } catch {
        setFavorites(new Set());
      }
    }
  }

  async function loadAllVerbs() {
    setLoading(true);
    try {
      const results: SearchResult[] = [];

      const [irregularRes, phrasalRes, stativeRes, patternsRes] = await Promise.all([
        supabase.from('irregular_verbs').select('*'),
        supabase.from('phrasal_verbs').select('*'),
        supabase.from('stative_verbs').select('*'),
        supabase.from('verb_patterns').select('*'),
      ]);

      if (irregularRes.data) {
        irregularRes.data.forEach(verb => {
          results.push({
            id: `irregular-${verb.id}`,
            displayText: verb.base_form,
            turkish: verb.turkish || 'Türkçe anlamı yok',
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

      if (phrasalRes.data) {
        phrasalRes.data.forEach(verb => {
          results.push({
            id: `phrasal-${verb.id}`,
            displayText: verb.full_verb,
            turkish: verb.turkish || verb.definition || 'Türkçe anlamı yok',
            category: 'Phrasal Verbs',
            type: 'phrasal',
            details: {
              definition: verb.definition,
            },
            example: verb.example,
          });
        });
      }

      if (stativeRes.data) {
        stativeRes.data.forEach(verb => {
          results.push({
            id: `stative-${verb.id}`,
            displayText: verb.verb,
            turkish: verb.turkish || 'Türkçe anlamı yok',
            category: 'Stative Verbs',
            type: 'stative',
            example: verb.example,
          });
        });
      }

      if (patternsRes.data) {
        patternsRes.data.forEach(verb => {
          results.push({
            id: `pattern-${verb.id}`,
            displayText: verb.verb,
            turkish: verb.turkish || 'Türkçe anlamı yok',
            category: 'Verb Patterns',
            type: 'pattern',
            details: {
              patternType: verb.pattern_type,
            },
            example: verb.example,
          });
        });
      }

      setAllResults(results);
    } catch (error) {
      console.error('Error loading verbs:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredResults = useMemo(() => {
    let results = allResults;

    if (selectedCategory !== 'all') {
      results = results.filter(item => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(item => {
        const searchIn = [
          item.displayText,
          item.turkish,
          item.details?.past,
          item.details?.pastParticiple,
          item.details?.definition,
          item.example,
        ].filter(Boolean).join(' ').toLowerCase();

        return searchIn.includes(query);
      });
    }

    return results;
  }, [allResults, searchQuery, selectedCategory]);

  function toggleFavorite(verbId: string) {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(verbId)) {
        newFavorites.delete(verbId);
      } else {
        newFavorites.add(verbId);
      }
      localStorage.setItem('favorite-verbs', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Search size={32} />
          <h1 className="text-3xl font-bold">Search Verbs</h1>
        </div>
        <p className="text-green-100 text-lg">
          Search across all verb types in English or Turkish
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
          <input
            type="search"
            inputMode="search"
            placeholder="Type to search verbs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white transition-all text-base md:text-lg touch-manipulation"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2 touch-manipulation"
            >
              <X size={22} />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors touch-manipulation"
          >
            <Filter size={20} />
            <span className="font-medium">Filters</span>
          </button>

          <div className="text-sm text-gray-600">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                <span>Loading...</span>
              </div>
            ) : (
              <>
                <span className="font-semibold">{filteredResults.length}</span> of{' '}
                <span className="font-semibold">{allResults.length}</span> verbs
              </>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-3 rounded-lg font-medium transition-all touch-manipulation ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Loader2 size={48} className="mx-auto text-green-600 animate-spin mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading verbs...</h3>
          <p className="text-gray-600">Please wait</p>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No results found</h3>
          <p className="text-gray-600">
            {searchQuery
              ? `No verbs match "${searchQuery}". Try a different search term.`
              : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredResults.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-2xl font-bold text-gray-800">{item.displayText}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-lg text-gray-600 mb-2">{item.turkish}</p>
                </div>

                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="p-3 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 touch-manipulation"
                >
                  {favorites.has(item.id) ? (
                    <Star size={28} className="fill-yellow-400 text-yellow-400" />
                  ) : (
                    <StarOff size={28} className="text-gray-400" />
                  )}
                </button>
              </div>

              {item.details && (
                <div className="mb-4">
                  {(item.details.past || item.details.pastParticiple) && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 block mb-1">Base</span>
                          <span className="font-semibold">{item.displayText}</span>
                        </div>
                        {item.details.past && (
                          <div>
                            <span className="text-gray-600 block mb-1">Past</span>
                            <span className="font-semibold">{item.details.past}</span>
                          </div>
                        )}
                        {item.details.pastParticiple && (
                          <div>
                            <span className="text-gray-600 block mb-1">Past Participle</span>
                            <span className="font-semibold">{item.details.pastParticiple}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {item.details.patternType && (
                    <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium mt-2">
                      Pattern: {item.details.patternType.replace(/_/g, ' ')}
                    </div>
                  )}
                </div>
              )}

              {item.example && (
                <div className="space-y-2 mt-3">
                  <h4 className="text-sm font-semibold text-gray-700">Example:</h4>
                  <div className="flex items-start gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="italic">{item.example}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
