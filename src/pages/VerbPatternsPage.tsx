import { useEffect, useState } from 'react';
import { Search, Loader } from 'lucide-react';
import { supabase, VerbPattern } from '../lib/supabase';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';
import ErrorMessage from '../components/ErrorMessage';

export default function VerbPatternsPage() {
  const [filteredPatterns, setFilteredPatterns] = useState<VerbPattern[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const patternTypes = [
    { value: 'all', label: 'All Patterns' },
    { value: 'gerund', label: 'Gerund' },
    { value: 'infinitive', label: 'Infinitive' },
    { value: 'both_no_change', label: 'Both (No Change)' },
    { value: 'both_with_change', label: 'Both (Meaning Changes)' },
  ];

  const fetchPatterns = async () => {
    return await supabase
      .from('verb_patterns')
      .select('*')
      .order('verb');
  };

  const { data: patterns, error, loading, refetch } = useSupabaseQuery<VerbPattern[]>(fetchPatterns);

  useEffect(() => {
    if (patterns) {
      let filtered = patterns;

      if (selectedType !== 'all') {
        filtered = filtered.filter((pattern) => pattern.pattern_type === selectedType);
      }

      if (searchTerm) {
        filtered = filtered.filter((pattern) =>
          pattern.verb.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredPatterns(filtered);
    }
  }, [searchTerm, selectedType, patterns]);

  function getPatternColor(type: string) {
    switch (type) {
      case 'gerund':
        return 'bg-green-100 text-green-700';
      case 'infinitive':
        return 'bg-blue-100 text-blue-700';
      case 'both_no_change':
        return 'bg-purple-100 text-purple-700';
      case 'both_with_change':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  function getPatternLabel(type: string) {
    switch (type) {
      case 'gerund':
        return 'Gerund';
      case 'infinitive':
        return 'Infinitive';
      case 'both_no_change':
        return 'Both (Same Meaning)';
      case 'both_with_change':
        return 'Both (Different Meanings)';
      default:
        return type;
    }
  }

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
          message="Failed to load verb patterns. Please check your connection and try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">Verb Patterns</h1>
        <p className="text-lg text-gray-600">
          Master verb patterns with gerunds, infinitives, and more
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="font-bold text-gray-800 mb-2">Gerund (-ing form)</h3>
          <p className="text-gray-700 text-sm mb-2">Used after certain verbs:</p>
          <p className="text-gray-600 text-sm italic">"I enjoy <strong>reading</strong> books."</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-bold text-gray-800 mb-2">Infinitive (to + verb)</h3>
          <p className="text-gray-700 text-sm mb-2">Used after certain verbs:</p>
          <p className="text-gray-600 text-sm italic">"I want <strong>to learn</strong> Spanish."</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search verbs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          {patternTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filteredPatterns.map((pattern) => (
          <div
            key={pattern.id}
            className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-800">{pattern.verb}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPatternColor(pattern.pattern_type)}`}>
                {getPatternLabel(pattern.pattern_type)}
              </span>
            </div>
            {pattern.example && (
              <p className="text-gray-700 italic mb-2">"{pattern.example}"</p>
            )}
            {pattern.notes && (
              <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
                <strong>Note:</strong> {pattern.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {filteredPatterns.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No verb patterns found matching your criteria</p>
        </div>
      )}

      <div className="bg-orange-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-800 mb-3">⚡ Special Cases</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <strong className="text-gray-800">Remember vs Forget:</strong>
            <p className="mt-1">
              • "I remember <strong>meeting</strong> you" (I met you, and I remember it)<br />
              • "I remember <strong>to call</strong> you" (I won't forget to call)
            </p>
          </div>
          <div>
            <strong className="text-gray-800">Stop:</strong>
            <p className="mt-1">
              • "I stopped <strong>smoking</strong>" (I quit smoking)<br />
              • "I stopped <strong>to smoke</strong>" (I stopped in order to smoke)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
