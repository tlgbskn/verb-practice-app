import { useEffect, useState } from 'react';
import { Search, Loader } from 'lucide-react';
import { supabase, IrregularVerb } from '../lib/supabase';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';
import ErrorMessage from '../components/ErrorMessage';

export default function IrregularVerbsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVerbs, setFilteredVerbs] = useState<IrregularVerb[]>([]);

  const fetchVerbs = async () => {
    return await supabase
      .from('irregular_verbs')
      .select('*')
      .order('base_form');
  };

  const { data: verbs, error, loading, refetch } = useSupabaseQuery<IrregularVerb[]>(fetchVerbs);

  useEffect(() => {
    if (verbs) {
      if (searchTerm) {
        const filtered = verbs.filter(
          (verb) =>
            verb.base_form.toLowerCase().includes(searchTerm.toLowerCase()) ||
            verb.simple_past.toLowerCase().includes(searchTerm.toLowerCase()) ||
            verb.past_participle.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredVerbs(filtered);
      } else {
        setFilteredVerbs(verbs);
      }
    }
  }, [searchTerm, verbs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorMessage
          message="Failed to load irregular verbs. Please check your connection and try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">Irregular Verbs</h1>
        <p className="text-lg text-gray-600">
          Master {verbs?.length || 0} essential irregular verbs with their forms
        </p>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search verbs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Base Form</th>
                <th className="px-6 py-4 text-left font-semibold">Simple Past</th>
                <th className="px-6 py-4 text-left font-semibold">Past Participle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVerbs.map((verb, index) => (
                <tr
                  key={verb.id}
                  className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                >
                  <td className="px-6 py-4 font-semibold text-gray-800">{verb.base_form}</td>
                  <td className="px-6 py-4 text-gray-700">{verb.simple_past}</td>
                  <td className="px-6 py-4 text-gray-700">{verb.past_participle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredVerbs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No verbs found matching "{searchTerm}"</p>
        </div>
      )}

      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-800 mb-2">💡 Study Tip</h3>
        <p className="text-gray-700">
          Practice irregular verbs in groups of 10. Focus on verbs that follow similar patterns,
          like "begin-began-begun" and "sing-sang-sung". This makes them easier to remember!
        </p>
      </div>
    </div>
  );
}
