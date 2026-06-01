import { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';
import exercises, { defaultPlan, dayLabels } from '../data/exercises';
import ExerciseAnimation from '../components/ExerciseAnimation';

export default function PlanPage() {
  const [plan, setPlan] = useState(defaultPlan);
  const [editingDay, setEditingDay] = useState(null);

  const toggleExercise = (day, exId) => {
    setPlan(prev => {
      const dayExercises = prev[day] || [];
      if (dayExercises.includes(exId)) {
        return { ...prev, [day]: dayExercises.filter(id => id !== exId) };
      }
      return { ...prev, [day]: [...dayExercises, exId] };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 animate-fade-in">
      <div className="px-4 pt-12 pb-2">
        <h1 className="text-2xl font-bold text-gray-800">训练计划</h1>
        <p className="text-sm text-gray-400 mt-1">自定义你的每周训练安排</p>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {Object.entries(dayLabels).map(([day, label]) => {
          const dayExercises = (plan[day] || []).map(id => exercises.find(e => e.id === id)).filter(Boolean);
          const isEditing = editingDay === day;
          const totalCal = dayExercises.reduce((s, e) => s + e.calories * e.sets, 0);

          return (
            <div key={day} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Day header */}
              <button
                onClick={() => setEditingDay(isEditing ? null : day)}
                className="w-full flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                    dayExercises.length > 0 ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {label.slice(1)}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800 text-sm">{label}</p>
                    <p className="text-xs text-gray-400">
                      {dayExercises.length > 0
                        ? `${dayExercises.length} 个动作 · ${totalCal} 千卡`
                        : '休息日'}
                    </p>
                  </div>
                </div>
                <Plus size={18} className={`text-gray-300 transition-transform ${isEditing ? 'rotate-45' : ''}`} />
              </button>

              {/* Current exercises */}
              {dayExercises.length > 0 && !isEditing && (
                <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
                  {dayExercises.map(ex => (
                    <div key={ex.id} className="flex-shrink-0 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                      <div className="w-8 h-8 bg-white rounded-lg overflow-hidden">
                        <ExerciseAnimation type={ex.animation} speed={1200} className="w-full h-full" />
                      </div>
                      <span className="text-xs text-gray-600 whitespace-nowrap">{ex.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Edit mode */}
              {isEditing && (
                <div className="px-4 pb-4 border-t border-gray-50">
                  <p className="text-xs text-gray-400 py-3">点击添加或移除动作：</p>
                  <div className="grid grid-cols-2 gap-2">
                    {exercises.map(ex => {
                      const isSelected = (plan[day] || []).includes(ex.id);
                      return (
                        <button
                          key={ex.id}
                          onClick={() => toggleExercise(day, ex.id)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl text-left transition-colors ${
                            isSelected ? 'bg-green-50 ring-1 ring-green-200' : 'bg-gray-50'
                          }`}
                        >
                          <div className="w-8 h-8 bg-white rounded-lg overflow-hidden flex-shrink-0">
                            <ExerciseAnimation type={ex.animation} speed={1200} className="w-full h-full" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium truncate ${isSelected ? 'text-green-700' : 'text-gray-600'}`}>
                              {ex.name}
                            </p>
                          </div>
                          {isSelected && <Check size={14} className="text-green-500 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
