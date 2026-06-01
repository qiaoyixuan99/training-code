import { useEffect, useState } from 'react';

// SVG stick figure animations for exercises
function StickFigure({ phase, color = '#22c55e' }) {
  const armAngle = phase === 'down' ? -60 : 0;
  const bodyY = phase === 'down' ? 10 : 0;
  const legAngle = phase === 'down' ? -20 : 0;

  return (
    <svg viewBox="0 0 120 160" className="w-full h-full">
      {/* Head */}
      <circle cx="60" cy={25 + bodyY} r="14" fill="none" stroke={color} strokeWidth="3" />
      {/* Body */}
      <line x1="60" y1={39 + bodyY} x2="60" y2={90 + bodyY} stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* Left arm */}
      <line
        x1="60" y1={52 + bodyY}
        x2={60 + 30 * Math.sin((armAngle * Math.PI) / 180)}
        y2={52 + bodyY + 30 * Math.cos((armAngle * Math.PI) / 180)}
        stroke={color} strokeWidth="3" strokeLinecap="round"
      />
      {/* Right arm */}
      <line
        x1="60" y1={52 + bodyY}
        x2={60 - 30 * Math.sin((armAngle * Math.PI) / 180)}
        y2={52 + bodyY + 30 * Math.cos((armAngle * Math.PI) / 180)}
        stroke={color} strokeWidth="3" strokeLinecap="round"
      />
      {/* Left leg */}
      <line
        x1="60" y1={90 + bodyY}
        x2={60 + 25 * Math.sin((legAngle * Math.PI) / 180) - 10}
        y2={90 + bodyY + 35 * Math.cos((legAngle * Math.PI) / 180)}
        stroke={color} strokeWidth="3" strokeLinecap="round"
      />
      {/* Right leg */}
      <line
        x1="60" y1={90 + bodyY}
        x2={60 - 25 * Math.sin((legAngle * Math.PI) / 180) + 10}
        y2={90 + bodyY + 35 * Math.cos((legAngle * Math.PI) / 180)}
        stroke={color} strokeWidth="3" strokeLinecap="round"
      />
    </svg>
  );
}

// Push-up animation
function PushUpAnimation({ phase }) {
  const isDown = phase === 'down';
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full">
      <g transform={isDown ? 'translate(0, 12)' : 'translate(0, 0)'}>
        {/* Body line */}
        <line x1="30" y1="50" x2="170" y2={isDown ? '60' : '50'} stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        {/* Head */}
        <circle cx={isDown ? '25' : '30'} cy={isDown ? '55' : '45'} r="10" fill="none" stroke="#22c55e" strokeWidth="3" />
        {/* Arms */}
        <line x1="55" y1={isDown ? '62' : '50'} x2="55" y2={isDown ? '80' : '75'} stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        <line x1="80" y1={isDown ? '62' : '50'} x2="80" y2={isDown ? '80' : '75'} stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        {/* Legs */}
        <line x1="170" y1={isDown ? '60' : '50'} x2="175" y2="85" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        {/* Ground */}
        <line x1="20" y1="85" x2="180" y2="85" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
      </g>
    </svg>
  );
}

// Squat animation
function SquatAnimation({ phase }) {
  const isDown = phase === 'down';
  return (
    <svg viewBox="0 0 120 160" className="w-full h-full">
      <g transform={isDown ? 'translate(0, 20)' : 'translate(0, 0)'}>
        {/* Head */}
        <circle cx="60" cy="20" r="12" fill="none" stroke="#22c55e" strokeWidth="3" />
        {/* Body */}
        <line x1="60" y1="32" x2="60" y2={isDown ? '70' : '80'} stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        {/* Arms */}
        <line x1="60" y1="45" x2="35" y2={isDown ? '55' : '65'} stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="45" x2="85" y2={isDown ? '55' : '65'} stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        {/* Legs */}
        <line x1="60" y1={isDown ? '70' : '80'} x2={isDown ? '35' : '45'} y2={isDown ? '100' : '120'} stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1={isDown ? '70' : '80'} x2={isDown ? '85' : '75'} y2={isDown ? '100' : '120'} stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        {/* Lower legs */}
        <line x1={isDown ? '35' : '45'} y1={isDown ? '100' : '120'} x2={isDown ? '30' : '40'} y2="140" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        <line x1={isDown ? '85' : '75'} y1={isDown ? '100' : '120'} x2={isDown ? '90' : '80'} y2="140" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        {/* Ground */}
        <line x1="20" y1="140" x2="100" y2="140" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
      </g>
    </svg>
  );
}

// Plank animation (slight body shake)
function PlankAnimation({ phase }) {
  const shake = phase === 'down' ? 1 : 0;
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full">
      <g transform={`translate(${shake}, 0)`}>
        {/* Head */}
        <circle cx="25" cy={38} r="10" fill="none" stroke="#22c55e" strokeWidth="3" />
        {/* Body */}
        <line x1="35" y1={40} x2="165" y2={42} stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        {/* Arms */}
        <line x1="55" y1="42" x2="55" y2="70" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        <line x1="80" y1="42" x2="80" y2="70" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        {/* Legs */}
        <line x1="165" y1="42" x2="170" y2="70" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        {/* Ground */}
        <line x1="20" y1="72" x2="180" y2="72" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
      </g>
    </svg>
  );
}

// Lunge animation
function LungeAnimation({ phase }) {
  const isDown = phase === 'down';
  return (
    <svg viewBox="0 0 120 160" className="w-full h-full">
      <g transform={isDown ? 'translate(0, 15)' : 'translate(0, 0)'}>
        {/* Head */}
        <circle cx="60" cy="18" r="12" fill="none" stroke="#22c55e" strokeWidth="3" />
        {/* Body */}
        <line x1="60" y1="30" x2="60" y2={isDown ? '65' : '75'} stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        {/* Arms */}
        <line x1="60" y1="42" x2="40" y2="55" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="42" x2="80" y2="55" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        {/* Front leg */}
        <line x1="60" y1={isDown ? '65' : '75'} x2={isDown ? '30' : '40'} y2={isDown ? '100' : '120'} stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        <line x1={isDown ? '30' : '40'} y1={isDown ? '100' : '120'} x2={isDown ? '25' : '35'} y2="140" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        {/* Back leg */}
        <line x1="60" y1={isDown ? '65' : '75'} x2={isDown ? '90' : '80'} y2={isDown ? '105' : '120'} stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        <line x1={isDown ? '90' : '80'} y1={isDown ? '105' : '120'} x2={isDown ? '95' : '85'} y2="140" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        {/* Ground */}
        <line x1="15" y1="140" x2="105" y2="140" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
      </g>
    </svg>
  );
}

// Burpee animation
function BurpeeAnimation({ phase }) {
  const configs = {
    up: { headCy: 20, bodyY1: 32, bodyY2: 80, armY: 15, legY: 120 },
    down: { headCy: 55, bodyY1: 55, bodyY2: 55, armY: 78, legY: 55 },
  };
  const c = configs[phase] || configs.up;
  return (
    <svg viewBox="0 0 120 140" className="w-full h-full">
      {phase === 'down' ? (
        // Plank position
        <g>
          <circle cx="20" cy={c.headCy} r="10" fill="none" stroke="#f59e0b" strokeWidth="3" />
          <line x1="30" y1={c.bodyY1} x2="110" y2={c.bodyY1} stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="45" y1={c.bodyY1} x2="45" y2={c.armY} stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="70" y1={c.bodyY1} x2="70" y2={c.armY} stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="110" y1={c.bodyY1} x2="112" y2="80" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="15" y1="80" x2="115" y2="80" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
        </g>
      ) : (
        // Jump position
        <g>
          <circle cx="60" cy={c.headCy} r="12" fill="none" stroke="#f59e0b" strokeWidth="3" />
          <line x1="60" y1={c.bodyY1} x2="60" y2={c.bodyY2} stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="60" y1="40" x2="30" y2={c.armY} stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="60" y1="40" x2="90" y2={c.armY} stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="60" y1={c.bodyY2} x2="40" y2={c.legY} stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="60" y1={c.bodyY2} x2="80" y2={c.legY} stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="15" y1="130" x2="105" y2="130" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
        </g>
      )}
    </svg>
  );
}

// Mountain climber
function MountainClimberAnimation({ phase }) {
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full">
      {/* Head */}
      <circle cx="25" cy="35" r="10" fill="none" stroke="#ef4444" strokeWidth="3" />
      {/* Body */}
      <line x1="35" y1="38" x2="130" y2="38" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      {/* Arms */}
      <line x1="55" y1="38" x2="55" y2="70" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      <line x1="80" y1="38" x2="80" y2="70" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      {/* Active leg */}
      <line
        x1="130" y1="38"
        x2={phase === 'down' ? '105' : '155'}
        y2={phase === 'down' ? '60' : '55'}
        stroke="#ef4444" strokeWidth="3" strokeLinecap="round"
      />
      <line
        x1={phase === 'down' ? '105' : '155'} y1={phase === 'down' ? '60' : '55'}
        x2={phase === 'down' ? '100' : '160'} y2="72"
        stroke="#ef4444" strokeWidth="3" strokeLinecap="round"
      />
      {/* Back leg */}
      <line
        x1="130" y1="38"
        x2={phase === 'down' ? '155' : '105'}
        y2={phase === 'down' ? '55' : '60'}
        stroke="#ef4444" strokeWidth="3" strokeLinecap="round"
      />
      <line
        x1={phase === 'down' ? '155' : '105'} y1={phase === 'down' ? '55' : '60'}
        x2={phase === 'down' ? '160' : '100'} y2="72"
        stroke="#ef4444" strokeWidth="3" strokeLinecap="round"
      />
      {/* Ground */}
      <line x1="15" y1="73" x2="170" y2="73" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
    </svg>
  );
}

// Generic up/down animation for other exercises
function GenericAnimation({ phase, color = '#22c55e' }) {
  const isDown = phase === 'down';
  return (
    <svg viewBox="0 0 120 160" className="w-full h-full">
      <g transform={isDown ? 'translate(0, 10)' : 'translate(0, 0)'}>
        <circle cx="60" cy="20" r="12" fill="none" stroke={color} strokeWidth="3" />
        <line x1="60" y1="32" x2="60" y2="80" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="45" x2="35" y2={isDown ? '50' : '65'} stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="45" x2="85" y2={isDown ? '50' : '65'} stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="80" x2="40" y2="120" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="80" x2="80" y2="120" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="40" y1="120" x2="35" y2="140" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="80" y1="120" x2="85" y2="140" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="140" x2="100" y2="140" stroke={color} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
      </g>
    </svg>
  );
}

const animationMap = {
  pushup: PushUpAnimation,
  squat: SquatAnimation,
  plank: PlankAnimation,
  lunge: LungeAnimation,
  burpee: BurpeeAnimation,
  mountainclimber: MountainClimberAnimation,
  situp: GenericAnimation,
  jumpingjack: GenericAnimation,
  curl: GenericAnimation,
  pullup: GenericAnimation,
  shoulderpress: GenericAnimation,
  deadlift: GenericAnimation,
};

export default function ExerciseAnimation({ type = 'pushup', speed = 1000, className = '' }) {
  const [phase, setPhase] = useState('up');

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p === 'up' ? 'down' : 'up'));
    }, speed);
    return () => clearInterval(interval);
  }, [speed]);

  const AnimationComponent = animationMap[type] || GenericAnimation;

  return (
    <div className={`${className} flex items-center justify-center`}>
      <AnimationComponent phase={phase} />
    </div>
  );
}
