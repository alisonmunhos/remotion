import React from 'react';
import {E, idle, lerp} from './motion';
import {C} from './theme';

// ---------------------------------------------------------------------------
// Elenco: cinco adultos brasileiros, sempre com o mesmo desenho.
// P1 e P2 querem 18° (sentem calor), P3 quer 25° (sente frio), P4 e P5 tanto faz.
// ---------------------------------------------------------------------------

type Hair = 'short' | 'ponytail' | 'afro' | 'bald' | 'bob';

export type Spec = {
	name: string;
	skin: string;
	hair: Hair;
	hairColor: string;
	top: string;
	pants: string;
	build: number;
	height: number;
	beard: boolean;
	glasses: boolean;
};

export const CAST: Spec[] = [
	{name: 'Marcos', skin: '#A0663F', hair: 'short', hairColor: '#1B1410', top: '#2E6E5E', pants: '#1E2630', build: 1.22, height: 1.02, beard: false, glasses: false},
	{name: 'Júlia', skin: '#F0C6A2', hair: 'ponytail', hairColor: '#6B3E1F', top: '#D9A21B', pants: '#2B4C7E', build: 0.95, height: 0.98, beard: false, glasses: false},
	{name: 'Dandara', skin: '#5A3520', hair: 'afro', hairColor: '#160E0A', top: '#B23A6A', pants: '#1E2630', build: 1.0, height: 1.0, beard: false, glasses: false},
	{name: 'Rafael', skin: '#D9A07A', hair: 'bald', hairColor: '#3A2618', top: '#5F7FA6', pants: '#5A4A3A', build: 1.05, height: 1.04, beard: true, glasses: false},
	{name: 'Cida', skin: '#C68B5E', hair: 'bob', hairColor: '#B9BCC2', top: '#343A40', pants: '#6B5B4A', build: 1.0, height: 0.93, beard: false, glasses: true},
];

// ---------------------------------------------------------------------------
// Poses. Ângulos dos braços em graus a partir da vertical para baixo:
// positivo = para fora do corpo, 180 = para cima. a2 é a dobra do antebraço.
// ---------------------------------------------------------------------------

export type Pose = {
	lean: number;
	head: number;
	shoulder: number;
	aL1: number;
	aL2: number;
	aR1: number;
	aR2: number;
	hop: number;
};

export const POSES: Record<string, Pose> = {
	rest: {lean: 0, head: 0, shoulder: 0, aL1: 8, aL2: 6, aR1: 8, aR2: 6, hop: 0},
	hot: {lean: -4, head: 6, shoulder: 0, aL1: 30, aL2: -100, aR1: 150, aR2: 55, hop: 0},
	cold: {lean: 3, head: -5, shoulder: 9, aL1: 18, aL2: -128, aR1: 18, aR2: -128, hop: 0},
	shrug: {lean: 0, head: 9, shoulder: 8, aL1: 22, aL2: 100, aR1: 22, aR2: 100, hop: 0},
	annoyed: {lean: -2, head: -8, shoulder: 3, aL1: 18, aL2: -128, aR1: 18, aR2: -128, hop: 0},
	happy: {lean: 0, head: 4, shoulder: 0, aL1: 140, aL2: 20, aR1: 140, aR2: 20, hop: 10},
	point: {lean: 5, head: 0, shoulder: 0, aL1: 8, aL2: 6, aR1: 100, aR2: 10, hop: 0},
	operate: {lean: 8, head: 4, shoulder: 0, aL1: 10, aL2: 8, aR1: 82, aR2: 34, hop: 0},
	vote: {lean: 0, head: -4, shoulder: 0, aL1: 8, aL2: 6, aR1: 172, aR2: 4, hop: 0},
	look: {lean: 2, head: -6, shoulder: 0, aL1: 6, aL2: 4, aR1: 6, aR2: 4, hop: 0},
	still: {lean: 0, head: 0, shoulder: 2, aL1: 4, aL2: 2, aR1: 4, aR2: 2, hop: 0},
};

const blend = (a: Pose, b: Pose, k: number): Pose => ({
	lean: lerp(a.lean, b.lean, k),
	head: lerp(a.head, b.head, k),
	shoulder: lerp(a.shoulder, b.shoulder, k),
	aL1: lerp(a.aL1, b.aL1, k),
	aL2: lerp(a.aL2, b.aL2, k),
	aR1: lerp(a.aR1, b.aR1, k),
	aR2: lerp(a.aR2, b.aR2, k),
	hop: lerp(a.hop, b.hop, k),
});

// Linha do tempo de poses: a troca usa outBack, então braços passam um pouco do ponto e se acomodam.
export const poseAt = (t: number, track: [number, string][]): {pose: Pose; name: string} => {
	let i = 0;
	while (i + 1 < track.length && track[i + 1][0] <= t) i++;
	const [t1, name] = track[i];
	if (i === 0 || t < t1) return {pose: POSES[track[0][1]], name: track[0][1]};
	const k = E.outBack(Math.min(1, (t - t1) / 0.42));
	return {pose: blend(POSES[track[i - 1][1]], POSES[name], k), name};
};

// ---------------------------------------------------------------------------

export type CharacterProps = {
	spec: Spec;
	x: number;
	y: number;
	scale: number;
	pose: Pose;
	t: number;
	seed: number;
	heat: number;
	shiver: number;
	look: number;
	facing: number;
	walk: number;
	walkPhase: number;
	opacity: number;
};

const Arm: React.FC<{side: number; a1: number; a2: number; sx: number; sy: number; top: string; skin: string}> = ({
	side,
	a1,
	a2,
	sx,
	sy,
	top,
	skin,
}) => {
	const r1 = (a1 * Math.PI) / 180;
	const r2 = ((a1 + a2) * Math.PI) / 180;
	const ex = sx + side * Math.sin(r1) * 62;
	const ey = sy + Math.cos(r1) * 62;
	const hx = ex + side * Math.sin(r2) * 58;
	const hy = ey + Math.cos(r2) * 58;
	return (
		<g>
			<line x1={ex} y1={ey} x2={hx} y2={hy} stroke={skin} strokeWidth={20} strokeLinecap="round" />
			<line x1={sx} y1={sy} x2={ex} y2={ey} stroke={top} strokeWidth={26} strokeLinecap="round" />
			<circle cx={hx} cy={hy} r={13} fill={skin} />
		</g>
	);
};

export const Character: React.FC<CharacterProps> = ({
	spec,
	x,
	y,
	scale,
	pose,
	t,
	seed,
	heat,
	shiver,
	look,
	facing,
	walk,
	walkPhase,
	opacity,
}) => {
	if (scale <= 0.001 || opacity <= 0) {
		return null;
	}
	const it = idle(t);
	const breathe = Math.sin(it * 2.1 + seed) * 2.2;
	const sway = Math.sin(it * 0.9 + seed * 2) * 1.2;
	const jitter = Math.sin(it * 47 + seed) * 4 * shiver;
	const blink = (it + seed * 0.71) % 3.7 < 0.11 ? 0.15 : 1;
	const fan = Math.sin(it * 13 + seed) * 22 * heat;
	const step = Math.sin(walkPhase) * 26 * walk;
	const bounce = Math.abs(Math.sin(walkPhase)) * 8 * walk;
	const b = spec.build;
	const sw = 50 * b;
	const hw = 42 * b;
	const shoulderY = -268 + pose.shoulder * -1 + breathe * 0.5;
	const lean = pose.lean + sway;

	return (
		<g transform={`translate(${x + jitter} ${y}) scale(${scale * facing} ${scale * spec.height})`} opacity={opacity}>
			<ellipse cx={0} cy={4} rx={70 * b} ry={11} fill={C.ink} opacity={0.12} />
			<g transform={`translate(0 ${-pose.hop - bounce})`}>
				{/* pernas */}
				{[-1, 1].map((s) => (
					<g key={s} transform={`rotate(${s * step} ${s * 18 * b} -120)`}>
						<rect x={s * 18 * b - 15} y={-126} width={30} height={120} rx={14} fill={spec.pants} />
						<ellipse cx={s * 18 * b + s * 6} cy={-6} rx={22} ry={10} fill={C.ink} />
					</g>
				))}
				<g transform={`rotate(${lean} 0 -120)`}>
					{/* braço de trás primeiro, depois tronco, depois braço da frente */}
					<Arm side={-1} a1={pose.aL1} a2={pose.aL2} sx={-(sw - 10)} sy={shoulderY + 12} top={spec.top} skin={spec.skin} />
					<path
						d={`M ${-sw + 14} ${shoulderY} Q ${-sw} ${shoulderY} ${-sw} ${shoulderY + 16} L ${-hw} -118 L ${hw} -118 L ${sw} ${shoulderY + 16} Q ${sw} ${shoulderY} ${sw - 14} ${shoulderY} Z`}
						fill={spec.top}
					/>
					<rect x={-10} y={shoulderY - 14} width={20} height={18} rx={6} fill={spec.skin} />
					<g transform={`translate(0 ${shoulderY - 46}) rotate(${pose.head})`}>
						{spec.hair === 'afro' && (
							<g fill={spec.hairColor}>
								<circle cx={0} cy={-12} r={56} />
								{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
									<circle key={i} cx={Math.cos(i * 0.8) * 52} cy={-12 + Math.sin(i * 0.8) * 52} r={14} />
								))}
							</g>
						)}
						{spec.hair === 'ponytail' && (
							<ellipse cx={-38} cy={-6} rx={15} ry={34} transform="rotate(18 -38 -6)" fill={spec.hairColor} />
						)}
						<circle cx={0} cy={0} r={38} fill={spec.skin} />
						{spec.hair === 'short' && (
							<path d="M -39 -2 C -42 -46 42 -46 39 -2 C 32 -24 -32 -24 -39 -2 Z" fill={spec.hairColor} />
						)}
						{spec.hair === 'ponytail' && (
							<path d="M -40 6 C -46 -50 46 -50 40 -4 C 20 -26 -14 -28 -30 -10 L -32 8 Z" fill={spec.hairColor} />
						)}
						{spec.hair === 'bob' && (
							<path d="M -44 20 C -52 -54 52 -54 44 20 L 32 20 C 34 -12 -34 -12 -32 20 Z" fill={spec.hairColor} />
						)}
						{spec.beard && (
							<path d="M -32 4 C -30 46 30 46 32 4 C 20 22 -20 22 -32 4 Z" fill={spec.hairColor} />
						)}
						<ellipse cx={-13 + look * 7} cy={-2} rx={4.6} ry={4.8 * blink} fill={C.ink} />
						<ellipse cx={13 + look * 7} cy={-2} rx={4.6} ry={4.8 * blink} fill={C.ink} />
						{spec.glasses && (
							<g fill="none" stroke={C.ink} strokeWidth={3}>
								<circle cx={-13 + look * 7} cy={-2} r={10} />
								<circle cx={13 + look * 7} cy={-2} r={10} />
								<line x1={-3 + look * 7} y1={-2} x2={3 + look * 7} y2={-2} />
							</g>
						)}
						{heat > 0.05 &&
							[-18, 4, 26].map((wx, i) => (
								<path
									key={wx}
									d={`M ${wx} ${-62 - (((it * 0.9 + i * 0.33) % 1) * 30)} q 7 -9 0 -18 q -7 -9 0 -18`}
									stroke={C.hot}
									strokeWidth={4}
									fill="none"
									strokeLinecap="round"
									opacity={heat * (1 - ((it * 0.9 + i * 0.33) % 1))}
								/>
							))}
					</g>
					<Arm
						side={1}
						a1={pose.aR1}
						a2={pose.aR2 + fan}
						sx={sw - 10}
						sy={shoulderY + 12}
						top={spec.top}
						skin={spec.skin}
					/>
				</g>
			</g>
		</g>
	);
};
