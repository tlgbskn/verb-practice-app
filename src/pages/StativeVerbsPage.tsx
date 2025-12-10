import { useEffect, useState } from 'react';
import { Search, Loader } from 'lucide-react';
import { supabase, StativeVerb } from '../lib/supabase';

export default function StativeVerbsPage() {
  const [verbs, setVerbs] = useState<StativeVerb[]>([]);
  const [filteredVerbs, setFilteredVerbs] = useState<StativeVerb[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVerbs();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = verbs.filter((verb) =>
        verb.verb.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVerbs(filtered);
    } else {
      setFilteredVerbs(verbs);
    }
  }, [searchTerm, verbs]);

  async function fetchVerbs() {
    try {
      const { data, error } = await supabase
        .from('stative_verbs')
        .select('*')
        .order('verb');

      if (error) throw error;
      setVerbs(data || []);
      setFilteredVerbs(data || []);
    } catch (error) {
      console.error('Error fetching verbs:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">Stative Verbs</h1>
        <p className="text-lg text-gray-600">
          Learn {verbs.length} stative verbs that describe states rather than actions
        </p>
      </header>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
        <h3 className="font-bold text-gray-800 mb-2">⚠️ Important Rule</h3>
        <p className="text-gray-700">
          Stative verbs describe states, not actions, and are typically NOT used in continuous forms.
          For example: "I <strong>know</strong> the answer" (correct) vs. "I am knowing the answer" (incorrect)
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search stative verbs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVerbs.map((verb) => (
          <div
            key={verb.id}
            className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">{verb.verb}</h3>
            {verb.example && (
              <p className="text-gray-600 text-sm italic">
                "{verb.example}"
              </p>
            )}
          </div>
        ))}
      </div>

      {filteredVerbs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No stative verbs found matching "{searchTerm}"</p>
        </div>
      )}

      <div className="bg-purple-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-800 mb-3">Common Categories of Stative Verbs</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Emotions & Feelings:</h4>
            <p className="text-gray-600">like, love, hate, prefer, fear, care</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Mental States:</h4>
            <p className="text-gray-600">know, believe, understand, remember, forget</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Senses:</h4>
            <p className="text-gray-600">see, hear, smell, taste, feel</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Possession & Existence:</h4>
            <p className="text-gray-600">have, own, belong, possess, exist</p>
          </div>
        </div>
      </div>
    </div>
  );
}
