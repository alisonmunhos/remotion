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

// Título curto de palavra-chave. A frase completa fica na legenda.
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
	if (p * o <= 0) {
		return null;
	}
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
				opacity: Math.min(1, p) * o,
				translate: `0 ${(1 - p) * 40}px`,
				scale: String(0.9 + p * 0.1),
				textShadow: '0 6px 24px rgba(0,0,0,0.35)',
			}}
		>
			{text}
		</div>
	);
};

export type Mood = 'neutral' | 'hot' | 'cold' | 'happy' | 'annoyed';

// Personagem com piscadas, respiração e expressões.
// hot: suando e ofegante · cold: tremendo · annoyed: sobrancelhas franzidas.
export const Person: React.FC<{
	x: number;
	y: number;
	color: string;
	scale: number;
	mood: Mood;
	shake: number;
	look: number;
	seed: number;
}> = ({x, y, color, scale, mood, shake, look, seed}) => {
	const t = useTime();
	if (scale <= 0) {
		return null;
	}
	const shiver = mood === 'cold' ? 0.6 : 0;
	const dx = Math.sin(t * 45 + seed) * 6 * Math.max(shake, shiver);
	const bob = Math.sin(t * 2.2 + seed) * 4;
	const blink = (t + seed * 0.77) % 3.4 < 0.12 ? 0.1 : 1;
	const px = look * 6;
	const sweat = (t * 1.3 + seed * 0.3) % 1;
	return (
		<g transform={`translate(${x + dx} ${y + bob}) scale(${scale})`}>
			<ellipse cx={0} cy={66 - bob} rx={58} ry={10} fill="#000" opacity={0.25} />
			<rect x={-55} y={-60} width={110} height={125} rx={50} fill={color} />
			<circle cx={0} cy={-108} r={48} fill={color} />
			{mood === 'hot' && (
				<>
					<circle cx={-26} cy={-92} r={9} fill="#FF5A5A" opacity={0.55} />
					<circle cx={26} cy={-92} r={9} fill="#FF5A5A" opacity={0.55} />
					<path
						d={`M 34 ${-140 + sweat * 50} q 7 12 0 18 q -7 -6 0 -18 Z`}
						fill="#BFE9FF"
						opacity={1 - sweat}
					/>
					{[-22, 0, 22].map((wx, i) => (
						<path
							key={wx}
							d={`M ${wx} -175 q 8 -10 0 -20 q -8 -10 0 -20`}
							stroke={C.hot}
							strokeWidth={5}
							fill="none"
							strokeLinecap="round"
							opacity={0.5 + Math.sin(t * 6 + i) * 0.3}
						/>
					))}
				</>
			)}
			{mood === 'cold' && (
				<>
					<path d="M -78 -120 l -14 -6 M -80 -100 l -16 0 M -78 -80 l -14 6" stroke={C.cold} strokeWidth={5} strokeLinecap="round" />
					<path d="M 78 -120 l 14 -6 M 80 -100 l 16 0 M 78 -80 l 14 6" stroke={C.cold} strokeWidth={5} strokeLinecap="round" />
				</>
			)}
			{mood === 'annoyed' && (
				<>
					<path d="M -28 -132 L -6 -124" stroke={C.bg1} strokeWidth={6} strokeLinecap="round" />
					<path d="M 28 -132 L 6 -124" stroke={C.bg1} strokeWidth={6} strokeLinecap="round" />
				</>
			)}
			<ellipse cx={-16 + px} cy={-112} rx={6.5} ry={7.5 * blink} fill={C.bg1} />
			<ellipse cx={16 + px} cy={-112} rx={6.5} ry={7.5 * blink} fill={C.bg1} />
			{mood === 'neutral' && (
				<path d="M -10 -88 L 10 -88" stroke={C.bg1} strokeWidth={5} strokeLinecap="round" />
			)}
			{mood === 'happy' && (
				<path d="M -14 -92 Q 0 -76 14 -92" stroke={C.bg1} strokeWidth={5} fill="none" strokeLinecap="round" />
			)}
			{mood === 'annoyed' && (
				<path d="M -14 -82 Q 0 -94 14 -82" stroke={C.bg1} strokeWidth={5} fill="none" strokeLinecap="round" />
			)}
			{mood === 'hot' && (
				<ellipse cx={0} cy={-86} rx={9} ry={8 + Math.sin(t * 10) * 3} fill={C.bg1} />
			)}
			{mood === 'cold' && (
				<path d="M -14 -88 l 5 -5 l 5 5 l 5 -5 l 5 5 l 5 -5" stroke={C.bg1} strokeWidth={4} fill="none" strokeLinejoin="round" />
			)}
		</g>
	);
};

export const Bubble: React.FC<{
	x: number;
	y: number;
	text: string;
	color: string;
	p: number;
	wobble: number;
}> = ({x, y, text, color, p, wobble}) => {
	const t = useTime();
	if (p <= 0) {
		return null;
	}
	const w = Math.max(120, text.length * 28 + 44);
	const r = Math.sin(t * 18 + x) * 6 * wobble;
	return (
		<g transform={`translate(${x} ${y}) scale(${p}) rotate(${r})`} opacity={Math.min(1, p)}>
			<rect x={-w / 2} y={-48} width={w} height={86} rx={43} fill={color} />
			<path d="M -12 34 L 0 56 L 12 34 Z" fill={color} />
			<text
				x={0}
				y={10}
				textAnchor="middle"
				fontFamily={FONT}
				fontWeight={800}
				fontSize={44}
				fill={C.bg1}
			>
				{text}
			</text>
		</g>
	);
};

export const AirConditioner: React.FC<{
	x: number;
	y: number;
	w: number;
	temp: number | null;
	tempColor: string;
}> = ({x, y, w, temp, tempColor}) => {
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
			{temp !== null && (
				<g>
					<rect x={-w * 0.14} y={w * 0.05} width={w * 0.28} height={w * 0.15} rx={10} fill={C.bg1} />
					<text
						x={0}
						y={w * 0.172}
						textAnchor="middle"
						fontFamily={FONT}
						fontWeight={800}
						fontSize={w * 0.11}
						fill={tempColor}
					>
						{temp}°
					</text>
				</g>
			)}
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

// Controle remoto segurado por uma mão; o polegar aperta quando `press` > 0.
export const Remote: React.FC<{x: number; y: number; scale: number; press: number; temp: number}> = ({
	x,
	y,
	scale,
	press,
	temp,
}) => (
	<g transform={`translate(${x} ${y}) scale(${scale}) rotate(-12)`}>
		<rect x={-70} y={-170} width={140} height={340} rx={50} fill="#E8EEF5" />
		<rect x={-48} y={-140} width={96} height={64} rx={12} fill={C.bg1} />
		<text x={0} y={-94} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={42} fill={C.cold}>
			{temp}°
		</text>
		<circle cx={0} cy={-20} r={30} fill={C.hot} />
		<circle cx={-30} cy={50} r={16} fill="#B8C6D6" />
		<circle cx={30} cy={50} r={16} fill="#B8C6D6" />
		<circle cx={-30} cy={100} r={16} fill="#B8C6D6" />
		<circle cx={30} cy={100} r={16} fill="#B8C6D6" />
		{/* mão */}
		<rect x={-96} y={20} width={192} height={230} rx={80} fill="#F4B48A" />
		<ellipse cx={8} cy={-10 + press * 10} rx={34} ry={56} fill="#E9A47A" transform={`rotate(${-20 + press * 8})`} />
	</g>
);

// Sala com 5 pessoas e um ar-condicionado. Usada nas cenas 02, 03, 04 e 11.
export const PEOPLE_X = [175, 342, 540, 738, 905];
export const PEOPLE_Y = 1130;
export const ROOM = {x: 40, y: 330, w: 1000, h: 980};

export type RoomPerson = {at: number; mood: Mood; look: number; shake: number};

export const Room: React.FC<{
	appear: number;
	acAt: number;
	acTemp: number | null;
	people: RoomPerson[];
	bubbles: {text: string; color: string; at: number}[];
	wobble: number;
}> = ({appear, acAt, acTemp, people, bubbles, wobble}) => {
	const t = useTime();
	const pr = pop(t, appear, 18);
	return (
		<svg width={1080} height={1920} style={{position: 'absolute'}}>
			<g opacity={pr} transform={`translate(0 ${(1 - pr) * 60})`}>
				<rect x={ROOM.x} y={ROOM.y} width={ROOM.w} height={ROOM.h} rx={40} fill={C.wall} />
				<rect x={ROOM.x} y={1180} width={ROOM.w} height={ROOM.y + ROOM.h - 1180} fill={C.floor} />
				<rect
					x={ROOM.x}
					y={ROOM.y}
					width={ROOM.w}
					height={ROOM.h}
					rx={40}
					fill="none"
					stroke={C.line}
					strokeWidth={6}
				/>
			</g>
			<g opacity={pop(t, acAt)}>
				<AirConditioner
					x={540}
					y={390}
					w={460}
					temp={acTemp}
					tempColor={acTemp !== null && acTemp >= 22 ? C.hot : C.cold}
				/>
			</g>
			{PEOPLE_X.map((x, i) => (
				<Person
					key={i}
					x={x}
					y={PEOPLE_Y}
					color={PEOPLE_COLORS[i]}
					scale={1.2 * pop(t, people[i].at)}
					mood={people[i].mood}
					shake={people[i].shake}
					look={people[i].look}
					seed={i * 1.37}
				/>
			))}
			{/* alturas alternadas para os balões vizinhos não se sobreporem */}
			{bubbles.map((b, i) => (
				<Bubble
					key={i}
					x={PEOPLE_X[i]}
					y={PEOPLE_Y - (i % 2 === 1 ? 380 : 290)}
					text={b.text}
					color={b.color}
					p={pop(t, b.at)}
					wobble={wobble}
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
			translate: `${(1 - p) * 120}px 0`,
			scale: String(0.85 + p * 0.15),
		}}
	>
		<svg width={170} height={170} viewBox="-75 -75 150 150" style={{flexShrink: 0}}>
			{children}
		</svg>
		<div
			style={{
				fontFamily: FONT,
				fontWeight: 800,
				fontSize: 58,
				lineHeight: 1.1,
				color: C.ink,
			}}
		>
			{label}
		</div>
	</div>
);
