import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Flame, Timer, TrendingUp, ChevronRight } from 'lucide-react';
import exercises, { defaultPlan, dayLabels } from '../data/exercises';
import ExerciseAnimation from '../components/ExerciseAnimation';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function HomePage() {
  const navigate = useNavigate();
  const today = days[new Date().getDay()];
  const todayLabel = dayLabels[today];
  const todayExercises = (defaultPlan[today] || []).map(id => exercises.find(e => e.id === id)).filter(Boolean);

  const totalCalories = todayExercises.reduce((sum, e) => sum + e.calories * e.sets, 0);
  const totalDuration = todayExercises.reduce((sum, e) => sum + e.duration * e.sets, 0);

  const [greeting, setGreeting] = useState('');
  useEffect(() => {
    const h = new Date().getHours();
    if (h < 6) setGreeting('夜深了');
    else if (h < 12) setGreeting('早上好');
    else if (h < 18) setGreeting('下午好');
    else setGreeting('晚上好');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white px-6 pt-12 pb-8 rounded-b-3xl">
        <p className="text-green-100 text-sm">{greeting}</p>
        <h1 className="text-2xl font-bold mt-1">今日训练</h1>
        <p className="text-green-100 text-sm mt-1">{todayLabel} · {todayExercises.length} 个动作</p>

        {/* Stats row */}
        <div className="flex gap-4 mt-6">
          <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
            <Flame size={18} className="mx-auto mb-1 text-orange-300" />
            <p className="text-lg font-bold">{totalCalories}</p>
            <p className="text-[10px] text-green-100">千卡</p>
          </div>
          <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
            <Timer size={18} className="mx-auto mb-1 text-blue-300" />
            <p className="text-lg font-bold">{Math.round(totalDuration / 60)}</p>
            <p className="text-[10px] text-green-100">分钟</p>
          </div>
          <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
            <TrendingUp size={18} className="mx-auto mb-1 text-yellow-300" />
            <p className="text-lg font-bold">{todayExercises.length}</p>
            <p className="text-[10px] text-green-100">动作</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Start button */}
        {todayExercises.length > 0 && (
          <button
            onClick={() => navigate('/workout', { state: { exercises: todayExercises } })}
            className="w-full bg-white rounded-2xl p-4 shadow-lg flex items-center gap-4 mb-6 active:scale-[0.98] transition-transform"
          >
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center animate-pulse-glow">
              <Play size={24} className="text-white ml-0.5" fill="white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-800">开始训练</p>
              <p className="text-xs text-gray-400">预计 {Math.round(totalDuration / 60)} 分钟</p>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </button>
        )}

        {/* Rest day */}
        {todayExercises.length === 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">😴</span>
            </div>
            <p className="font-semibold text-gray-800">今天是休息日</p>
            <p className="text-sm text-gray-400 mt-1">好好恢复，明天继续加油</p>
          </div>
        )}

        {/* Exercise list */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-800">训练动作</h2>
          <button onClick={() => navigate('/exercises')} className="text-xs text-green-500 font-medium">
            查看全部
          </button>
        </div>

        <div className="space-y-3">
          {todayExercises.map((ex, i) => (
            <button
              key={ex.id}
              onClick={() => navigate(`/exercise/${ex.id}`)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-transform text-left"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                <ExerciseAnimation type={ex.animation} speed={800} className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm">{ex.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {ex.sets} 组 × {ex.reps} {ex.reps === 1 ? '次(秒)' : '次'}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-400">{ex.calories * ex.sets} 千卡</p>
              </div>
            </button>
          ))}
        </div>

        {/* Weekly overview */}
        <h2 className="text-base font-semibold text-gray-800 mt-6 mb-3">本周计划</h2>
        <div className="grid grid-cols-7 gap-1.5">
          {Object.entries(dayLabels).map(([key, label]) => {
            const isToday = key === today;
            const hasWorkout = defaultPlan[key]?.length > 0;
            return (
              <div
                key={key}
                className={`rounded-xl p-2 text-center text-xs ${
                  isToday
                    ? 'bg-green-500 text-white'
                    : hasWorkout
                    ? 'bg-white text-gray-700'
                    : 'bg-white/50 text-gray-400'
                }`}
              >
                <p className="font-medium">{label}</p>
                <p className="text-[10px] mt-1 opacity-70">
                  {hasWorkout ? `${defaultPlan[key].length}个` : '休'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
