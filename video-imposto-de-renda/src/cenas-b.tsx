import React from 'react';
import brasil from './data/brasil.json';
import eua from './data/eua.json';
import {Desenho, Mao, Papel, Pessoa, Rotulo, traco} from './base';
import {Medalhao, Picto} from './cenas-a';
import {C, eback, eio, eo, F, lerp, lin, LW} from './tokens';

type T = {t: number};

const surge = (t: number, t0: number, d = 0.3) => eback(lin(t, t0, t0 + d));
const check = (x: number, y: number, u: number, s = 1) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<Desenho d="M-22,0 L-6,16 L24,-18" u={u} w={9} />
	</g>
);

// ---------------------------------------------------------------------------
// 05 — a declaração: 1x por ano, ganhos e gastos (médico, escola)
export const C05Declaracao: React.FC<T> = ({t}) => (
	<Papel t={t} tIn={22.0} tOut={27.15} w={880} h={1000} top={330}>
		<svg width={880} height={1000} viewBox="0 0 880 1000">
			{/* calendário */}
			<g transform="translate(60 120) rotate(-4)" filter="url(#traco)">
				<rect x={0} y={0} width={240} height={250} rx={14} fill={C.creme} {...traco} />
				<rect x={0} y={0} width={240} height={60} rx={14} fill={C.ocre} fillOpacity={0.6} />
				<rect x={0} y={0} width={240} height={60} rx={14} fill="none" {...traco} />
				<path d="M60,-18 v36 M180,-18 v36" {...traco} />
			</g>
			<Mao x={180} y={300} t={t} t0={22.5} size={110} rot={-4}>
				1x
			</Mao>
			<Mao x={180} y={350} t={t} t0={22.66} size={46} rot={-4}>
				por ano
			</Mao>
			{/* formulário */}
			<g transform="translate(360 110) rotate(2)">
				<g filter="url(#traco)">
					<rect x={0} y={0} width={460} height={800} rx={10} fill={C.creme} {...traco} />
				</g>
				<text x={36} y={80} style={{fontFamily: F.sans, fontWeight: 900, fontSize: 44}} fill={C.escuro}>
					DECLARAÇÃO
				</text>
				<path d="M36,110 H424" stroke={C.escuro} strokeOpacity={0.35} strokeWidth={2} strokeDasharray="8 8" />
				<text x={36} y={190} style={{fontFamily: F.mono, fontWeight: 800, fontSize: 28, letterSpacing: 3}} fill={C.escuro}>
					GANHOS
				</text>
				<rect x={36} y={215} width={300 * eo(lin(t, 24.6, 25.0))} height={34} rx={6} fill={C.escuro} fillOpacity={0.8} />
				<text x={36} y={340} style={{fontFamily: F.mono, fontWeight: 800, fontSize: 28, letterSpacing: 3}} fill={C.escuro}>
					GASTOS
				</text>
				{t > 26.2 ? (
					<g transform={`translate(70 420) scale(${surge(t, 26.2)})`}>
						<circle r={34} fill={C.roxo} stroke={C.escuro} strokeWidth={5} />
						<g transform="scale(0.8)">
							<Picto tipo="saude" cor={C.creme} />
						</g>
					</g>
				) : null}
				<text x={124} y={436} style={{fontFamily: F.sans, fontWeight: 700, fontSize: 40}} fill={C.escuro} opacity={lin(t, 26.25, 26.4)}>
					médico
				</text>
				{check(400, 420, eo(lin(t, 26.4, 26.6)))}
				{t > 26.66 ? (
					<g transform={`translate(70 520) scale(${surge(t, 26.66)})`}>
						<circle r={34} fill={C.roxo} stroke={C.escuro} strokeWidth={5} />
						<g transform="scale(0.8)">
							<Picto tipo="escola" cor={C.creme} />
						</g>
					</g>
				) : null}
				<text x={124} y={536} style={{fontFamily: F.sans, fontWeight: 700, fontSize: 40}} fill={C.escuro} opacity={lin(t, 26.7, 26.85)}>
					escola
				</text>
				{check(400, 520, eo(lin(t, 26.85, 27.05)))}
				{[640, 700].map((y) => (
					<path key={y} d={`M36,${y} H${y === 640 ? 380 : 300}`} stroke={C.escuro} strokeOpacity={0.25} strokeWidth={5} strokeLinecap="round" />
				))}
			</g>
			<Pessoa x={180} y={960} s={0.85} />
			<path d="M40,960 H340" {...traco} />
			<Desenho d="M250,760 C290,700 320,640 370,610" u={eo(lin(t, 24.05, 24.4))} w={6} />
			<Desenho d="M370,610 l-28,4 M370,610 l-8,26" u={lin(t, 24.38, 24.45)} w={6} />
		</svg>
	</Papel>
);

// ---------------------------------------------------------------------------
// 06 — pagou demais / pagou de menos
const PredioMini: React.FC = () => (
	<g filter="url(#traco)">
		<path d="M-90,-40 L0,-95 L90,-40 Z" fill={C.roxo} fillOpacity={0.3} />
		<path d="M-90,-40 L0,-95 L90,-40 Z" fill="url(#hachuraRoxo)" />
		<path d="M-90,-40 L0,-95 L90,-40 Z" fill="none" {...traco} />
		{[-60, -20, 20, 60].map((x) => (
			<path key={x} d={`M${x},-40 V60`} {...traco} />
		))}
		<path d="M-100,60 H100" {...traco} />
	</g>
);
const Moeda: React.FC = () => (
	<g>
		<circle r={42} fill={C.ocre} stroke={C.escuro} strokeWidth={LW} />
		<text y={14} textAnchor="middle" style={{fontFamily: F.sans, fontWeight: 900, fontSize: 36}} fill={C.escuro}>
			R$
		</text>
	</g>
);
export const C06Devolve: React.FC<T> = ({t}) => {
	const u1 = eio(lin(t, 28.2, 28.8));
	const u2 = eio(lin(t, 29.95, 30.55));
	return (
		<Papel t={t} tIn={27.2} tOut={30.75} w={880} h={1000} top={330}>
			<svg width={880} height={1000} viewBox="0 0 880 1000">
				<text x={60} y={110} style={{fontFamily: F.sans, fontWeight: 900, fontSize: 52}} fill={C.escuro} opacity={lin(t, 27.4, 27.55)}>
					Pagou demais?
				</text>
				<Pessoa x={170} y={430} s={0.62} />
				<g transform="translate(700 370)">
					<PredioMini />
				</g>
				<Desenho d="M590,330 C480,250 330,250 250,310" u={eo(lin(t, 28.2, 28.6))} w={8} />
				<Desenho d="M250,310 l34,-4 M250,310 l10,30" u={lin(t, 28.56, 28.66)} w={8} />
				{t > 28.2 && t < 29.0 ? (
					<g transform={`translate(${lerp(640, 240, u1)} ${lerp(300, 280, u1) - Math.sin(u1 * Math.PI) * 80})`}>
						<Moeda />
					</g>
				) : null}
				{t >= 29.0 ? (
					<g transform="translate(240 280)">
						<Moeda />
					</g>
				) : null}
				<Mao x={420} y={230} t={t} t0={28.3} size={56}>
					ela devolve
				</Mao>
				<path d="M60,470 H820" stroke={C.escuro} strokeOpacity={0.3} strokeWidth={3} strokeDasharray="10 12" />
				<text x={60} y={590} style={{fontFamily: F.sans, fontWeight: 900, fontSize: 52}} fill={C.escuro} opacity={lin(t, 29.04, 29.2)}>
					Pagou de menos?
				</text>
				<Pessoa x={170} y={910} s={0.62} />
				<g transform="translate(700 850)">
					<PredioMini />
				</g>
				<Desenho d="M260,790 C360,720 520,720 590,790" u={eo(lin(t, 29.95, 30.35))} w={8} cor={C.escuro} />
				<Desenho d="M590,790 l-8,-32 M590,790 l-32,4" u={lin(t, 30.32, 30.42)} w={8} cor={C.escuro} />
				{t > 29.95 ? (
					<g transform={`translate(${lerp(240, 640, u2)} ${lerp(780, 780, u2) - Math.sin(u2 * Math.PI) * 80})`}>
						<Moeda />
					</g>
				) : null}
				<Mao x={420} y={705} t={t} t0={30.1} size={56}>
					você completa
				</Mao>
			</svg>
		</Papel>
	);
};

// ---------------------------------------------------------------------------
// 07 — nem todo mundo precisa declarar
export const C07NemTodo: React.FC<T> = ({t}) => (
	<Papel t={t} tIn={30.8} tOut={32.55} w={900} h={640} top={480}>
		<svg width={900} height={640} viewBox="0 0 900 640">
			<Mao x={450} y={120} t={t} t0={31.16} size={74} rot={-3}>
				nem todo mundo
			</Mao>
			{[130, 290, 450, 610, 770].map((x, i) => (
				<g key={x}>
					<Pessoa x={x} y={560} s={0.62} />
					{i === 1 || i === 3 ? (
						<g transform={`translate(${x + 40} 300) rotate(8) scale(${surge(t, 31.6 + i * 0.05)})`} filter="url(#traco)">
							<rect x={-36} y={-48} width={72} height={96} rx={6} fill={C.creme} {...traco} />
							<path d="M-20,-20 h40 M-20,0 h40 M-20,20 h26" stroke={C.escuro} strokeWidth={4} strokeLinecap="round" />
						</g>
					) : null}
				</g>
			))}
			<path d="M40,560 H860" {...traco} />
		</svg>
	</Papel>
);

// ---------------------------------------------------------------------------
// 08 — pra onde vai: quase metade vai para estados e prefeituras
const fatia = (cx: number, cy: number, r: number, a0: number, a1: number) => {
	const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
	const [x0, y0] = p(a0);
	const [x1, y1] = p(a1);
	return `M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1},${y1} Z`;
};
export const C08Pizza: React.FC<T> = ({t}) => {
	const u = eio(lin(t, 34.3, 35.1));
	return (
		<Papel t={t} tIn={32.6} tOut={35.95} w={880} h={1000} top={330}>
			<svg width={880} height={1000} viewBox="0 0 880 1000">
				<Rotulo>TODO O IMPOSTO DE RENDA</Rotulo>
				<g opacity={1 - lin(t, 34.2, 34.4)}>
					<Mao x={760} y={210} t={t} t0={33.5} size={160} rot={8}>
						?
					</Mao>
				</g>
				<g filter="url(#traco)">
					<circle cx={420} cy={500} r={290} fill={C.creme} {...traco} />
				</g>
				{u > 0 ? (
					<g>
						<path d={fatia(420, 500, 290, -90, -90 + 176 * u)} fill={C.roxo} fillOpacity={0.35} />
						<path d={fatia(420, 500, 290, -90, -90 + 176 * u)} fill="url(#hachuraRoxo)" />
						<path d={fatia(420, 500, 290, -90, -90 + 176 * u)} fill="none" {...traco} />
					</g>
				) : null}
				<text x={420} y={520} textAnchor="middle" style={{fontFamily: F.sans, fontWeight: 900, fontSize: 52}} fill={C.escuro} opacity={1 - lin(t, 34.3, 34.5)}>
					R$
				</text>
				<Mao x={700} y={190} t={t} t0={34.5} size={64} rot={-6}>
					quase metade
				</Mao>
				<Desenho d="M690,215 C700,250 670,270 640,290" u={eo(lin(t, 34.6, 34.8))} w={6} />
				<text x={440} y={890} textAnchor="middle" style={{fontFamily: F.sans, fontWeight: 900, fontSize: 48}} fill={C.roxo} opacity={lin(t, 35.06, 35.2)}>
					estados e prefeituras
				</text>
			</svg>
		</Papel>
	);
};

// ---------------------------------------------------------------------------
// 09 — mapa do Brasil em sobrevoo, Nordeste destacado, marcadores
const TILT = 52;
const GIRO = -16;
const Marcador: React.FC<{x: number; y: number; t: number; t0: number; tipo: 'saude' | 'escola' | 'merenda'; label: string; ativo: boolean; lado: 'esq' | 'cima'}> = ({
	x,
	y,
	t,
	t0,
	tipo,
	label,
	ativo,
	lado,
}) => {
	if (t < t0) return null;
	const s = surge(t, t0, 0.35);
	const haste = ativo ? 210 : 130;
	const r = ativo ? 62 : 44;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, transformStyle: 'preserve-3d', transform: `rotateZ(${-GIRO}deg) rotateX(${-TILT}deg)`}}>
			<svg width={600} height={420} viewBox="-300 -400 600 420" style={{position: 'absolute', left: -300, top: -400, overflow: 'visible'}}>
				<g transform={`scale(${s})`} style={{transformOrigin: '0 0'}}>
					<ellipse cx={0} cy={0} rx={ativo ? 28 : 18} ry={ativo ? 10 : 7} fill={C.escuro} fillOpacity={0.4} />
					<path d={`M0,0 V${-haste + r}`} stroke={C.escuro} strokeWidth={ativo ? 6 : 5} strokeLinecap="round" />
					{ativo ? <circle cy={-haste} r={r + 18} fill="none" stroke={C.coral} strokeWidth={4} strokeDasharray="10 10" /> : null}
					<circle cy={-haste} r={r} fill={ativo ? C.coral : C.creme} stroke={C.escuro} strokeWidth={ativo ? 6 : 5} />
					<g transform={`translate(0 ${-haste + 2}) scale(${ativo ? 1.35 : 0.95})`}>
						<Picto tipo={tipo} cor={ativo ? C.creme : C.escuro} />
					</g>
					<text
						x={lado === 'esq' ? -r - 20 : 0}
						y={lado === 'esq' ? -haste + 18 : -haste - r - 34}
						textAnchor={lado === 'esq' ? 'end' : 'middle'}
						style={{fontFamily: F.mao, fontWeight: 700, fontSize: ativo ? 76 : 58, paintOrder: 'stroke'}}
						stroke={C.creme}
						strokeWidth={12}
						strokeLinejoin="round"
						fill={ativo ? C.coral : C.escuro}
					>
						{label}
					</text>
				</g>
			</svg>
		</div>
	);
};
export const C09Mapa: React.FC<T> = ({t}) => {
	const p = brasil.pontos as Record<string, number[]>;
	const voo = eio(lin(t, 36.0, 38.4));
	return (
		<Papel t={t} tIn={36.0} tOut={38.35} w={900} h={900} top={520} semPapel tilt={0}>
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					width: 900,
					height: 900,
					transformStyle: 'preserve-3d',
					transform: `translateX(${lerp(-250, -290, voo)}px) rotateX(${TILT}deg) rotateZ(${GIRO + 4 * voo}deg) scale(${lerp(1.28, 1.36, voo)})`,
				}}
			>
				<svg width={900} height={900} viewBox="0 0 900 900" style={{position: 'absolute', transform: 'translateZ(-18px)'}}>
					<path d={brasil.all} fill={C.escuro} stroke={C.escuro} strokeWidth={4} />
				</svg>
				<svg width={900} height={900} viewBox="0 0 900 900" style={{position: 'absolute'}}>
					<path d={brasil.all} fill={C.creme} stroke={C.creme} strokeWidth={1} />
					<path d={brasil.all} fill="url(#hachuraOcre)" opacity={0.55} />
					<path d={brasil.ne} fill={C.roxo} fillOpacity={0.4} stroke={C.roxo} strokeOpacity={0.4} strokeWidth={1} />
					<path d={brasil.ne} fill="url(#hachuraRoxo)" />
					<path d={brasil.all} fill="none" stroke={C.escuro} strokeOpacity={0.35} strokeWidth={1.5} strokeLinejoin="round" />
					<g filter="url(#traco)">
						<path d={brasil.all} fill="none" stroke={C.escuro} strokeWidth={4} strokeLinejoin="round" />
					</g>
					<text x={p.nordeste[0]} y={p.nordeste[1]} textAnchor="middle" style={{fontFamily: F.sans, fontWeight: 900, fontSize: 30, letterSpacing: 4}} fill={C.roxo} stroke={C.creme} strokeWidth={8} paintOrder="stroke">
						NORDESTE
					</text>
				</svg>
				<Marcador x={p.escola[0]} y={p.escola[1]} t={t} t0={37.15} tipo="escola" label="escola" ativo={false} lado="esq" />
				<Marcador x={p.merenda[0]} y={p.merenda[1]} t={t} t0={37.75} tipo="merenda" label="merenda" ativo={false} lado="esq" />
				<Marcador x={p.posto[0]} y={p.posto[1]} t={t} t0={36.3} tipo="saude" label="posto de saúde" ativo lado="cima" />
			</div>
		</Papel>
	);
};

// ---------------------------------------------------------------------------
// 10 — o resto: SUS, universidades, programas sociais
export const C10Resto: React.FC<T> = ({t}) => {
	const itens: [number, 'saude' | 'universidade' | 'social', string][] = [
		[39.76, 'saude', 'SUS'],
		[40.24, 'universidade', 'universidades'],
		[41.12, 'social', 'programas sociais'],
	];
	return (
		<Papel t={t} tIn={38.4} tOut={41.95} w={880} h={900} top={380}>
			<svg width={880} height={900} viewBox="0 0 880 900">
				<Rotulo>O RESTO AJUDA A BANCAR</Rotulo>
				{itens.map(([t0, tipo, label], i) => {
					const y = 230 + i * 240;
					return t < t0 - 0.05 ? null : (
						<g key={label} opacity={lin(t, t0 - 0.05, t0 + 0.1)}>
							<Medalhao x={150} y={y} r={78} tipo={tipo} s={surge(t, t0 - 0.05)} />
							<text x={270} y={y + 22} style={{fontFamily: F.sans, fontWeight: 900, fontSize: 62}} fill={C.escuro}>
								{label}
							</text>
						</g>
					);
				})}
				<path d="M100,830 H780" stroke={C.escuro} strokeOpacity={0.25} strokeWidth={4} strokeDasharray="10 12" />
			</svg>
		</Papel>
	);
};

// ---------------------------------------------------------------------------
// 11 — "imposto não volta"? Volta sim!
export const C11Volta: React.FC<T> = ({t}) => (
	<Papel t={t} tIn={42.0} tOut={44.95} w={880} h={940} top={360}>
		<svg width={880} height={940} viewBox="0 0 880 940">
			<g filter="url(#traco)">
				<path d="M110,90 H770 Q810,90 810,130 V330 Q810,370 770,370 H330 L250,450 L265,370 H110 Q70,370 70,330 V130 Q70,90 110,90 Z" fill={C.creme} {...traco} />
			</g>
			<Mao x={440} y={265} t={t} t0={42.9} size={84} rot={-2} cor={C.escuro}>
				imposto não volta
			</Mao>
			<Desenho d="M140,250 C300,200 520,300 740,215" u={eo(lin(t, 43.55, 43.85))} w={11} />
			<Pessoa x={190} y={700} s={0.8} />
			<path d="M60,700 H330" {...traco} />
			<text x={560} y={680} textAnchor="middle" style={{fontFamily: F.sans, fontWeight: 900, fontSize: 104, letterSpacing: -2}} fill={C.escuro} opacity={lin(t, 44.24, 44.34)} transform={`translate(560 650) scale(${surge(t, 44.24)}) translate(-560 -650)`}>
				VOLTA
			</text>
			<text x={560} y={800} textAnchor="middle" style={{fontFamily: F.sans, fontWeight: 900, fontSize: 104, letterSpacing: -2}} fill={C.coral} opacity={lin(t, 44.68, 44.78)} transform={`translate(560 770) scale(${surge(t, 44.68)}) translate(-560 -770)`}>
				SIM!
			</text>
			<Desenho d="M800,600 C860,700 820,860 640,870 C500,878 420,840 390,770" u={eo(lin(t, 44.3, 44.8))} w={8} />
			<Desenho d="M390,770 l4,36 M390,770 l32,14" u={lin(t, 44.78, 44.86)} w={8} />
		</svg>
	</Papel>
);

// ---------------------------------------------------------------------------
// 12/13 — Estados Unidos
const MapaEUA: React.FC<{escala: number}> = ({escala}) => (
	<g transform={`scale(${escala})`}>
		<g transform="translate(0 12)">
			<path d={eua.nation} fill={C.escuro} />
		</g>
		<path d={eua.nation} fill={C.creme} />
		<path d={eua.nation} fill="url(#hachuraOcre)" opacity={0.55} />
		<path d={eua.mesh} fill="none" stroke={C.escuro} strokeOpacity={0.25} strokeWidth={1.5 / escala} />
		<g filter="url(#traco)">
			<path d={eua.nation} fill="none" stroke={C.escuro} strokeWidth={4 / escala} strokeLinejoin="round" />
		</g>
	</g>
);
const Doc: React.FC<{titulo: string; cor?: string}> = ({titulo, cor = C.escuro}) => (
	<g>
		<g filter="url(#traco)">
			<rect x={-140} y={-80} width={280} height={160} rx={10} fill={C.creme} {...traco} />
		</g>
		<text x={-116} y={-30} style={{fontFamily: F.sans, fontWeight: 900, fontSize: 30}} fill={cor}>
			{titulo}
		</text>
		<path d="M-116,6 h170 M-116,40 h110" stroke={C.escuro} strokeWidth={5} strokeLinecap="round" strokeOpacity={0.5} />
		<text x={116} y={50} textAnchor="end" style={{fontFamily: F.mono, fontWeight: 800, fontSize: 30}} fill={C.vermelho}>
			US$
		</text>
	</g>
);
export const C12EUA: React.FC<T> = ({t}) => (
	<Papel t={t} tIn={45.0} tOut={49.85} w={900} h={1000} top={330}>
		<svg width={900} height={1000} viewBox="0 0 900 1000">
			<g transform="translate(80 70)">
				<MapaEUA escala={0.82} />
			</g>
			<Pessoa x={140} y={950} s={0.7} />
			<path d="M40,950 H860" {...traco} />
			{t > 46.4 ? (
				<g transform={`translate(380 640) rotate(-4) scale(${surge(t, 46.4)})`}>
					<Doc titulo="IMPOSTO" />
				</g>
			) : null}
			{t > 47.7 ? (
				<g transform={`translate(400 820) rotate(3) scale(${surge(t, 47.7)})`}>
					<Doc titulo="PLANO DE SAÚDE" />
				</g>
			) : null}
			{t > 48.7 ? (
				<g opacity={lin(t, 48.7, 48.85)}>
					<Medalhao x={720} y={740} r={96} tipo="saude" s={surge(t, 48.7)} />
					<text x={720} y={880} textAnchor="middle" style={{fontFamily: F.sans, fontWeight: 900, fontSize: 48}} fill={C.roxo}>
						SUS
					</text>
				</g>
			) : null}
			{t > 49.08 ? (
				<g transform={`translate(720 760) rotate(-16) scale(${lerp(1.7, 1, surge(t, 49.08, 0.25))})`} opacity={lin(t, 49.08, 49.16)} filter="url(#carimbo)">
					<rect x={-150} y={-46} width={300} height={92} rx={8} fill={C.creme} fillOpacity={0.6} stroke={C.vermelho} strokeWidth={8} />
					<text x={0} y={16} textAnchor="middle" style={{fontFamily: F.sans, fontWeight: 900, fontSize: 44, letterSpacing: 2}} fill={C.vermelho}>
						NÃO EXISTE
					</text>
				</g>
			) : null}
		</svg>
	</Papel>
);

export const C13Milhoes: React.FC<T> = ({t}) => {
	const cols = 9;
	const rows = 3;
	const x0 = 200;
	const x1 = 690;
	const y0 = 420;
	const y1 = 620;
	const hi = {c: 8, r: 0};
	const pessoas: React.ReactNode[] = [];
	for (let r = 0; r < rows; r++)
		for (let c = 0; c < cols; c++) {
			const k = r * cols + c;
			const t0 = 50.4 + k * 0.03;
			if (t < t0) continue;
			const on = c === hi.c && r === hi.r;
			const x = x0 + (c * (x1 - x0)) / (cols - 1);
			const y = y0 + (r * (y1 - y0)) / (rows - 1);
			const col = on ? C.coral : C.escuro;
			pessoas.push(
				<g key={k} transform={`translate(${x} ${y}) scale(${1.25 * surge(t, t0, 0.25)})`}>
					{on && t > 51.3 ? <circle cx={0} cy={-4} r={40} fill={C.creme} stroke={C.coral} strokeWidth={4} /> : null}
					<circle cx={0} cy={-22} r={10} fill={col} />
					<path d="M-17,22 V2 Q-17,-8 -7,-8 H7 Q17,-8 17,2 V22 Z" fill={col} />
				</g>,
			);
		}
	const tx = x1;
	const ty = y0;
	return (
		<Papel t={t} tIn={49.9} tOut={52.45} w={900} h={900} top={380}>
			<svg width={900} height={900} viewBox="0 0 900 900">
				<g transform="translate(40 250)">
					<MapaEUA escala={0.9} />
				</g>
				{pessoas}
				<Mao x={860} y={110} t={t} t0={51.3} size={62} rot={-4} anchor="end">
					≈ 1 milhão
				</Mao>
				<Mao x={860} y={172} t={t} t0={51.36} size={62} rot={-4} anchor="end">
					de pessoas
				</Mao>
				<Desenho d={`M780,200 C800,280 790,${ty - 60} ${tx + 48},${ty - 22}`} u={eo(lin(t, 51.45, 51.75))} w={6} />
				<Desenho d={`M${tx + 48},${ty - 22} l16,-26 M${tx + 48},${ty - 22} l30,2`} u={lin(t, 51.72, 51.8)} w={6} />
				<text x={450} y={830} textAnchor="middle" style={{fontFamily: F.sans, fontWeight: 900, fontSize: 56}} fill={C.escuro} opacity={lin(t, 51.8, 52.0)}>
					sem plano de saúde
				</text>
			</svg>
		</Papel>
	);
};

// ---------------------------------------------------------------------------
// 14 — a conta do hospital vira uma fortuna (recibo que cresce)
export const C14Hospital: React.FC<T> = ({t}) => {
	const h = lerp(330, 1000, eio(lin(t, 53.5, 54.9)));
	const itens = ['CONSULTA', 'EXAMES', 'INTERNAÇÃO', 'REMÉDIOS', 'CIRURGIA', 'UTI', 'TAXAS'];
	let zig = `M40,0 H460 V${h}`;
	for (let x = 460; x > 40; x -= 30) zig += ` L${x - 15},${h + 18} L${x - 30},${h}`;
	zig += ' Z';
	return (
		<Papel t={t} tIn={52.5} tOut={55.35} w={900} h={1100} top={300} semPapel>
			<svg width={900} height={1100} viewBox="0 0 900 1100" style={{overflow: 'visible'}}>
				<g transform="translate(160 0)">
					<path d={zig} fill={C.escuro} opacity={0.45} transform="translate(12 22)" />
					<path d={zig} fill={C.creme} />
					<text x={250} y={80} textAnchor="middle" style={{fontFamily: F.sans, fontWeight: 900, fontSize: 52}} fill={C.escuro}>
						HOSPITAL
					</text>
					<path d="M80,110 H420" stroke={C.escuro} strokeOpacity={0.35} strokeWidth={2} strokeDasharray="8 8" />
					{itens.map((it, i) => {
						const y = 170 + i * 90;
						if (y > h - 150) return null;
						return (
							<g key={it}>
								<text x={80} y={y} style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30}} fill={C.escuro}>
									{it}
								</text>
								<text x={420} y={y} textAnchor="end" style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30}} fill={C.vermelho}>
									US$ ···
								</text>
							</g>
						);
					})}
					<path d={`M80,${h - 110} H420`} stroke={C.escuro} strokeWidth={4} />
					<text x={80} y={h - 50} style={{fontFamily: F.sans, fontWeight: 900, fontSize: 34}} fill={C.escuro}>
						TOTAL
					</text>
					<text x={420} y={h - 50} textAnchor="end" style={{fontFamily: F.mono, fontWeight: 800, fontSize: 34}} fill={C.vermelho}>
						US$ $$$$$
					</text>
				</g>
				<Mao x={760} y={560} t={t} t0={54.7} size={78} rot={-8}>
					uma fortuna!
				</Mao>
			</svg>
		</Papel>
	);
};

// ---------------------------------------------------------------------------
// 15 — aqui a gente reclama, mas tem SUS e universidade pública
export const C15Aqui: React.FC<T> = ({t}) => (
	<Papel t={t} tIn={55.4} tOut={59.75} w={900} h={1000} top={330}>
		<svg width={900} height={1000} viewBox="0 0 900 1000">
			<g filter="url(#traco)" opacity={lin(t, 56.2, 56.35)}>
				<path d="M60,90 H420 Q450,90 450,120 V230 Q450,260 420,260 H200 L150,320 L160,260 H60 Q30,260 30,230 V120 Q30,90 60,90 Z" fill={C.creme} {...traco} />
			</g>
			<Mao x={240} y={200} t={t} t0={56.3} size={66} rot={-3} cor={C.escuro}>
				imposto…
			</Mao>
			<Pessoa x={150} y={600} s={0.75} />
			<g transform="translate(440 280)" opacity={lin(t, 57.3, 57.6)}>
				<g transform="scale(0.5)">
					<path d={brasil.all} fill={C.escuro} transform="translate(10 16)" />
					<path d={brasil.all} fill={C.creme} stroke={C.creme} strokeWidth={2} />
					<path d={brasil.all} fill="url(#hachuraOcre)" opacity={0.55} />
					<g filter="url(#traco)">
						<path d={brasil.all} fill="none" stroke={C.escuro} strokeWidth={7} strokeLinejoin="round" />
					</g>
				</g>
			</g>
			<Mao x={680} y={260} t={t} t0={57.44} size={60} rot={-4}>
				pelo menos…
			</Mao>
			{t > 58.4 ? <Medalhao x={300} y={800} r={80} tipo="saude" s={surge(t, 58.4)} /> : null}
			<text x={300} y={940} textAnchor="middle" style={{fontFamily: F.sans, fontWeight: 900, fontSize: 46}} fill={C.roxo} opacity={lin(t, 58.42, 58.55)}>
				SUS
			</text>
			{check(390, 720, eo(lin(t, 58.6, 58.8)), 1.4)}
			{t > 58.78 ? <Medalhao x={620} y={800} r={80} tipo="universidade" s={surge(t, 58.78)} /> : null}
			<text x={620} y={940} textAnchor="middle" style={{fontFamily: F.sans, fontWeight: 900, fontSize: 46}} fill={C.roxo} opacity={lin(t, 58.8, 58.95)}>
				universidade
			</text>
			{check(710, 720, eo(lin(t, 59.3, 59.5)), 1.4)}
		</svg>
	</Papel>
);

// ---------------------------------------------------------------------------
// 17 — no próximo post: o que muda no seu bolso
export const C17Proximo: React.FC<T> = ({t}) => (
	<Papel t={t} tIn={64.6} tOut={66.3} w={860} h={760} top={420}>
		<svg width={860} height={760} viewBox="0 0 860 760">
			<Rotulo>NO PRÓXIMO POST</Rotulo>
			<g transform="translate(430 400)" filter="url(#traco)">
				<path d="M-230,-180 H230 V40 Q230,220 0,250 Q-230,220 -230,40 Z" fill={C.ocre} fillOpacity={0.35} {...traco} />
				<path d="M-230,-180 H230 V40 Q230,220 0,250 Q-230,220 -230,40 Z" fill="url(#hachuraOcre)" opacity={0.5} />
				<path d="M-230,-120 Q0,-60 230,-120" fill="none" {...traco} strokeDasharray="14 12" />
				<path d="M-200,-180 Q0,-20 200,-180" fill={C.creme} {...traco} />
			</g>
			{[0, 1, 2].map((i) =>
				t > 65.3 + i * 0.12 ? (
					<g key={i} transform={`translate(${360 + i * 70} ${lerp(330, 250 - i * 10, surge(t, 65.3 + i * 0.12, 0.35))})`}>
						<circle r={42} fill={C.ocre} stroke={C.escuro} strokeWidth={LW} />
						<text y={14} textAnchor="middle" style={{fontFamily: F.sans, fontWeight: 900, fontSize: 34}} fill={C.escuro}>
							R$
						</text>
					</g>
				) : null,
			)}
			<Mao x={430} y={720} t={t} t0={65.75} size={70} rot={-3}>
				o que muda?
			</Mao>
		</svg>
	</Papel>
);
