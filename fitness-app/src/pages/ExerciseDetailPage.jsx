import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Flame, Timer, Target, ChevronRight } from 'lucide-react';
import exercises from '../data/exercises';
import ExerciseAnimation from '../components/ExerciseAnimation';

export default function ExerciseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ex = exercises.find(e => e.id === id);

  if (!ex) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        动作未找到
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white px-6 pt-10 pb-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-10 left-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="text-center pt-6">
          <div className="w-40 h-40 mx-auto bg-white/10 rounded-3xl overflow-hidden">
            <ExerciseAnimation type={ex.animation} speed={600} className="w-full h-full" />
          </div>
          <h1 className="text-2xl font-bold mt-4">{ex.name}</h1>
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="text-xs px-3 py-1 bg-white/20 rounded-full">{ex.category}</span>
            <span className="text-xs px-3 py-1 bg-white/20 rounded-full">{ex.difficulty}</span>
            <span className="text-xs px-3 py-1 bg-white/20 rounded-full">{ex.equipment}</span>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-3">
        {/* Stats */}
        <div className="bg-white rounded-2xl p-4 shadow-lg flex justify-around mb-5">
          <div className="text-center">
            <Flame size={18} className="mx-auto text-orange-400 mb-1" />
            <p className="text-sm font-bold text-gray-800">{ex.calories}千卡</p>
            <p className="text-[10px] text-gray-400">/组</p>
          </div>
          <div className="w-px bg-gray-100" />
          <div className="text-center">
            <Timer size={18} className="mx-auto text-blue-400 mb-1" />
            <p className="text-sm font-bold text-gray-800">{ex.duration}秒</p>
            <p className="text-[10px] text-gray-400">/组</p>
          </div>
          <div className="w-px bg-gray-100" />
          <div className="text-center">
            <Target size={18} className="mx-auto text-green-400 mb-1" />
            <p className="text-sm font-bold text-gray-800">{ex.sets}×{ex.reps}</p>
            <p className="text-[10px] text-gray-400">组×次</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h3 className="font-semibold text-gray-800 text-sm mb-2">动作介绍</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{ex.description}</p>
        </div>

        {/* Target muscles */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h3 className="font-semibold text-gray-800 text-sm mb-2">目标肌群</h3>
          <div className="flex flex-wrap gap-2">
            {ex.muscles.map(m => (
              <span key={m} className="text-xs px-3 py-1.5 bg-green-50 text-green-600 rounded-full font-medium">
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h3 className="font-semibold text-gray-800 text-sm mb-3">动作步骤</h3>
          <div className="space-y-3">
            {ex.steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h3 className="font-semibold text-gray-800 text-sm mb-2">注意事项</h3>
          <div className="space-y-2">
            {ex.tips.map((tip, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-yellow-500 mt-0.5 text-xs">⚠</span>
                <p className="text-sm text-gray-500">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Start single exercise */}
        <button
          onClick={() => navigate('/workout', { state: { exercises: [ex] } })}
          className="w-full bg-green-500 text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-green-500/25"
        >
          <Play size={20} fill="white" />
          开始训练此动作
        </button>
      </div>
    </div>
  );
}
