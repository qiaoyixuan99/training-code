// ──────────────────────────────────────
// GSAP-Style Animation Utilities
// 适配微信小程序（无 DOM 环境）
// 缓动函数 + 动画编排工具
// ──────────────────────────────────────

// ════════════════════════════════════
// 缓动函数库（GSAP Easing 数学实现）
// 这些是纯数学函数，不依赖 DOM
// ════════════════════════════════════

const _sqrt = Math.sqrt;
const _pow = Math.pow;
const _sin = Math.sin;
const _cos = Math.cos;
const _PI = Math.PI;
const _abs = Math.abs;

const Easing = {

  // ── Power 系列 (Quad ~ Quint) ──
  Power0: { // 同 Linear
    easeNone: t => t,
    easeIn: t => t,
    easeOut: t => t,
    easeInOut: t => t,
  },

  Power1: { // Quad
    easeIn: t => t * t,
    easeOut: t => t * (2 - t),
    easeInOut: t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  },

  Power2: { // Cubic
    easeIn: t => t * t * t,
    easeOut: t => --t * t * t + 1,
    easeInOut: t => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  },

  Power3: { // Quart
    easeIn: t => t * t * t * t,
    easeOut: t => 1 - --t * t * t * t,
    easeInOut: t => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  },

  Power4: { // Quint (Strong)
    easeIn: t => t * t * t * t * t,
    easeOut: t => 1 + --t * t * t * t * t,
    easeInOut: t => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t),
  },

  // ── Sine ──
  Sine: {
    easeIn: t => 1 - _cos(t * _PI / 2),
    easeOut: t => _sin(t * _PI / 2),
    easeInOut: t => -0.5 * (_cos(_PI * t) - 1),
  },

  // ── Expo ──
  Expo: {
    easeIn: t => (t === 0 ? 0 : _pow(2, 10 * (t - 1))),
    easeOut: t => (t === 1 ? 1 : 1 - _pow(2, -10 * t)),
    easeInOut: t => {
      if (t === 0 || t === 1) return t;
      if ((t *= 2) < 1) return 0.5 * _pow(2, 10 * (t - 1));
      return 0.5 * (2 - _pow(2, -10 * (t - 1)));
    },
  },

  // ── Circ ──
  Circ: {
    easeIn: t => 1 - _sqrt(1 - t * t),
    easeOut: t => _sqrt(1 - --t * t),
    easeInOut: t => ((t *= 2) < 1) ? -0.5 * (_sqrt(1 - t * t) - 1) : 0.5 * (_sqrt(1 - (t -= 2) * t) + 1),
  },

  // ── Back (overshoot) ──
  Back: {
    easeIn: (t, overshoot = 1.7) => t * t * ((overshoot + 1) * t - overshoot),
    easeOut: (t, overshoot = 1.7) => --t * t * ((overshoot + 1) * t + overshoot) + 1,
    easeInOut: (t, overshoot = 1.7) => {
      const s = overshoot * 1.525;
      if ((t *= 2) < 1) return 0.5 * (t * t * ((s + 1) * t - s));
      return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
    },
  },

  // ── Elastic ──
  Elastic: {
    easeIn: (t, amplitude = 1, period = 0.3) => {
      if (t === 0 || t === 1) return t;
      const s = period / (2 * _PI) * Math.asin(1 / amplitude);
      return -(amplitude * _pow(2, 10 * (t -= 1)) * _sin((t - s) * (2 * _PI) / period));
    },
    easeOut: (t, amplitude = 1, period = 0.3) => {
      if (t === 0 || t === 1) return t;
      const s = period / (2 * _PI) * Math.asin(1 / amplitude);
      return amplitude * _pow(2, -10 * t) * _sin((t - s) * (2 * _PI) / period) + 1;
    },
    easeInOut: (t, amplitude = 1, period = 0.45) => {
      if (t === 0 || t === 1) return t;
      const s = period / (2 * _PI) * Math.asin(1 / amplitude);
      if ((t *= 2) < 1) return -0.5 * (amplitude * _pow(2, 10 * (t -= 1)) * _sin((t - s) * (2 * _PI) / period));
      return amplitude * _pow(2, -10 * (t -= 1)) * _sin((t - s) * (2 * _PI) / period) * 0.5 + 1;
    },
  },

  // ── Bounce ──
  Bounce: {
    easeOut: t => {
      if (t < 1 / 2.75) return 7.5625 * t * t;
      if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
      if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    },
    easeIn: t => 1 - Easing.Bounce.easeOut(1 - t),
    easeInOut: t => (t < 0.5)
      ? Easing.Bounce.easeIn(t * 2) * 0.5
      : Easing.Bounce.easeOut(t * 2 - 1) * 0.5 + 0.5,
  },

  // ── Stepped (steps) ──
  SteppedEase: {
    config: steps => t => Math.floor(t * steps) / steps,
  },
};

// ════════════════════════════════════
// 缓动函数查找表
// ════════════════════════════════════

/** 根据名称获取缓动函数 */
function getEase(easeName) {
  if (typeof easeName === 'function') return easeName;

  // 支持 GSAP 风格的命名，如 "power2.out", "back.inOut", "elastic.out(1, 0.3)"
  const match = easeName.match(/^(\w+)\.(\w+)(?:\((.+)\))?$/);
  if (!match) return Easing.Power2.easeOut; // 默认

  const [, family, type, paramsStr] = match;
  const familyLower = family.toLowerCase();
  const typeLower = type.toLowerCase();

  // 映射缓动族名
  const familyMap = {
    'none': 'Power0', 'linear': 'Power0', 'power0': 'Power0',
    'power1': 'Power1', 'quad': 'Power1',
    'power2': 'Power2', 'cubic': 'Power2',
    'power3': 'Power3', 'quart': 'Power3',
    'power4': 'Power4', 'strong': 'Power4',
    'sine': 'Sine', 'expo': 'Expo', 'circ': 'Circ',
    'back': 'Back', 'elastic': 'Elastic', 'bounce': 'Bounce',
  };

  // 映射类型名
  const typeMap = {
    'in': 'easeIn', 'out': 'easeOut', 'inout': 'easeInOut', 'none': 'easeNone',
  };

  const fam = familyMap[familyLower] || 'Power2';
  const typ = typeMap[typeLower] || 'easeOut';

  if (!Easing[fam] || !Easing[fam][typ]) {
    return Easing.Power2.easeOut;
  }

  const baseFn = Easing[fam][typ];

  // 解析参数（针对 Back 和 Elastic）
  if (paramsStr && (fam === 'Back' || fam === 'Elastic')) {
    const params = paramsStr.split(',').map(s => parseFloat(s.trim()));
    return t => baseFn(t, ...params);
  }

  return baseFn;
}

// ════════════════════════════════════
// 动画编排工具
// ════════════════════════════════════

/**
 * Tween — 数值插值动画
 * 用法: tween({ from: 0, to: 100, duration: 500, ease: 'expo.out', onUpdate: (v) => {...}, onComplete: () => {...} })
 */
function tween(config) {
  const {
    from = 0, to = 1, duration = 400,
    ease = 'power2.out', delay = 0,
    onUpdate, onComplete,
  } = config;

  const easeFn = getEase(ease);
  const range = to - from;
  const startTime = Date.now() + delay;
  let rafId = null;
  let completed = false;

  function step() {
    const now = Date.now();
    const elapsed = now - startTime;

    if (elapsed < 0) {
      rafId = requestAnimationFrame ? requestAnimationFrame(step) : setTimeout(step, 16);
      return;
    }

    let progress = Math.min(elapsed / duration, 1);
    progress = easeFn(progress);
    const value = from + range * progress;

    if (onUpdate) onUpdate(value, progress);

    if (elapsed >= duration) {
      completed = true;
      if (onComplete) onComplete();
    } else {
      rafId = requestAnimationFrame ? requestAnimationFrame(step) : setTimeout(step, 16);
    }
  }

  rafId = requestAnimationFrame ? requestAnimationFrame(step) : setTimeout(step, 16);

  // 返回控制器
  return {
    kill() {
      if (rafId) {
        if (cancelAnimationFrame) cancelAnimationFrame(rafId);
        else clearTimeout(rafId);
        rafId = null;
      }
    },
    get completed() { return completed; },
  };
}

/**
 * Stagger — 批量延迟动画
 * 小程序中配合 setData 使用
 *
 * @param {number} count - 元素个数
 * @param {object} config - { each: number, from?: string|number, ease?: string, onStep: (index, delay) => void }
 */
function stagger(count, config = {}) {
  const { each = 100, from = 'start', ease = 'power2.out' } = config;
  const delays = [];
  const items = Array.from({ length: count }, (_, i) => i);

  // 确定起始方向
  let ordered;
  if (from === 'center' || from === 'middle') {
    ordered = [];
    const mid = Math.floor(count / 2);
    for (let i = 0; i < count; i++) {
      if (i % 2 === 0) ordered.push(mid + Math.floor(i / 2));
      else ordered.push(mid - Math.ceil(i / 2));
    }
    // 过滤越界
    ordered = ordered.filter(i => i >= 0 && i < count);
  } else if (from === 'end' || from === 'edges') {
    ordered = [];
    for (let i = 0; i < count; i++) {
      if (i % 2 === 0) ordered.push(i / 2);
      else ordered.push(count - 1 - Math.floor(i / 2));
    }
  } else {
    ordered = items; // 'start' 或 'beginning'
  }

  ordered.forEach((originalIndex, stepIndex) => {
    delays[originalIndex] = stepIndex * each;
  });

  return {
    delays,
    total: (count - 1) * each,
    items: ordered,
  };
}

/**
 * Timeline — 简单时间轴（小程序适配版）
 * 不依赖 requestAnimationFrame，使用 setTimeout 链式调用
 */
class Timeline {
  constructor() {
    this._tweens = [];
    this._position = 0;
    this._callback = null;
    this._paused = false;
    this._timerId = null;
  }

  /**
   * 添加一个 setData 动画步骤
   * @param {object} data - 要 setData 的数据
   * @param {number} duration - 持续时间 ms
   * @param {string} position - '>' (after previous) | '+=N' | '-=N' | absolute number
   */
  to(data, duration = 300, position = '>') {
    const resolvedPos = this._resolvePosition(position);
    this._tweens.push({ type: 'setData', data, duration, position: resolvedPos });
    return this;
  }

  /**
   * 添加一个回调
   */
  call(callback, position = '>') {
    const resolvedPos = this._resolvePosition(position);
    this._tweens.push({ type: 'call', callback, duration: 0, position: resolvedPos });
    return this;
  }

  /**
   * 添加延迟
   */
  wait(duration) {
    const pos = this._position + duration;
    this._position = pos;
    this._tweens.push({ type: 'wait', duration, position: pos });
    return this;
  }

  _resolvePosition(position) {
    if (typeof position === 'number') {
      this._position = Math.max(this._position, position);
      return this._position;
    }
    if (position === '>') {
      // 默认：接在上一个之后
      return this._position;
    }
    const match = position.match(/^([+-])=(\d+)$/);
    if (match) {
      const offset = parseInt(match[2], 10);
      if (match[1] === '+') this._position += offset;
      else this._position = Math.max(0, this._position - offset);
      return this._position;
    }
    return this._position;
  }

  /**
   * 执行时间轴
   * @param {object} ctx - 页面上下文 (this)，用于调用 setData
   */
  play(ctx) {
    this._paused = false;
    let accumulatedTime = 0;

    const runStep = (index) => {
      if (index >= this._tweens.length || this._paused) {
        return;
      }

      const tween = this._tweens[index];
      const delay = Math.max(0, tween.position - accumulatedTime);
      accumulatedTime = tween.position + tween.duration;

      this._timerId = setTimeout(() => {
        if (this._paused) return;

        if (tween.type === 'setData' && ctx && ctx.setData) {
          ctx.setData(tween.data);
        } else if (tween.type === 'call') {
          tween.callback();
        }

        runStep(index + 1);
      }, delay);
    };

    runStep(0);
    return this;
  }

  pause() {
    this._paused = true;
    if (this._timerId) {
      clearTimeout(this._timerId);
      this._timerId = null;
    }
  }

  kill() {
    this._paused = true;
    if (this._timerId) {
      clearTimeout(this._timerId);
      this._timerId = null;
    }
    this._tweens = [];
  }
}

// ════════════════════════════════════
// CSS 缓动字符串生成
// ════════════════════════════════════

/**
 * 生成 CSS cubic-bezier 近似值（用于 WXSS 动画）
 * GSAP 常用缓动的 CSS 等价写法
 */
const CSSEase = {
  // Power 系列
  'power1.in': 'cubic-bezier(0.55, 0, 1, 0.45)',
  'power1.out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  'power1.inOut': 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  'power2.in': 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  'power2.out': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  'power2.inOut': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  'power3.in': 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  'power3.out': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  'power3.inOut': 'cubic-bezier(0.77, 0, 0.175, 1)',
  'power4.in': 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
  'power4.out': 'cubic-bezier(0.23, 1, 0.32, 1)',
  'power4.inOut': 'cubic-bezier(0.86, 0, 0.07, 1)',

  // Sine
  'sine.in': 'cubic-bezier(0.47, 0, 0.745, 0.715)',
  'sine.out': 'cubic-bezier(0.39, 0.575, 0.565, 1)',
  'sine.inOut': 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',

  // Expo
  'expo.in': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
  'expo.out': 'cubic-bezier(0.19, 1, 0.22, 1)',
  'expo.inOut': 'cubic-bezier(1, 0, 0, 1)',

  // Circ
  'circ.in': 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
  'circ.out': 'cubic-bezier(0.075, 0.82, 0.165, 1)',
  'circ.inOut': 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',

  // Back
  'back.in': 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  'back.out': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  'back.inOut': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

  // 弹性缓动（用关键帧近似，cubic-bezier 无法精确表达）
  'elastic.out': 'cubic-bezier(0.16, 1.36, 0.48, 0.99)',
  'elastic.in': 'cubic-bezier(0.64, -0.36, 0.84, 0.01)',

  // Bounce
  'bounce.out': 'cubic-bezier(0.18, 0.99, 0.42, 0.99)',
  'bounce.in': 'cubic-bezier(0.58, 0.01, 0.82, 0.01)',
};

// ════════════════════════════════════
// 微交互预设
// ════════════════════════════════════

const MicroInteractions = {
  /** 按钮按压 */
  press(selector, scale = 0.95, duration = 150) {
    return { scale, duration, ease: 'power2.in' };
  },

  /** 弹跳出现 */
  bounceIn(duration = 500) {
    return { duration, ease: 'back.out(1.7)' };
  },

  /** 弹性消失 */
  elasticOut(duration = 400) {
    return { duration, ease: 'elastic.in(1, 0.3)' };
  },

  /** 光泽扫过 */
  shimmer(duration = 800) {
    return { duration, ease: 'power2.inOut' };
  },
};

module.exports = {
  Easing,
  getEase,
  tween,
  stagger,
  Timeline,
  CSSEase,
  MicroInteractions,
};
