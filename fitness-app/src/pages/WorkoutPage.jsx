import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, SkipForward, CheckCircle2, RotateCcw } from 'lucide-react';
import ExerciseAnimation from '../components/ExerciseAnimation';

export default function WorkoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const workoutExercises = location.state?.exercises || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [repsDone, setRepsDone] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(30);
  const [isComplete, setIsComplete] = useState(false);
  const [totalReps, setTotalReps] = useState(0);

  const timerRef = useRef(null);
  const restRef = useRef(null);

  const currentEx = workoutExercises[currentIndex];

  // Main timer
  useEffect(() => {
    if (isRunning && !isResting) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, isResting]);

  // Rest timer
  useEffect(() => {
    if (isResting && restTimer > 0) {
      restRef.current = setInterval(() => {
        setRestTimer(t => {
          if (t <= 1) {
            setIsResting(false);
            setIsRunning(true);
            return 30;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restRef.current);
  }, [isResting]);

  const handleRepDone = useCallback(() => {
    if (!currentEx) return;
    setRepsDone(r => r + 1);
    setTotalReps(t => t + 1);

    // Vibrate on mobile
    if (navigator.vibrate) navigator.vibrate(50);

    if (repsDone + 1 >= currentEx.reps) {
      // Set complete
      if (currentSet >= currentEx.sets) {
        // Exercise complete - move to next
        if (currentIndex < workoutExercises.length - 1) {
          setCurrentIndex(i => i + 1);
          setCurrentSet(1);
          setRepsDone(0);
          setIsResting(true);
          setRestTimer(60);
          setIsRunning(false);
        } else {
          // Workout complete
          setIsComplete(true);
          setIsRunning(false);
        }
      } else {
        // Next set
        setCurrentSet(s => s + 1);
        setRepsDone(0);
        setIsResting(true);
        setRestTimer(30);
        setIsRunning(false);
      }
    }
  }, [currentEx, currentSet, currentIndex, workoutExercises.length, repsDone]);

  const handleSkipRest = () => {
    setIsResting(false);
    setIsRunning(true);
    setRestTimer(30);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (workoutExercises.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">没有训练动作</p>
      </div>
    );
  }

  // Completion screen
  if (isComplete) {
    const totalCalories = workoutExercises.reduce((sum, e) => sum + e.calories * e.sets, 0);
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex flex-col items-center justify-center px-6 animate-fade-in">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 animate-bounce-subtle">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h1 className="text-white text-3xl font-bold mb-2">训练完成！</h1>
        <p className="text-green-100 mb-8">太棒了，继续保持！</p>

        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 w-full max-w-xs">
          <div className="grid grid-cols-3 gap-4 text-center text-white">
            <div>
              <p className="text-2xl font-bold">{formatTime(timer)}</p>
              <p className="text-xs text-green-100">用时</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{totalReps}</p>
              <p className="text-xs text-green-100">总次数</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCalories}</p>
              <p className="text-xs text-green-100">千卡</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-8 bg-white text-green-600 font-semibold px-8 py-3 rounded-2xl active:scale-95 transition-transform"
        >
          返回首页
        </button>
      </div>
    );
  }

  // Rest screen
  if (isResting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex flex-col items-center justify-center px-6 animate-fade-in">
        <p className="text-blue-100 text-sm mb-2">休息中</p>
        <p className="text-white text-6xl font-bold mb-2">{restTimer}</p>
        <p className="text-blue-100 text-sm mb-1">
          {currentIndex < workoutExercises.length - 1
            ? `下一个: ${workoutExercises[currentIndex + 1]?.name || currentEx.name}`
            : '最后一个动作'}
        </p>
        <p className="text-blue-200 text-xs mb-8">
          第 {currentSet}/{currentEx.sets} 组 · {currentEx.name}
        </p>

        <button
          onClick={handleSkipRest}
          className="bg-white/20 text-white px-8 py-3 rounded-2xl flex items-center gap-2 active:scale-95 transition-transform"
        >
          <SkipForward size={18} />
          跳过休息
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-10 pb-4">
        <button onClick={() => navigate(-1)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div className="text-center">
          <p className="text-xs text-gray-400">
            {currentIndex + 1}/{workoutExercises.length}
          </p>
        </div>
        <div className="w-8" />
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100 mx-4 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + currentSet / (currentEx?.sets || 1)) / workoutExercises.length) * 100}%` }}
        />
      </div>

      {/* Timer */}
      <div className="text-center pt-4">
        <p className="text-3xl font-mono font-bold text-gray-800">{formatTime(timer)}</p>
      </div>

      {/* Exercise animation */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-48 h-48 bg-gray-50 rounded-3xl overflow-hidden">
          {currentEx && <ExerciseAnimation type={currentEx.animation} speed={700} className="w-full h-full" />}
        </div>
      </div>

      {/* Exercise info */}
      <div className="text-center px-6 pb-4">
        <h2 className="text-xl font-bold text-gray-800">{currentEx?.name}</h2>
        <p className="text-sm text-gray-400 mt-1">
          第 {currentSet}/{currentEx?.sets} 组
        </p>
      </div>

      {/* Rep counter */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-center gap-6 mb-4">
          <button
            onClick={() => setRepsDone(r => Math.max(0, r - 1))}
            className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 active:scale-90 transition-transform"
          >
            <RotateCcw size={20} />
          </button>
          <div className="text-center">
            <p className="text-5xl font-bold text-green-500">{repsDone}</p>
            <p className="text-xs text-gray-400 mt-1">/ {currentEx?.reps} 次</p>
          </div>
          <div className="w-12" />
        </div>

        {/* Big tap button */}
        <button
          onClick={handleRepDone}
          className="w-full bg-green-500 text-white text-lg font-semibold py-5 rounded-2xl active:scale-[0.97] transition-transform shadow-lg shadow-green-500/25"
        >
          完成一次 +1
        </button>
      </div>

      {/* Bottom controls */}
      <div className="flex justify-center gap-4 px-6 pb-8">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-medium ${
            isRunning ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'
          }`}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          {isRunning ? '暂停' : '继续'}
        </button>
        {currentIndex < workoutExercises.length - 1 && (
          <button
            onClick={() => {
              setCurrentIndex(i => i + 1);
              setCurrentSet(1);
              setRepsDone(0);
            }}
            className="px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-medium bg-gray-100 text-gray-500"
          >
            <SkipForward size={16} />
            跳过
          </button>
        )}
      </div>
    </div>
  );
}
