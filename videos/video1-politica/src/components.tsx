import React, {createContext, useContext} from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame} from 'remotion';
import {C, FONT, FPS, PEOPLE_COLORS} from './theme';

// Todas as cenas trabalham em segundos absolutos da narração,
// para que os tempos venham direto do tempos.json.
export const SceneOffset = createContext(0);

export const useTime = () => {
	const frame = useCurrentFrame();
	const offset = useContext(SceneOffset);
	return (frame + offset) / FPS;
};

export const pop = (t: number, at: number, damping = 13) =>
	t < at ? 0 : spring({frame: (t - at) * FPS, fps: FPS, config: {damping}});

export const ramp = (t: number, from: number, to: number) =>
	interpolate(t, [from, to], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

export const Background: React.FC = () => {
	const t = useTime();
	return (
		<AbsoluteFill
			style={{background: `linear-gradient(180deg, ${C.bg2} 0%, ${C.bg1} 70%)`}}
		>
			<svg width={1080} height={1920} style={{position: 'absolute'}}>
				<circle
					cx={200 + Math.sin(t * 0.4) * 60}
					cy={350 + Math.cos(t * 0.3) * 40}
					r={380}
					fill={C.hot}
					opacity={0.07}
				/>
				<circle
					cx={880 + Math.cos(t * 0.35) * 60}
					cy={1500 + Math.sin(t * 0.25) * 50}
					r={420}
					fill={C.cold}
					opacity={0.07}
				/>
			</svg>
		</AbsoluteFill>
	);
};

export const Title: React.FC<{
	text: string;
	at: number;
	y: number;
	size: number;
	color: string;
	out: number | null;
}> = ({text, at, y, size, color, out}) => {
	const t = useTime();
	const p = pop(t, at);
	const o = out === null ? 1 : 1 - ramp(t, out, out + 0.25);
	return (
		<div
			style={{
				position: 'absolute',
				top: y,
				left: 60,
				right: 60,
				textAlign: 'center',
				fontFamily: FONT,
				fontWeight: 900,
				fontSize: size,
				lineHeight: 1.1,
				color,
				opacity: p * o,
				transform: `translateY(${(1 - p) * 40}px) scale(${0.9 + p * 0.1})`,
				textShadow: '0 6px 24px rgba(0,0,0,0.35)',
			}}
		>
			{text}
		</div>
	);
};

export const Person: React.FC<{
	x: number;
	y: number;
	color: string;
	scale: number;
	shake: number;
}> = ({x, y, color, scale, shake}) => {
	const t = useTime();
	const dx = Math.sin(t * 40) * 6 * shake;
	return (
		<g transform={`translate(${x + dx} ${y}) scale(${scale})`}>
			<ellipse cx={0} cy={66} rx={58} ry={10} fill="#000" opacity={0.25} />
			<rect x={-55} y={-60} width={110} height={125} rx={50} fill={color} />
			<circle cx={0} cy={-105} r={44} fill={color} />
			<circle cx={-14} cy={-108} r={5} fill={C.bg1} />
			<circle cx={14} cy={-108} r={5} fill={C.bg1} />
		</g>
	);
};

export const Bubble: React.FC<{
	x: number;
	y: number;
	text: string;
	color: string;
	p: number;
}> = ({x, y, text, color, p}) => {
	if (p <= 0) {
		return null;
	}
	const w = Math.max(110, text.length * 26 + 40);
	return (
		<g transform={`translate(${x} ${y}) scale(${p})`} opacity={Math.min(1, p)}>
			<rect x={-w / 2} y={-46} width={w} height={80} rx={40} fill={color} />
			<path d="M -12 32 L 0 52 L 12 32 Z" fill={color} />
			<text
				x={0}
				y={8}
				textAnchor="middle"
				fontFamily={FONT}
				fontWeight={800}
				fontSize={40}
				fill={C.bg1}
			>
				{text}
			</text>
		</g>
	);
};

export const AirConditioner: React.FC<{x: number; y: number; w: number}> = ({
	x,
	y,
	w,
}) => {
	const t = useTime();
	return (
		<g transform={`translate(${x} ${y})`}>
			<rect x={-w / 2} y={0} width={w} height={w * 0.3} rx={18} fill="#E8EEF5" />
			<rect
				x={-w / 2 + 20}
				y={w * 0.3 - 26}
				width={w - 40}
				height={10}
				rx={5}
				fill="#B8C6D6"
			/>
			<circle cx={w / 2 - 34} cy={26} r={7} fill={C.green} />
			{[0, 1, 2].map((i) => {
				const k = (t * 0.8 + i / 3) % 1;
				return (
					<path
						key={i}
						d={`M ${-w / 3 + i * (w / 3)} ${w * 0.3 + 10 + k * 90} q 18 18 0 36 q -18 18 0 36`}
						stroke={C.cold}
						strokeWidth={6}
						strokeLinecap="round"
						fill="none"
						opacity={(1 - k) * 0.8}
					/>
				);
			})}
		</g>
	);
};

// Sala com 5 pessoas e um ar-condicionado. Usada nas cenas 02, 03, 04 e 11.
export const PEOPLE_X = [190, 345, 540, 735, 890];
export const PEOPLE_Y = 1080;

export const Room: React.FC<{
	appear: number;
	peopleAt: number[];
	acAt: number;
	bubbles: {text: string; color: string; at: number}[];
	shake: number[];
}> = ({appear, peopleAt, acAt, bubbles, shake}) => {
	const t = useTime();
	const pr = pop(t, appear, 18);
	return (
		<svg width={1080} height={1920} style={{position: 'absolute'}}>
			<g opacity={pr} transform={`translate(0 ${(1 - pr) * 60})`}>
				<rect x={70} y={360} width={940} height={880} rx={36} fill={C.wall} />
				<rect x={70} y={1100} width={940} height={140} rx={0} fill={C.floor} />
				<rect
					x={70}
					y={360}
					width={940}
					height={880}
					rx={36}
					fill="none"
					stroke={C.line}
					strokeWidth={6}
				/>
			</g>
			<g opacity={pop(t, acAt)}>
				<AirConditioner x={540} y={420} w={420} />
			</g>
			{PEOPLE_X.map((x, i) => (
				<Person
					key={i}
					x={x}
					y={PEOPLE_Y}
					color={PEOPLE_COLORS[i]}
					scale={pop(t, peopleAt[i])}
					shake={shake[i]}
				/>
			))}
			{/* alturas alternadas para os balões vizinhos não se sobreporem */}
			{bubbles.map((b, i) => (
				<Bubble
					key={i}
					x={PEOPLE_X[i]}
					y={PEOPLE_Y - (i % 2 === 1 ? 330 : 250)}
					text={b.text}
					color={b.color}
					p={pop(t, b.at)}
				/>
			))}
		</svg>
	);
};

export const Card: React.FC<{
	x: number;
	y: number;
	w: number;
	h: number;
	p: number;
	color: string;
	label: string;
	children: React.ReactNode;
}> = ({x, y, w, h, p, color, label, children}) => (
	<div
		style={{
			position: 'absolute',
			left: x,
			top: y,
			width: w,
			height: h,
			borderRadius: 36,
			background: 'rgba(255,255,255,0.07)',
			border: `5px solid ${color}`,
			display: 'flex',
			alignItems: 'center',
			gap: 36,
			padding: '0 40px',
			boxSizing: 'border-box',
			opacity: Math.min(1, p),
			transform: `translateX(${(1 - p) * 120}px) scale(${0.85 + p * 0.15})`,
		}}
	>
		<svg width={150} height={150} viewBox="-75 -75 150 150" style={{flexShrink: 0}}>
			{children}
		</svg>
		<div
			style={{
				fontFamily: FONT,
				fontWeight: 800,
				fontSize: 50,
				lineHeight: 1.15,
				color: C.ink,
			}}
		>
			{label}
		</div>
	</div>
);
