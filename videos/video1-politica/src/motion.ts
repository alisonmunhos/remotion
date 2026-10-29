// Ferramentas de animação determinísticas. Todo o filme é função do tempo t (segundos).

export type Ease = (x: number) => number;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export const E = {
	linear: (x: number) => x,
	inOutCubic: (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
	outCubic: (x: number) => 1 - Math.pow(1 - x, 3),
	inCubic: (x: number) => x * x * x,
	outExpo: (x: number) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)),
	inOutExpo: (x: number) =>
		x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
	outBack: (x: number) => {
		const c1 = 1.70158;
		const c3 = c1 + 1;
		return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
	},
	inBack: (x: number) => {
		const c1 = 1.70158;
		return (c1 + 1) * x * x * x - c1 * x * x;
	},
	outElastic: (x: number) =>
		x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1,
	// queda com pequeno quique ao tocar a posição final
	outBounce: (x: number) => {
		const n1 = 7.5625;
		const d1 = 2.75;
		if (x < 1 / d1) return n1 * x * x;
		if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
		if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
		return n1 * (x -= 2.625 / d1) * x + 0.984375;
	},
};

// Progresso 0→1 entre a e b com easing.
export const p = (t: number, a: number, b: number, ease: Ease = E.inOutCubic) => ease(clamp01((t - a) / (b - a)));

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export type Pt = [number, number];
export const lerpPt = (a: Pt, b: Pt, k: number): Pt => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

// Keyframes: [tempo, valor, easing do trecho que termina neste keyframe]
export type Key<T> = [number, T, Ease?];

export function kf(t: number, keys: Key<number>[]): number {
	if (t <= keys[0][0]) return keys[0][1];
	for (let i = 1; i < keys.length; i++) {
		const [t1, v1, ease] = keys[i];
		if (t <= t1) {
			const [t0, v0] = keys[i - 1];
			return lerp(v0, v1, (ease ?? E.inOutCubic)(clamp01((t - t0) / (t1 - t0))));
		}
	}
	return keys[keys.length - 1][1];
}

export function kfPt(t: number, keys: Key<Pt>[]): Pt {
	return [kf(t, keys.map(([k, v, e]) => [k, v[0], e])), kf(t, keys.map(([k, v, e]) => [k, v[1], e]))];
}

// Pausas dramáticas: o relógio dos movimentos contínuos (respiração, ar, oscilações) para.
const FREEZES: [number, number][] = [
	[10.58, 11.4],
	[68.72, 69.4],
];
export const idle = (t: number) => {
	let out = t;
	for (const [a, b] of FREEZES) {
		if (t > a) out -= Math.min(t, b) - a;
	}
	return out;
};
export const frozen = (t: number) => FREEZES.some(([a, b]) => t >= a && t < b);

// Hash determinístico para variações "aleatórias" reprodutíveis.
export const rand = (seed: number) => {
	const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};

// Ponto e tangente numa Bézier quadrática.
export const quad = (a: Pt, c: Pt, b: Pt, u: number): Pt => [
	(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0],
	(1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1],
];

// Oscilação amortecida disparada em t0 (follow-through de elásticos e impactos).
// freq em radianos por segundo.
export const wobble = (t: number, t0: number, amp: number, freq = 18, decay = 4) =>
	t < t0 ? 0 : amp * Math.exp(-(t - t0) * decay) * Math.sin((t - t0) * freq);
