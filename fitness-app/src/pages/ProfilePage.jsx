import { useState, useEffect } from 'react';
import { ChevronRight, Target, Flame, Calendar, Award } from 'lucide-react';

export default function ProfilePage() {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCalories: 0,
    streak: 0,
    totalMinutes: 0,
  });

  useEffect(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('fitness-stats');
    if (saved) setStats(JSON.parse(saved));
  }, []);

  const menuItems = [
    { icon: Target, label: '训练目标', desc: '设置每日目标', color: 'text-green-500 bg-green-50' },
    { icon: Flame, label: '卡路里记录', desc: '查看消耗历史', color: 'text-orange-500 bg-orange-50' },
    { icon: Calendar, label: '训练日历', desc: '训练打卡记录', color: 'text-blue-500 bg-blue-50' },
    { icon: Award, label: '成就', desc: '解锁的成就', color: 'text-purple-500 bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-6 pt-12 pb-8 rounded-b-3xl text-center text-white">
        <div className="w-20 h-20 bg-white/20 rounded-full mx-auto flex items-center justify-center text-3xl mb-3">
          💪
        </div>
        <h1 className="text-xl font-bold">健身达人</h1>
        <p className="text-green-100 text-sm mt-1">坚持就是胜利</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 px-4 -mt-5">
        {[
          { value: stats.totalWorkouts || 12, label: '训练次数', icon: '🏋️' },
          { value: stats.totalCalories || 2450, label: '总消耗千卡', icon: '🔥' },
          { value: stats.streak || 5, label: '连续天数', icon: '📅' },
          { value: stats.totalMinutes || 180, label: '总时长(分)', icon: '⏱️' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <span className="text-2xl">{s.icon}</span>
            <p className="text-2xl font-bold text-gray-800 mt-1">{s.value}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="px-4 mt-6 space-y-2.5">
        {menuItems.map(({ icon: Icon, label, desc, color }) => (
          <button key={label} className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 active:scale-[0.98] transition-transform text-left">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 text-sm">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        ))}
      </div>

      {/* App info */}
      <div className="text-center mt-8 pb-4">
        <p className="text-xs text-gray-300">FitPlan v1.0.0</p>
      </div>
    </div>
  );
}
