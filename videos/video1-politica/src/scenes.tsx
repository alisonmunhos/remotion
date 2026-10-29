import React from 'react';
import {interpolate, interpolateColors} from 'remotion';
import {
	AirConditioner,
	Card,
	Mood,
	Person,
	PEOPLE_X,
	pop,
	ramp,
	Remote,
	Room,
	RoomPerson,
	ROOM,
	Title,
	useTime,
} from './components';
import {
	Ballot,
	Coin,
	Crown,
	Dome,
	Flags,
	Flame,
	Health,
	Magnifier,
	School,
	Thermometer,
} from './icons';
import {C, FONT, PEOPLE_COLORS} from './theme';

// Os números (em segundos) são o início das palavras no tempos.json.
// Os títulos trazem só palavras-chave: a frase completa já está na legenda.

const svgStyle: React.CSSProperties = {position: 'absolute'};

// Preferências da sala: duas querem 18° (estão com calor), uma quer 25° (está com frio)
// e duas não se importam.
const PREFS = (at: number) => [
	{text: '18°', color: C.cold, at},
	{text: '18°', color: C.cold, at: at + 0.05},
	{text: '25°', color: C.hot, at: at + 0.1},
	{text: 'tanto faz', color: C.muted, at: at + 0.15},
	{text: 'tanto faz', color: C.muted, at: at + 0.2},
];

const person = (at: number, mood: Mood, look = 0, shake = 0): RoomPerson => ({at, mood, look, shake});

// 01 — "Quem sente mais calor deve decidir a temperatura do ar-condicionado?"
// Gancho: o controle remoto baixando a temperatura, e logo duas pessoas em conflito.
export const Scene01: React.FC = () => {
	const t = useTime();
	const presses = [0.15, 0.45, 0.75];
	const temp = t < 0.15 ? 25 : t < 0.45 ? 22 : t < 0.75 ? 20 : 18;
	const press = Math.max(...presses.map((p) => (t >= p && t < p + 0.18 ? 1 : 0)));
	const remoteOut = ramp(t, 0.95, 1.25);
	const split = pop(t, 1.02, 16);
	const look = interpolate(t, [1.9, 2.2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<>
			<svg width={1080} height={1920} style={svgStyle}>
				<rect x={0} y={0} width={540 * split} height={1920} fill={C.hot} opacity={0.16} />
				<rect x={1080 - 540 * split} y={0} width={540 * split} height={1920} fill={C.cold} opacity={0.16} />
				<AirConditioner x={540} y={360} w={640} temp={temp} tempColor={C.cold} />
				{remoteOut < 1 && (
					<g transform={`translate(0 ${remoteOut * 900})`}>
						<Remote x={560} y={1050} scale={1.5} press={press} temp={temp} />
					</g>
				)}
				<Person x={290} y={1130} color={PEOPLE_COLORS[2]} scale={1.9 * split} mood="hot" shake={0} look={look} seed={0} />
				<Person x={790} y={1130} color={PEOPLE_COLORS[0]} scale={1.9 * split} mood="cold" shake={0} look={-look} seed={1} />
				<g transform={`translate(540 1080) scale(${1.6 * pop(t, 1.82)})`}>
					<Thermometer level={0.25 + Math.sin(t * 5) * 0.2} color={C.cold} />
				</g>
			</svg>
			<Title text="QUEM DECIDE?" at={1.34} y={140} size={124} color={C.yellow} out={null} />
		</>
	);
};

// 02 — "Pensa numa sala com cinco pessoas e um único ar-condicionado..."
export const Scene02: React.FC = () => {
	const t = useTime();
	const prefs = PREFS(0);
	const stuck = t >= 10.58;
	return (
		<>
			<Room
				appear={3.3}
				acAt={5.39}
				acTemp={null}
				people={[
					person(4.24, stuck ? 'annoyed' : t >= 6.91 ? 'hot' : 'neutral', stuck ? 1 : 0),
					person(4.34, stuck ? 'annoyed' : t >= 7.0 ? 'hot' : 'neutral', stuck ? 1 : 0),
					person(4.44, stuck ? 'annoyed' : t >= 8.29 ? 'cold' : 'neutral', stuck ? -1 : 0),
					person(4.54, t >= 9.5 ? 'happy' : 'neutral', stuck ? -1 : 0),
					person(4.64, t >= 9.6 ? 'happy' : 'neutral', stuck ? -1 : 0),
				]}
				bubbles={[
					{...prefs[0], at: 6.91},
					{...prefs[1], at: 7.0},
					{...prefs[2], at: 8.29},
					{...prefs[3], at: 9.5},
					{...prefs[4], at: 9.6},
				]}
				wobble={0}
			/>
			<Title text="?" at={10.58} y={90} size={220} color={C.yellow} out={null} />
		</>
	);
};

// 03 — "Parece uma discussão boba, mas repara no que tá acontecendo."
export const Scene03: React.FC = () => {
	const t = useTime();
	const sweep = ramp(t, 13.58, 14.5);
	return (
		<>
			<Room
				appear={0}
				acAt={0}
				acTemp={null}
				people={[
					person(0, 'annoyed', 1, 0.3),
					person(0, 'annoyed', 1, 0.3),
					person(0, 'annoyed', -1, 0.3),
					person(0, 'neutral', -1),
					person(0, 'neutral', -1),
				]}
				bubbles={PREFS(0)}
				wobble={1}
			/>
			<svg width={1080} height={1920} style={svgStyle}>
				<g
					opacity={pop(t, 13.42)}
					transform={`translate(${interpolate(sweep, [0, 1], [180, 900])} ${960 - Math.sin(sweep * Math.PI) * 140}) scale(2.6)`}
				>
					<Magnifier />
				</g>
			</svg>
			<Title text="Boba?" at={12.77} y={130} size={110} color={C.ink} out={null} />
		</>
	);
};

// 04 — "Todo mundo divide o mesmo espaço, mas cada pessoa tem uma preferência..."
export const Scene04: React.FC = () => {
	const t = useTime();
	const acTemp = t < 18.4 ? 21 : 25;
	const hit = t >= 19.1;
	return (
		<>
			<Room
				appear={0}
				acAt={0}
				acTemp={acTemp}
				people={[
					person(0, hit ? 'hot' : 'neutral', 0, hit ? 0.4 : 0),
					person(0, hit ? 'hot' : 'neutral', 0, hit ? 0.4 : 0),
					person(0, t >= 18.4 ? 'happy' : 'neutral', 0),
					person(0, hit ? 'annoyed' : 'neutral', 0),
					person(0, hit ? 'annoyed' : 'neutral', 0),
				]}
				bubbles={[
					{text: '18°', color: C.cold, at: 16.45},
					{text: '19°', color: C.cold, at: 16.55},
					{text: '25°', color: C.hot, at: 16.65},
					{text: '22°', color: C.yellow, at: 16.75},
					{text: '21°', color: C.green, at: 16.85},
				]}
				wobble={0}
			/>
			<svg width={1080} height={1920} style={svgStyle}>
				<rect
					x={ROOM.x}
					y={ROOM.y}
					width={ROOM.w}
					height={ROOM.h}
					rx={40}
					fill="none"
					stroke={C.yellow}
					strokeWidth={12}
					opacity={pop(t, 15.71) * (1 - ramp(t, 16.3, 16.6))}
				/>
				{t > 18.4 &&
					[0, 0.4, 0.8].map((d) => {
						const k = (((t - 18.4) + d) % 1.2) / 1.2;
						return (
							<ellipse
								key={d}
								cx={540}
								cy={470}
								rx={120 + k * 520}
								ry={60 + k * 300}
								fill="none"
								stroke={C.hot}
								strokeWidth={8}
								opacity={(1 - k) * 0.7}
							/>
						);
					})}
			</svg>
			<Title text="1 espaço" at={15.71} y={150} size={110} color={C.yellow} out={16.5} />
			<Title text="5 preferências" at={16.61} y={150} size={100} color={C.ink} out={18.0} />
			<Title text="1 decisão → todos" at={18.14} y={150} size={96} color={C.hot} out={null} />
		</>
	);
};

// 05 — "Vamos imaginar que cada pessoa esteja presa a um elástico..."
export const Scene05: React.FC = () => {
	const t = useTime();
	const temp = interpolate(t, [19.87, 23.2, 24.4, 25.6, 26.4], [21, 21, 18, 18, 25], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const prefs = [18, 18, 25, null, null];
	const tempColor = interpolateColors(temp, [18, 25], [C.cold, C.hot]);
	const elastic = pop(t, 21.98, 20);
	const baseY = 1230;
	const anchorY = 560;
	return (
		<>
			<Title text="Elástico = desconforto" at={20.11} y={140} size={84} color={C.ink} out={null} />
			<svg width={1080} height={1920} style={svgStyle}>
				<g opacity={pop(t, 20.5)}>
					<rect x={340} y={330} width={400} height={230} rx={44} fill="#E8EEF5" />
					<text
						x={540}
						y={490}
						textAnchor="middle"
						fontFamily={FONT}
						fontWeight={900}
						fontSize={140}
						fill={tempColor}
					>
						{Math.round(temp)}°
					</text>
				</g>
				{PEOPLE_X.map((x, i) => {
					const pref = prefs[i];
					const tension =
						pref === null ? 0.08 : Math.min(1, Math.abs(temp - pref) / 7);
					const headY = baseY - 170;
					const sag = (1 - tension) * 180 + Math.sin(t * 8 + i) * 12 * (1 - tension);
					const midX = (x + 540) / 2;
					const midY = (headY + anchorY) / 2 + sag;
					const color = interpolateColors(tension, [0, 0.5, 1], [C.green, C.yellow, '#FF4D4D']);
					const mood: Mood =
						pref === null
							? 'neutral'
							: tension > 0.5
								? temp > pref
									? 'hot'
									: 'cold'
								: tension < 0.15
									? 'happy'
									: 'neutral';
					return (
						<g key={i}>
							<path
								d={`M ${x} ${headY} Q ${midX} ${midY} 540 ${anchorY}`}
								stroke={color}
								strokeWidth={18 - 11 * tension}
								strokeLinecap="round"
								fill="none"
								strokeDasharray={1500}
								strokeDashoffset={1500 * (1 - elastic)}
							/>
							<Person
								x={x}
								y={baseY + 40}
								color={PEOPLE_COLORS[i]}
								scale={1.2 * pop(t, 19.87 + i * 0.08)}
								mood={mood}
								shake={tension > 0.6 ? tension * 0.5 : 0}
								look={0}
								seed={i * 1.37}
							/>
							<text
								x={x}
								y={baseY + 175}
								textAnchor="middle"
								fontFamily={FONT}
								fontWeight={800}
								fontSize={46}
								fill={pref === null ? C.muted : pref < 21 ? C.cold : C.hot}
								opacity={pop(t, 20.82)}
							>
								{pref === null ? '~' : `${pref}°`}
							</text>
						</g>
					);
				})}
			</svg>
		</>
	);
};

// 06 — "Agora, alguém precisa escolher a temperatura..."
export const Scene06: React.FC = () => {
	const t = useTime();
	return (
		<>
			<Title text="3 formas de decidir" at={27.33} y={170} size={96} color={C.yellow} out={null} />
			<Card x={70} y={440} w={940} h={250} p={pop(t, 29.09)} color={C.hot} label="Quem mais sofre com o calor">
				<g transform={`scale(${0.95 + Math.sin(t * 12) * 0.04})`}>
					<Flame />
				</g>
			</Card>
			<Card x={70} y={730} w={940} h={250} p={pop(t, 31.87)} color={C.cold} label="Uma pessoa escolhe">
				<g transform={`translate(0 ${-Math.abs(Math.sin(t * 4)) * 8})`}>
					<Crown />
				</g>
			</Card>
			<Card x={70} y={1020} w={940} h={250} p={pop(t, 33.73)} color={C.green} label="Votação">
				<Ballot />
			</Card>
		</>
	);
};

// 07 — "São maneiras diferentes de resolver o mesmo problema..."
export const Scene07: React.FC = () => {
	const t = useTime();
	const cols = [
		{x: 200, icon: <Flame />, temp: 18, color: C.cold},
		{x: 540, icon: <Crown />, temp: 24, color: C.hot},
		{x: 880, icon: <Ballot />, temp: 21, color: C.yellow},
	];
	const result = pop(t, 38.7);
	return (
		<>
			<Title text="1 problema" at={35.38} y={150} size={96} color={C.ink} out={null} />
			<Title text="3 resultados" at={38.93} y={260} size={96} color={C.yellow} out={null} />
			<svg width={1080} height={1920} style={svgStyle}>
				{cols.map((c, i) => (
					<g key={i}>
						<g transform={`translate(${c.x} 560) scale(${1.3 * pop(t, 35.38 + i * 0.12)})`}>
							{c.icon}
						</g>
						<path
							d={`M ${c.x} 690 L ${c.x} 830`}
							stroke={C.line}
							strokeWidth={10}
							strokeLinecap="round"
							strokeDasharray={140}
							strokeDashoffset={140 * (1 - ramp(t, 36.4 + i * 0.2, 37.4 + i * 0.2))}
						/>
						<path
							d={`M ${c.x - 22} 810 L ${c.x} 840 L ${c.x + 22} 810`}
							stroke={C.line}
							strokeWidth={10}
							strokeLinecap="round"
							fill="none"
							opacity={ramp(t, 37.3 + i * 0.2, 37.5 + i * 0.2)}
						/>
						<g transform={`translate(${c.x} 1010) scale(${1.6 * result})`}>
							<Thermometer level={((c.temp - 15) / 12) * ramp(t, 38.7, 39.3)} color={c.color} />
						</g>
						<text
							x={c.x}
							y={1250}
							textAnchor="middle"
							fontFamily={FONT}
							fontWeight={900}
							fontSize={84}
							fill={c.color}
							opacity={result}
						>
							{c.temp}°
						</text>
					</g>
				))}
			</svg>
		</>
	);
};

// 08 — "Percebe onde eu quero chegar? A política não começa na urna..."
export const Scene08: React.FC = () => {
	const t = useTime();
	const icons = [
		{x: 200, at: 41.98, label: 'urna', icon: <Ballot />},
		{x: 540, at: 42.48, label: 'congresso', icon: <Dome />},
		{x: 880, at: 43.26, label: 'partidos', icon: <Flags />},
	];
	const strike = ramp(t, 44.0, 44.3);
	const iconsOut = 1 - ramp(t, 45.3, 45.7);
	const net = pop(t, 45.6, 18);
	const center = {x: 540, y: 980};
	const R = 330;
	// setas: apontam para fora (interesses diferentes) e depois convergem (uma forma de decidir)
	const outward = pop(t, 48.08);
	const converge = ramp(t, 49.3, 50.2);
	const check = pop(t, 50.53);
	const mood: Mood = check > 0.5 ? 'happy' : outward > 0.5 ? 'annoyed' : 'neutral';
	return (
		<>
			<Title text="Percebe?" at={39.79} y={700} size={150} color={C.yellow} out={40.75} />
			<Title text="Não começa aqui" at={40.93} y={170} size={96} color={C.ink} out={45.2} />
			<Title text="Começa aqui" at={44.59} y={170} size={100} color={C.yellow} out={47.4} />
			<Title text="Interesses diferentes" at={47.62} y={120} size={88} color={C.hot} out={49.1} />
			<Title text="1 forma de decidir" at={49.26} y={170} size={96} color={C.green} out={null} />
			<svg width={1080} height={1920} style={svgStyle}>
				{iconsOut > 0 &&
					icons.map((c) => (
						<g key={c.label} opacity={iconsOut * (1 - strike * 0.6)}>
							<g transform={`translate(${c.x} 640) scale(${1.6 * pop(t, c.at)})`}>{c.icon}</g>
							<text
								x={c.x}
								y={840}
								textAnchor="middle"
								fontFamily={FONT}
								fontWeight={800}
								fontSize={52}
								fill={C.ink}
								opacity={pop(t, c.at)}
							>
								{c.label}
							</text>
						</g>
					))}
				{iconsOut > 0 && strike > 0 && (
					<line
						x1={80}
						y1={700}
						x2={80 + 920 * strike}
						y2={700}
						stroke="#FF4D4D"
						strokeWidth={16}
						strokeLinecap="round"
						opacity={iconsOut}
					/>
				)}
				{net > 0 &&
					PEOPLE_COLORS.map((_, i) => {
						const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
						return PEOPLE_COLORS.map((__, j) => {
							if (j <= i) return null;
							const b = -Math.PI / 2 + (j * 2 * Math.PI) / 5;
							return (
								<line
									key={`${i}-${j}`}
									x1={center.x + Math.cos(a) * R}
									y1={center.y + Math.sin(a) * R}
									x2={center.x + Math.cos(b) * R}
									y2={center.y + Math.sin(b) * R}
									stroke={C.line}
									strokeWidth={6}
									opacity={ramp(t, 46.38, 46.9) * (1 - converge * 0.6)}
								/>
							);
						});
					})}
				{net > 0 &&
					PEOPLE_COLORS.map((color, i) => {
						const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
						const px = center.x + Math.cos(a) * R;
						const py = center.y + Math.sin(a) * R;
						// fora: ângulo da posição + desvio; dentro: aponta para o centro
						const outAngle = a + (i % 2 === 0 ? 0.5 : -0.5);
						const inAngle = a + Math.PI;
						const ang = interpolate(converge, [0, 1], [outAngle, inAngle]);
						const len = 130 * outward * (1 - converge * 0.15);
						const sx = px + Math.cos(ang) * 80;
						const sy = py - 40 + Math.sin(ang) * 80;
						const ex = sx + Math.cos(ang) * len;
						const ey = sy + Math.sin(ang) * len;
						return (
							<g key={`p${i}`}>
								<Person x={px} y={py + 30} color={color} scale={0.85 * net} mood={mood} shake={0} look={0} seed={i * 1.37} />
								{outward > 0.01 && (
									<g>
										<line x1={sx} y1={sy} x2={ex} y2={ey} stroke={C.hot} strokeWidth={10} strokeLinecap="round" />
										<circle cx={ex} cy={ey} r={14} fill={C.hot} />
									</g>
								)}
							</g>
						);
					})}
				{check > 0 && (
					<g transform={`translate(${center.x} ${center.y}) scale(${check})`}>
						<circle r={86} fill={C.green} />
						<path d="M -38 2 L -10 30 L 42 -26" stroke={C.bg1} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
					</g>
				)}
			</svg>
		</>
	);
};

// 09 — "É isso que acontece quando discutimos como usar o dinheiro público..."
export const Scene09: React.FC = () => {
	const t = useTime();
	return (
		<>
			<Title text="Na vida real" at={51.76} y={170} size={100} color={C.ink} out={null} />
			<Card x={70} y={440} w={940} h={250} p={pop(t, 53.33)} color={C.yellow} label="Dinheiro público">
				<g transform={`rotate(${Math.sin(t * 3) * 8})`}>
					<Coin />
				</g>
			</Card>
			<Card x={70} y={730} w={940} h={250} p={pop(t, 54.59)} color={C.hot} label="Escolas">
				<School />
			</Card>
			<Card x={70} y={1020} w={940} h={250} p={pop(t, 55.9)} color={C.cold} label="Saúde">
				<g transform={`scale(${1 + Math.max(0, Math.sin(t * 7)) * 0.06})`}>
					<Health />
				</g>
			</Card>
		</>
	);
};

// 10 — "Isso é política, decidir como organizar a vida em sociedade..."
export const Scene10: React.FC = () => {
	const t = useTime();
	const steps = [
		{at: 61.12, y: 470, text: 'COMO decidimos', color: C.yellow},
		{at: 63.74, y: 810, text: 'o RESULTADO', color: C.cold},
		{at: 64.24, y: 1060, text: 'QUEM é afetado', color: C.hot},
	];
	// tremida de câmera no impacto de "política"
	const impact = t >= 57.79 && t < 58.2 ? (1 - (t - 57.79) / 0.41) * 14 : 0;
	return (
		<div style={{position: 'absolute', inset: 0, translate: `${Math.sin(t * 90) * impact}px ${Math.cos(t * 70) * impact}px`}}>
			<Title text="ISSO É POLÍTICA" at={57.79} y={560} size={140} color={C.yellow} out={60.2} />
			<Title text="organizar a vida em sociedade" at={58.56} y={900} size={64} color={C.ink} out={60.2} />
			<Title text="A forma importa" at={60.72} y={170} size={100} color={C.ink} out={null} />
			<svg width={1080} height={1920} style={svgStyle}>
				<path d="M 540 640 L 540 790" stroke={C.line} strokeWidth={12} strokeLinecap="round" opacity={ramp(t, 63.17, 63.5)} />
				<path
					d="M 516 768 L 540 796 L 564 768"
					stroke={C.line}
					strokeWidth={12}
					strokeLinecap="round"
					fill="none"
					opacity={ramp(t, 63.4, 63.6)}
				/>
			</svg>
			{steps.map((s) => {
				const p = pop(t, s.at);
				if (p <= 0) {
					return null;
				}
				return (
					<div
						key={s.text}
						style={{
							position: 'absolute',
							left: 110,
							right: 110,
							top: s.y,
							height: 180,
							borderRadius: 90,
							border: `6px solid ${s.color}`,
							background: 'rgba(255,255,255,0.06)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontFamily: FONT,
							fontWeight: 900,
							fontSize: 70,
							color: s.color,
							opacity: Math.min(1, p),
							scale: String(0.8 + 0.2 * p),
						}}
					>
						{s.text}
					</div>
				);
			})}
		</div>
	);
};

// 11 — "Agora volta pra aquela sala. Quem deveria decidir a temperatura e por quê?..."
export const Scene11: React.FC = () => {
	const t = useTime();
	const roomOut = 1 - ramp(t, 69.3, 69.7);
	const prefs = PREFS(66.42);
	return (
		<>
			{roomOut > 0 && (
				<div style={{position: 'absolute', inset: 0, opacity: roomOut}}>
					<Room
						appear={65.54}
						acAt={65.7}
						acTemp={null}
						people={[
							person(65.9, 'hot', 0),
							person(65.95, 'hot', 0),
							person(66.0, 'cold', 0),
							person(66.05, 'neutral', 0),
							person(66.1, 'neutral', 0),
						]}
						bubbles={prefs}
						wobble={0}
					/>
					<Title text="Quem decide?" at={67.02} y={150} size={110} color={C.yellow} out={68.55} />
					<Title text="E por quê?" at={68.72} y={150} size={110} color={C.ink} out={null} />
				</div>
			)}
			<Title text="No próximo vídeo" at={69.49} y={560} size={72} color={C.muted} out={null} />
			<Title text="Com base em quê a gente decide?" at={72.11} y={700} size={110} color={C.yellow} out={null} />
		</>
	);
};
