import React from 'react';
import {interpolate, interpolateColors} from 'remotion';
import {
	AirConditioner,
	Card,
	Person,
	PEOPLE_X,
	PEOPLE_Y,
	pop,
	ramp,
	Room,
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

const svgStyle: React.CSSProperties = {position: 'absolute'};

const NO_SHAKE = [0, 0, 0, 0, 0];

// Preferências da sala: duas querem 18°, uma 25° e duas não se importam.
const PREFS = (at: number) => [
	{text: '18°', color: C.cold, at},
	{text: '18°', color: C.cold, at: at + 0.05},
	{text: '25°', color: C.hot, at: at + 0.1},
	{text: 'tanto faz', color: C.muted, at: at + 0.15},
	{text: 'tanto faz', color: C.muted, at: at + 0.2},
];

// 01 — "Quem sente mais calor deve decidir a temperatura do ar-condicionado?"
export const Scene01: React.FC = () => {
	const t = useTime();
	const level = 0.5 + Math.sin(t * 3) * 0.35;
	const color = interpolateColors(level, [0.15, 0.85], [C.cold, C.hot]);
	return (
		<>
			<Title text="Quem decide a temperatura?" at={1.34} y={220} size={92} color={C.ink} out={null} />
			<svg width={1080} height={1920} style={svgStyle}>
				<g opacity={pop(t, 0)} transform={`translate(0 ${(1 - pop(t, 0)) * 80})`}>
					<AirConditioner x={540} y={560} w={640} />
				</g>
				<g transform={`translate(540 1040) scale(${2.6 * pop(t, 0.69)})`}>
					<Thermometer level={level} color={color} />
				</g>
				<g transform={`translate(250 1060) scale(${1.4 * pop(t, 0.69)})`}>
					<Flame />
				</g>
				<g
					transform={`translate(830 1060) scale(${1.4 * pop(t, 1.82)}) rotate(${t * 40})`}
				>
					{[0, 60, 120].map((r) => (
						<rect key={r} x={-6} y={-60} width={12} height={120} rx={6} fill={C.cold} transform={`rotate(${r})`} />
					))}
				</g>
			</svg>
		</>
	);
};

// 02 — "Pensa numa sala com cinco pessoas e um único ar-condicionado..."
export const Scene02: React.FC = () => {
	const prefs = PREFS(0);
	return (
		<>
			<Room
				appear={3.3}
				peopleAt={[4.24, 4.34, 4.44, 4.54, 4.64]}
				acAt={5.39}
				bubbles={[
					{...prefs[0], at: 6.91},
					{...prefs[1], at: 7.0},
					{...prefs[2], at: 8.29},
					{...prefs[3], at: 9.5},
					{...prefs[4], at: 9.6},
				]}
				shake={NO_SHAKE}
			/>
			<Title text="E agora?" at={10.58} y={170} size={110} color={C.yellow} out={11.2} />
			<Title text="Como vocês decidem?" at={11.26} y={190} size={84} color={C.yellow} out={null} />
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
				peopleAt={[0, 0, 0, 0, 0]}
				acAt={0}
				bubbles={PREFS(0)}
				shake={NO_SHAKE}
			/>
			<Title text="Uma discussão boba?" at={12.38} y={190} size={84} color={C.ink} out={null} />
			<svg width={1080} height={1920} style={svgStyle}>
				<g
					opacity={pop(t, 13.42)}
					transform={`translate(${interpolate(sweep, [0, 1], [200, 880])} ${940 - Math.sin(sweep * Math.PI) * 120}) scale(2.4)`}
				>
					<Magnifier />
				</g>
			</svg>
		</>
	);
};

// 04 — "Todo mundo divide o mesmo espaço, mas cada pessoa tem uma preferência..."
export const Scene04: React.FC = () => {
	const t = useTime();
	const ripple = (t - 18.4) % 1.2;
	const hit = ramp(t, 19.1, 19.3) * (1 - ramp(t, 19.6, 19.9));
	return (
		<>
			<Room
				appear={0}
				peopleAt={[0, 0, 0, 0, 0]}
				acAt={0}
				bubbles={[
					{text: '18°', color: C.cold, at: 16.45},
					{text: '19°', color: C.cold, at: 16.55},
					{text: '25°', color: C.hot, at: 16.65},
					{text: '22°', color: C.yellow, at: 16.75},
					{text: '21°', color: C.green, at: 16.85},
				]}
				shake={[hit, hit, 0, hit, hit]}
			/>
			<svg width={1080} height={1920} style={svgStyle}>
				<rect
					x={70}
					y={360}
					width={940}
					height={880}
					rx={36}
					fill="none"
					stroke={C.yellow}
					strokeWidth={10}
					opacity={pop(t, 15.71) * (1 - ramp(t, 16.3, 16.6))}
				/>
				{t > 18.4 &&
					[0, 0.4, 0.8].map((d) => {
						const k = ((ripple + d) % 1.2) / 1.2;
						return (
							<circle
								key={d}
								cx={PEOPLE_X[2]}
								cy={PEOPLE_Y - 30}
								r={60 + k * 420}
								fill="none"
								stroke={C.hot}
								strokeWidth={8}
								opacity={(1 - k) * 0.8}
							/>
						);
					})}
			</svg>
			<Title text="O mesmo espaço" at={15.71} y={190} size={84} color={C.yellow} out={18.0} />
			<Title text="Uma decisão afeta todos" at={18.14} y={190} size={80} color={C.hot} out={null} />
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
	const baseY = 1180;
	return (
		<>
			<Title text="Imagine um elástico" at={20.11} y={170} size={84} color={C.ink} out={null} />
			<svg width={1080} height={1920} style={svgStyle}>
				<g opacity={pop(t, 20.5)}>
					<rect x={360} y={340} width={360} height={200} rx={40} fill="#E8EEF5" />
					<text
						x={540}
						y={480}
						textAnchor="middle"
						fontFamily={FONT}
						fontWeight={900}
						fontSize={120}
						fill={tempColor}
					>
						{Math.round(temp)}°
					</text>
				</g>
				{PEOPLE_X.map((x, i) => {
					const pref = prefs[i];
					const tension =
						pref === null ? 0.08 : Math.min(1, Math.abs(temp - pref) / 7);
					const headY = baseY - 150;
					const sag = (1 - tension) * 160;
					const midX = (x + 540) / 2;
					const midY = (headY + 540) / 2 + sag;
					const color = interpolateColors(tension, [0, 0.5, 1], [C.green, C.yellow, '#FF4D4D']);
					return (
						<g key={i}>
							<path
								d={`M ${x} ${headY} Q ${midX} ${midY} 540 545`}
								stroke={color}
								strokeWidth={16 - 10 * tension}
								strokeLinecap="round"
								fill="none"
								strokeDasharray={1400}
								strokeDashoffset={1400 * (1 - elastic)}
							/>
							<Person
								x={x}
								y={baseY + 40}
								color={PEOPLE_COLORS[i]}
								scale={pop(t, 19.87 + i * 0.08)}
								shake={tension > 0.6 ? tension * 0.5 : 0}
							/>
							<text
								x={x}
								y={baseY + 160}
								textAnchor="middle"
								fontFamily={FONT}
								fontWeight={800}
								fontSize={40}
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
			<Title text="Quem escolhe?" at={27.33} y={200} size={96} color={C.yellow} out={null} />
			<Card x={90} y={470} w={900} h={230} p={pop(t, 29.09)} color={C.hot} label="Quem mais sofre com o calor">
				<g transform="scale(0.95)">
					<Flame />
				</g>
			</Card>
			<Card x={90} y={750} w={900} h={230} p={pop(t, 31.87)} color={C.cold} label="Uma pessoa decide">
				<Crown />
			</Card>
			<Card x={90} y={1030} w={900} h={230} p={pop(t, 33.73)} color={C.green} label="Votação">
				<Ballot />
			</Card>
		</>
	);
};

// 07 — "São maneiras diferentes de resolver o mesmo problema..."
export const Scene07: React.FC = () => {
	const t = useTime();
	const cols = [
		{x: 220, icon: <Flame />, temp: 18, color: C.cold},
		{x: 540, icon: <Crown />, temp: 24, color: C.hot},
		{x: 860, icon: <Ballot />, temp: 21, color: C.yellow},
	];
	const result = pop(t, 38.7);
	return (
		<>
			<Title text="Caminhos diferentes" at={35.38} y={170} size={84} color={C.ink} out={null} />
			<Title text="resultados diferentes" at={38.93} y={270} size={70} color={C.yellow} out={null} />
			<svg width={1080} height={1920} style={svgStyle}>
				{cols.map((c, i) => (
					<g key={i}>
						<g transform={`translate(${c.x} 560) scale(${1.15 * pop(t, 35.38 + i * 0.12)})`}>
							{c.icon}
						</g>
						<path
							d={`M ${c.x} 680 L ${c.x} 820`}
							stroke={C.line}
							strokeWidth={10}
							strokeLinecap="round"
							strokeDasharray={140}
							strokeDashoffset={140 * (1 - ramp(t, 36.4 + i * 0.2, 37.4 + i * 0.2))}
						/>
						<path
							d={`M ${c.x - 22} 800 L ${c.x} 830 L ${c.x + 22} 800`}
							stroke={C.line}
							strokeWidth={10}
							strokeLinecap="round"
							fill="none"
							opacity={ramp(t, 37.3 + i * 0.2, 37.5 + i * 0.2)}
						/>
						<g transform={`translate(${c.x} 990) scale(${1.4 * result})`}>
							<Thermometer level={(c.temp - 15) / 12} color={c.color} />
						</g>
						<text
							x={c.x}
							y={1200}
							textAnchor="middle"
							fontFamily={FONT}
							fontWeight={900}
							fontSize={72}
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
		{x: 220, at: 41.98, label: 'urna', icon: <Ballot />},
		{x: 540, at: 42.48, label: 'congresso', icon: <Dome />},
		{x: 860, at: 43.26, label: 'partidos', icon: <Flags />},
	];
	const strike = ramp(t, 44.0, 44.4);
	const iconsOut = 1 - ramp(t, 45.3, 45.7);
	const net = pop(t, 45.6, 18);
	const center = {x: 540, y: 960};
	const R = 300;
	// setas: apontam para fora (interesses diferentes) e depois convergem (uma forma de decidir)
	const outward = pop(t, 48.08);
	const converge = ramp(t, 49.3, 50.2);
	const check = pop(t, 50.53);
	return (
		<>
			<Title text="Percebe onde eu quero chegar?" at={39.79} y={700} size={96} color={C.yellow} out={40.75} />
			<Title text="A política não começa…" at={40.93} y={200} size={84} color={C.ink} out={44.3} />
			<Title text="Começa quando decidimos algo que afeta os outros" at={44.59} y={170} size={66} color={C.yellow} out={47.4} />
			<Title text="Interesses diferentes" at={47.62} y={200} size={84} color={C.hot} out={49.1} />
			<Title text="Precisamos de uma forma de decidir" at={49.26} y={170} size={72} color={C.green} out={null} />
			<svg width={1080} height={1920} style={svgStyle}>
				{iconsOut > 0 &&
					icons.map((c) => (
						<g key={c.label} opacity={iconsOut * (1 - strike * 0.6)}>
							<g transform={`translate(${c.x} 620) scale(${1.4 * pop(t, c.at)})`}>{c.icon}</g>
							<text
								x={c.x}
								y={790}
								textAnchor="middle"
								fontFamily={FONT}
								fontWeight={800}
								fontSize={46}
								fill={C.ink}
								opacity={pop(t, c.at)}
							>
								{c.label}
							</text>
						</g>
					))}
				{iconsOut > 0 && (
					<line
						x1={100}
						y1={680}
						x2={100 + 880 * strike}
						y2={680}
						stroke="#FF4D4D"
						strokeWidth={14}
						strokeLinecap="round"
						opacity={iconsOut}
					/>
				)}
				{net > 0 &&
					PEOPLE_COLORS.map((color, i) => {
						const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
						const px = center.x + Math.cos(a) * R;
						const py = center.y + Math.sin(a) * R;
						return (
							<g key={i}>
								{PEOPLE_COLORS.map((_, j) => {
									if (j <= i) return null;
									const b = -Math.PI / 2 + (j * 2 * Math.PI) / 5;
									return (
										<line
											key={j}
											x1={px}
											y1={py}
											x2={center.x + Math.cos(b) * R}
											y2={center.y + Math.sin(b) * R}
											stroke={C.line}
											strokeWidth={6}
											opacity={ramp(t, 46.38, 46.9) * (1 - converge * 0.6)}
										/>
									);
								})}
							</g>
						);
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
						const len = 120 * outward * (1 - converge * 0.15);
						const sx = px + Math.cos(ang) * 70;
						const sy = py - 40 + Math.sin(ang) * 70;
						const ex = sx + Math.cos(ang) * len;
						const ey = sy + Math.sin(ang) * len;
						return (
							<g key={`p${i}`}>
								<Person x={px} y={py + 30} color={color} scale={0.75 * net} shake={0} />
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
						<circle r={78} fill={C.green} />
						<path d="M -34 2 L -8 28 L 38 -24" stroke={C.bg1} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
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
			<Title text="É isso que acontece quando decidimos…" at={51.76} y={190} size={70} color={C.ink} out={null} />
			<Card x={90} y={470} w={900} h={230} p={pop(t, 53.33)} color={C.yellow} label="Como usar o dinheiro público">
				<Coin />
			</Card>
			<Card x={90} y={750} w={900} h={230} p={pop(t, 54.59)} color={C.hot} label="Quais escolas construir">
				<School />
			</Card>
			<Card x={90} y={1030} w={900} h={230} p={pop(t, 55.9)} color={C.cold} label="Como organizar a saúde">
				<Health />
			</Card>
		</>
	);
};

// 10 — "Isso é política, decidir como organizar a vida em sociedade..."
export const Scene10: React.FC = () => {
	const t = useTime();
	const steps = [
		{at: 61.12, y: 480, text: 'COMO decidimos', color: C.yellow},
		{at: 63.74, y: 800, text: 'o RESULTADO', color: C.cold},
		{at: 64.24, y: 1040, text: 'QUEM é afetado', color: C.hot},
	];
	return (
		<>
			<Title text="ISSO É POLÍTICA" at={57.79} y={560} size={130} color={C.yellow} out={60.2} />
			<Title text="decidir como organizar a vida em sociedade" at={58.56} y={860} size={60} color={C.ink} out={60.2} />
			<Title text="A forma importa" at={60.72} y={200} size={92} color={C.ink} out={null} />
			<svg width={1080} height={1920} style={svgStyle}>
				<path
					d="M 540 620 L 540 770"
					stroke={C.line}
					strokeWidth={12}
					strokeLinecap="round"
					opacity={ramp(t, 63.17, 63.5)}
				/>
				<path
					d="M 516 748 L 540 776 L 564 748"
					stroke={C.line}
					strokeWidth={12}
					strokeLinecap="round"
					fill="none"
					opacity={ramp(t, 63.4, 63.6)}
				/>
			</svg>
			{steps.map((s) => {
				const p = pop(t, s.at);
				return (
					<div
						key={s.text}
						style={{
							position: 'absolute',
							left: 140,
							right: 140,
							top: s.y,
							height: 170,
							borderRadius: 85,
							border: `6px solid ${s.color}`,
							background: 'rgba(255,255,255,0.06)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontFamily: FONT,
							fontWeight: 900,
							fontSize: 64,
							color: s.color,
							opacity: Math.min(1, p),
							transform: `scale(${0.8 + 0.2 * p})`,
						}}
					>
						{s.text}
					</div>
				);
			})}
		</>
	);
};

// 11 — "Agora volta pra aquela sala. Quem deveria decidir a temperatura e por quê?..."
export const Scene11: React.FC = () => {
	const t = useTime();
	const roomOut = 1 - ramp(t, 69.3, 69.7);
	return (
		<>
			{roomOut > 0 && (
				<div style={{position: 'absolute', inset: 0, opacity: roomOut}}>
					<Room
						appear={65.54}
						peopleAt={[65.9, 65.95, 66.0, 66.05, 66.1]}
						acAt={65.7}
						bubbles={PREFS(66.42)}
						shake={NO_SHAKE}
					/>
					<Title text="Quem deveria decidir?" at={67.02} y={170} size={84} color={C.yellow} out={null} />
					<Title text="E por quê?" at={68.72} y={1250} size={84} color={C.ink} out={null} />
				</div>
			)}
			<Title text="No próximo vídeo" at={69.49} y={560} size={70} color={C.muted} out={null} />
			<Title text="Com base em quê a gente decide?" at={72.11} y={700} size={104} color={C.yellow} out={null} />
		</>
	);
};
