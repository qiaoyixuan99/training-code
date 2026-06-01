import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import exercises, { categories } from '../data/exercises';
import ExerciseAnimation from '../components/ExerciseAnimation';

export default function ExercisesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const filtered = exercises.filter(ex => {
    const matchSearch = ex.name.includes(search) || ex.category.includes(search);
    const matchCategory = selectedCategory === '全部' || ex.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24 animate-fade-in">
      <div className="px-4 pt-12 pb-2">
        <h1 className="text-2xl font-bold text-gray-800">动作库</h1>
        <p className="text-sm text-gray-400 mt-1">{exercises.length} 个训练动作</p>
      </div>

      {/* Search */}
      <div className="px-4 mt-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            placeholder="搜索动作..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500/30 shadow-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-4 mt-4 overflow-x-auto no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-500 shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-4 mt-4 space-y-2.5">
        {filtered.map(ex => (
          <button
            key={ex.id}
            onClick={() => navigate(`/exercise/${ex.id}`)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 active:scale-[0.98] transition-transform text-left"
          >
            <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
              <ExerciseAnimation type={ex.animation} speed={900} className="w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 text-sm">{ex.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-600 rounded-full">{ex.category}</span>
                <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{ex.difficulty}</span>
                {ex.equipment !== '无器械' && (
                  <span className="text-[10px] px-2 py-0.5 bg-orange-50 text-orange-500 rounded-full">{ex.equipment}</span>
                )}
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            没有找到匹配的动作
          </div>
        )}
      </div>
    </div>
  );
}
