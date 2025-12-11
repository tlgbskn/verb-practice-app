import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Star, Lock, MapPin, ChevronRight, Loader2 } from 'lucide-react';

interface Level {
    id: number;
    title: string;
    description: string;
    totalVerbs: number;
    masteredVerbs: number;
    status: 'locked' | 'unlocked' | 'completed';
    type: 'irregular' | 'phrasal' | 'stative'; // Simplification for now
}

export default function MilestonesPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [levels, setLevels] = useState<Level[]>([]);

    useEffect(() => {
        async function fetchProgress() {
            if (!user) return;

            try {
                setLoading(true);

                // 1. Fetch total counts (simulated for now, ideally strictly from DB)
                // In a real app, we'd query the counts of each table. 
                // For this demo, we'll create "Virtual Levels" based on fixed chunks.

                // Fetch user progress to see how many are mastered
                const { data: progressData } = await supabase
                    .from('user_progress')
                    .select('verb_type, status')
                    .eq('status', 'mastered');

                const masteredCount = {
                    irregular: progressData?.filter(p => p.verb_type === 'irregular').length || 0,
                    phrasal: progressData?.filter(p => p.verb_type === 'phrasal').length || 0,
                    stative: progressData?.filter(p => p.verb_type === 'stative').length || 0,
                };

                // Define our Levels "Map"
                const mapLevels: Level[] = [
                    {
                        id: 1,
                        title: 'Irregular Basics',
                        description: 'Start with the most common irregular verbs.',
                        totalVerbs: 20, // Goal
                        masteredVerbs: Math.min(masteredCount.irregular, 20),
                        status: 'unlocked', // First one always open
                        type: 'irregular'
                    },
                    {
                        id: 2,
                        title: 'Phrasal Starters',
                        description: 'Essential phrasal verbs for daily use.',
                        totalVerbs: 15,
                        masteredVerbs: Math.min(masteredCount.phrasal, 15),
                        status: masteredCount.irregular >= 10 ? 'unlocked' : 'locked', // Unlock condition
                        type: 'phrasal'
                    },
                    {
                        id: 3,
                        title: 'Stative Feelings',
                        description: 'Verbs that describe states of being.',
                        totalVerbs: 10,
                        masteredVerbs: Math.min(masteredCount.stative, 10),
                        status: masteredCount.phrasal >= 5 ? 'unlocked' : 'locked',
                        type: 'stative'
                    },
                    {
                        id: 4,
                        title: 'Irregular Mastery',
                        description: 'More complex irregular verbs.',
                        totalVerbs: 30,
                        masteredVerbs: Math.max(0, masteredCount.irregular - 20), // Remaining
                        status: masteredCount.irregular >= 20 ? 'unlocked' : 'locked',
                        type: 'irregular'
                    },
                ];

                // Mark completed
                const finalLevels = mapLevels.map(l => ({
                    ...l,
                    status: l.masteredVerbs >= l.totalVerbs ? 'completed' : l.status
                })) as Level[];

                setLevels(finalLevels);

            } catch (error) {
                console.error('Error loading milestones:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProgress();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-green-600" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto pb-20">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
                    <MapPin className="text-green-600" size={32} />
                    Your Journey
                </h1>
                <p className="text-gray-600 mt-2">Travel through the lands of English Verbs</p>
            </div>

            <div className="relative">
                {/* Connection Line */}
                <div className="absolute left-8 top-8 bottom-8 w-1 bg-gray-200 -z-10" />

                <div className="space-y-8">
                    {levels.map((level) => (
                        <div key={level.id} className={`relative flex items-start gap-6 group ${level.status === 'locked' ? 'opacity-60 grayscale' : ''}`}>

                            {/* Node Icon */}
                            <div className={`
                flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center border-4 z-10 bg-white
                ${level.status === 'completed' ? 'border-yellow-400 text-yellow-500' :
                                    level.status === 'unlocked' ? 'border-green-600 text-green-600' : 'border-gray-300 text-gray-400'}
              `}>
                                {level.status === 'completed' ? <Trophy size={28} /> :
                                    level.status === 'locked' ? <Lock size={24} /> : <Star size={28} fill="currentColor" className="text-green-100 invert-0" />}
                            </div>

                            {/* Card */}
                            <div className="flex-1 bg-white rounded-xl shadow-md p-5 border border-gray-100 transition-transform hover:scale-[1.02]">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide
                      ${level.type === 'irregular' ? 'bg-orange-100 text-orange-700' :
                                                level.type === 'phrasal' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}
                    `}>
                                            {level.type}
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-900 mt-2">{level.title}</h3>
                                    </div>
                                    {level.status === 'completed' && <Star size={20} className="text-yellow-400 fill-current" />}
                                </div>

                                <p className="text-sm text-gray-600 mb-4">{level.description}</p>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${level.status === 'completed' ? 'bg-yellow-400' : 'bg-green-600'
                                            }`}
                                        style={{ width: `${(level.masteredVerbs / level.totalVerbs) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 font-medium">
                                    <span>{Math.round((level.masteredVerbs / level.totalVerbs) * 100)}% Complete</span>
                                    <span>{level.masteredVerbs}/{level.totalVerbs} Verbs</span>
                                </div>

                                {level.status === 'unlocked' && (
                                    <button className="mt-4 w-full py-2 bg-green-50 text-green-700 font-semibold rounded-lg hover:bg-green-100 flex items-center justify-center gap-1 text-sm">
                                        Continue <ChevronRight size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
