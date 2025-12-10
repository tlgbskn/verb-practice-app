import { useEffect, useState } from 'react';
import { Search, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase, PhrasalVerb } from '../lib/supabase';

export default function PhrasalVerbsPage() {
  const [verbs, setVerbs] = useState<PhrasalVerb[]>([]);
  const [filteredVerbs, setFilteredVerbs] = useState<PhrasalVerb[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedVerb, setExpandedVerb] = useState<string | null>(null);

  const verbTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'transitive_separable', label: 'Separable' },
    { value: 'intransitive', label: 'Intransitive' },
    { value: 'three_word', label: 'Three-Word' },
  ];

  useEffect(() => {
    fetchVerbs();
  }, []);

  useEffect(() => {
    let filtered = verbs;

    if (selectedType !== 'all') {
      filtered = filtered.filter((verb) => verb.type === selectedType);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (verb) =>
          verb.full_verb.toLowerCase().includes(searchTerm.toLowerCase()) ||
          verb.definition.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVerbs(filtered);
  }, [searchTerm, selectedType, verbs]);

  async function fetchVerbs() {
    try {
      const { data, error } = await supabase
        .from('phrasal_verbs')
        .select('*')
        .order('full_verb');

      if (error) throw error;
      setVerbs(data || []);
      setFilteredVerbs(data || []);
    } catch (error) {
      console.error('Error fetching verbs:', error);
    } finally {
      setLoading(false);
    }
  }

  function getTypeColor(type: string) {
    switch (type) {
      case 'transitive_separable':
        return 'bg-blue-100 text-blue-700';
      case 'intransitive':
        return 'bg-green-100 text-green-700';
      case 'three_word':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  function getTypeLabel(type: string) {
    switch (type) {
      case 'transitive_separable':
        return 'Separable';
      case 'transitive_inseparable':
        return 'Inseparable';
      case 'transitive_always_separated':
        return 'Always Separated';
      case 'intransitive':
        return 'Intransitive';
      case 'three_word':
        return 'Three-Word';
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

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">Phrasal Verbs</h1>
        <p className="text-lg text-gray-600">
          Explore {verbs.length} essential phrasal verbs with meanings and examples
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search phrasal verbs..."
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
          {verbTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filteredVerbs.map((verb) => {
          const isExpanded = expandedVerb === verb.id;
          return (
            <div
              key={verb.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              <button
                onClick={() => setExpandedVerb(isExpanded ? null : verb.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-xl font-bold text-gray-800">{verb.full_verb}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(verb.type)}`}>
                    {getTypeLabel(verb.type)}
                  </span>
                </div>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {isExpanded && (
                <div className="px-6 pb-4 space-y-3 border-t border-gray-100">
                  <div>
                    <span className="text-sm font-semibold text-gray-600">Definition:</span>
                    <p className="text-gray-800 mt-1">{verb.definition}</p>
                  </div>
                  {verb.example && (
                    <div>
                      <span className="text-sm font-semibold text-gray-600">Example:</span>
                      <p className="text-gray-700 italic mt-1">"{verb.example}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredVerbs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No phrasal verbs found matching your criteria</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-bold text-gray-800 mb-2">💡 Separable vs Inseparable</h3>
          <p className="text-gray-700 text-sm">
            Separable: "turn the light on" or "turn on the light"<br />
            Inseparable: "look after the children" (cannot say "look the children after")
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-6">
          <h3 className="font-bold text-gray-800 mb-2">📚 Learning Strategy</h3>
          <p className="text-gray-700 text-sm">
            Learn phrasal verbs in context. Create example sentences using them in real situations you encounter daily.
          </p>
        </div>
      </div>
    </div>
  );
}
