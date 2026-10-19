import React from 'react';
import {Desenho, Mao, Papel, Pessoa, Rotulo, traco} from './base';
import {C, eback, eio, eo, F, lerp, lin, LW} from './tokens';

type T = {t: number};

// ---------------------------------------------------------------------------
// Contracheque (cenas 1 e 16): mesma geometria nas duas aparições
const LINHAS_CC = [
	{label: 'Salário bruto', value: 'R$ 4.000', y: 300},
	{label: 'INSS', value: '– R$ 373', y: 395, neg: true},
	{label: 'Imposto de Renda', value: '– R$ 115', y: 490, neg: true},
	{label: 'Líquido', value: 'R$ 3.512', y: 650, bold: true},
];
const VAL_X = 600;

const Contracheque: React.FC<{children?: React.ReactNode; destaqueIR?: number}> = ({children, destaqueIR = 0}) => (
	<svg width={860} height={800} viewBox="0 0 860 800">
		<text x={50} y={112} style={{fontFamily: F.sans, fontWeight: 900, fontSize: 56, letterSpacing: 1}} fill={C.escuro}>
			CONTRACHEQUE
		</text>
		<text x={52} y={164} style={{fontFamily: F.mono, fontSize: 24, letterSpacing: 2}} fill={C.escuro} fillOpacity={0.6}>
			COMPETÊNCIA 01 · VALORES EM REAIS
		</text>
		<line x1={50} y1={205} x2={810} y2={205} stroke={C.escuro} strokeOpacity={0.35} strokeWidth={2} strokeDasharray="8 8" />
		{destaqueIR > 0 ? <rect x={36} y={448} width={590 * destaqueIR} height={60} rx={8} fill={C.coral} fillOpacity={0.22} /> : null}
		<g filter="url(#traco)">
			<path d="M50,568 L810,568" {...traco} />
		</g>
		{LINHAS_CC.map((r) => (
			<g key={r.label}>
				<text x={50} y={r.y} style={{fontFamily: F.sans, fontWeight: r.bold ? 900 : 600, fontSize: r.bold ? 44 : 38}} fill={C.escuro}>
					{r.label}
				</text>
				<text x={VAL_X} y={r.y} textAnchor="end" style={{fontFamily: F.mono, fontWeight: r.bold ? 800 : 500, fontSize: r.bold ? 42 : 36}} fill={r.neg ? C.vermelho : C.escuro}>
					{r.value}
				</text>
			</g>
		))}
		{children}
	</svg>
);

const elipse = (cx: number, cy: number, rx: number, ry: number) => {
	let d = '';
	for (let i = 0; i <= 90; i++) {
		const a = -2.2 + (i / 90) * Math.PI * 2 * 1.12;
		const k = 1 + 0.05 * Math.sin(i * 0.21) + (i / 90) * 0.06;
		d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rx * k).toFixed(1)},${(cy + Math.sin(a) * ry * k).toFixed(1)} `;
	}
	return d;
};
const risco = (x1: number, x2: number, y: number) => `M${x1},${y + 4} C${(x1 + x2) / 2},${y - 10} ${(x1 + x2) / 2},${y + 6} ${x2},${y - 8}`;

export const C01Contracheque: React.FC<T> = ({t}) => (
	<Papel t={t} tIn={-0.3} tOut={7.0} w={860} h={800} top={360}>
		<Contracheque destaqueIR={eo(lin(t, 6.2, 6.6))}>
			<Mao x={700} y={112} t={t} t0={2.7} size={58} rot={-5}>
				cadê o resto?
			</Mao>
			<Desenho d={elipse(VAL_X - 100, 636, 150, 58)} u={eo(lin(t, 4.95, 5.45))} w={7} />
			<Desenho d="M760,600 C800,560 790,520 650,486" u={eo(lin(t, 6.1, 6.45))} w={7} />
			<Desenho d="M650,486 l26,-18 M650,486 l30,10" u={lin(t, 6.42, 6.5)} w={7} />
		</Contracheque>
	</Papel>
);

export const C16Novidade: React.FC<T> = ({t}) => (
	<Papel t={t} tIn={59.8} tOut={64.55} w={860} h={800} top={360}>
		<Contracheque>
			<Mao x={690} y={118} t={t} t0={60.85} size={84} rot={-4}>
				novidade!
			</Mao>
			<Desenho d="M575,140 C640,132 720,130 810,124" u={eo(lin(t, 61.05, 61.3))} w={7} />
			<Desenho d={risco(40, 615, 478)} u={eo(lin(t, 63.3, 63.55))} w={7} />
			<Mao x={640} y={505} t={t} t0={63.5} size={74} rot={-3} anchor="start">
				R$ 0
			</Mao>
			<Desenho d={risco(390, 615, 638)} u={eo(lin(t, 63.85, 64.05))} w={7} />
			<Mao x={630} y={665} t={t} t0={64.0} size={64} rot={-3} anchor="start">
				R$ 3.627
			</Mao>
			<Mao x={430} y={760} t={t} t0={62.3} size={50} rot={-2}>
				até R$ 5 mil por mês: sem IR
			</Mao>
		</Contracheque>
	</Papel>
);

// ---------------------------------------------------------------------------
// 02 — o que é renda: pote RENDA com salário, aposentadoria e aluguel caindo
const Holerite = () => (
	<g filter="url(#traco)">
		<path d="M-60,-80 h90 l30,30 v130 h-120 z" fill={C.creme} {...traco} />
		<path d="M30,-80 v30 h30" fill="none" {...traco} />
		<path d="M-40,-30 h70 M-40,0 h80 M-40,30 h50" stroke={C.escuro} strokeWidth={4} strokeLinecap="round" />
		<text x={-40} y={68} style={{fontFamily: F.mono, fontWeight: 800, fontSize: 26}} fill={C.escuro}>
			R$
		</text>
	</g>
);
const Cartao = () => (
	<g filter="url(#traco)">
		<rect x={-95} y={-60} width={190} height={120} rx={14} fill={C.creme} {...traco} />
		<circle cx={-48} cy={-12} r={18} fill="none" stroke={C.escuro} strokeWidth={4} />
		<path d="M-76,32 q28,-36 56,0" fill="none" stroke={C.escuro} strokeWidth={4} strokeLinecap="round" />
		<path d="M5,-20 h60 M5,4 h48 M5,28 h60" stroke={C.escuro} strokeWidth={4} strokeLinecap="round" />
	</g>
);
export const Casa: React.FC<{fill?: string}> = ({fill = 'url(#hachura)'}) => (
	<g filter="url(#traco)">
		<path d="M-55,-22 V70 H55 V-22" fill={C.creme} {...traco} />
		<path d="M-55,-22 L0,-72 L55,-22 Z" fill={fill} />
		<path d="M-70,-10 L0,-75 L70,-10" fill="none" {...traco} />
		<rect x={-16} y={20} width={32} height={50} fill={C.creme} stroke={C.escuro} strokeWidth={4} />
		<rect x={22} y={0} width={22} height={22} fill={C.creme} stroke={C.escuro} strokeWidth={4} />
	</g>
);
const caindo = (t: number, t0: number, x: number, y: number, rot: number, el: React.ReactNode) => {
	const a = eback(lin(t, t0, t0 + 0.35));
	if (t < t0) return null;
	const yy = lerp(y - 160, y, a) + (t - t0) * 14;
	return (
		<g transform={`translate(${x} ${yy}) rotate(${rot + (1 - a) * 12})`} opacity={lin(t, t0, t0 + 0.12)}>
			<path d="M-22,-110 v-40 M0,-120 v-50 M22,-110 v-40" stroke={C.escuro} strokeOpacity={0.45} strokeWidth={4} strokeLinecap="round" />
			{el}
		</g>
	);
};

export const C02Renda: React.FC<T> = ({t}) => {
	const jx = 380;
	const corpo = `M${jx - 205},610 Q${jx - 205},570 ${jx - 165},570 L${jx + 165},570 Q${jx + 205},570 ${jx + 205},610 L${jx + 205},910 Q${jx + 205},960 ${jx + 155},960 L${jx - 155},960 Q${jx - 205},960 ${jx - 205},910 Z`;
	const nivel = 860 - 50 * lin(t, 9.4, 11.4);
	return (
		<Papel t={t} tIn={7.15} tOut={12.65} w={900} h={1000} top={330}>
			<svg width={900} height={1000} viewBox="0 0 900 1000">
				<Rotulo>TUDO QUE ENTRA</Rotulo>
				<defs>
					<clipPath id="pote">
						<path d={corpo} />
					</clipPath>
				</defs>
				<g filter="url(#traco)">
					<path d={corpo} fill={C.creme} {...traco} />
				</g>
				<g clipPath="url(#pote)">
					<rect x={jx - 210} y={nivel} width={420} height={200} fill={C.ocre} fillOpacity={0.55} />
					<rect x={jx - 210} y={nivel} width={420} height={200} fill="url(#hachuraOcre)" />
				</g>
				<g filter="url(#traco)">
					<path d={corpo} fill="none" {...traco} />
					<rect x={jx - 175} y={540} width={350} height={34} rx={6} fill={C.creme} {...traco} />
					<rect x={jx - 150} y={680} width={300} height={150} rx={8} fill={C.creme} {...traco} />
				</g>
				<text x={jx} y={780} textAnchor="middle" style={{fontFamily: F.sans, fontWeight: 900, fontSize: 70, letterSpacing: 3}} fill={C.escuro}>
					RENDA
				</text>
				{caindo(t, 9.35, 170, 300, -14, <Holerite />)}
				<Mao x={150} y={470} t={t} t0={9.4} size={58} rot={-6}>
					salário
				</Mao>
				{caindo(t, 9.9, 430, 230, 9, <Cartao />)}
				<Mao x={560} y={170} t={t} t0={9.94} size={58} rot={-4} anchor="start">
					aposentadoria
				</Mao>
				{caindo(t, 11.05, 640, 420, -8, <Casa />)}
				<Mao x={730} y={455} t={t} t0={11.1} size={58} rot={-4} anchor="start">
					aluguel
				</Mao>
				<Pessoa x={790} y={960} s={0.72} bracos={t > 11.6 ? 'apontando' : 'nenhum'} />
				<Mao x={790} y={700} t={t} t0={11.7} size={50} rot={-5}>
					dono = você
				</Mao>
				<path d="M120,960 H880" {...traco} />
			</svg>
		</Papel>
	);
};

// ---------------------------------------------------------------------------
// 03 — carteira assinada: carteira + contracheque + carimbo DESCONTADO
export const C03Carteira: React.FC<T> = ({t}) => {
	const s = eback(lin(t, 15.42, 15.68));
	return (
		<Papel t={t} tIn={12.7} tOut={16.25} w={900} h={1000} top={330}>
			<svg width={900} height={1000} viewBox="0 0 900 1000">
				<g transform="translate(230 340) rotate(-6)" filter="url(#traco)">
					<rect x={-150} y={-215} width={300} height={430} rx={16} fill={C.roxo} {...traco} />
					<path d="M-122,-215 v430" stroke={C.escuro} strokeWidth={3} strokeOpacity={0.6} />
					<circle cx={15} cy={-95} r={48} fill="none" stroke={C.creme} strokeWidth={5} />
					<path d="M15,-143 v96 M-33,-95 h96" stroke={C.creme} strokeWidth={3} />
					<text x={15} y={10} textAnchor="middle" style={{fontFamily: F.sans, fontWeight: 900, fontSize: 30, letterSpacing: 2}} fill={C.creme}>
						CARTEIRA
					</text>
					<text x={15} y={46} textAnchor="middle" style={{fontFamily: F.sans, fontWeight: 900, fontSize: 30, letterSpacing: 2}} fill={C.creme}>
						DE TRABALHO
					</text>
				</g>
				<g transform="translate(620 330) rotate(4)">
					<g filter="url(#traco)">
						<path d="M-180,-260 h300 l60,60 v460 h-360 z" fill={C.creme} {...traco} />
						<path d="M120,-260 v60 h60" fill="none" {...traco} />
					</g>
					<text x={-150} y={-190} style={{fontFamily: F.sans, fontWeight: 900, fontSize: 32}} fill={C.escuro}>
						CONTRACHEQUE
					</text>
					{[-110, -40, 30, 100, 170].map((yy, i) => (
						<g key={yy}>
							<path d={`M-150,${yy} h${[150, 110, 170, 90, 130][i]}`} stroke={C.escuro} strokeWidth={5} strokeLinecap="round" />
							<path d={`M60,${yy} h90`} stroke={i === 1 || i === 2 ? C.vermelho : C.escuro} strokeWidth={5} strokeLinecap="round" />
						</g>
					))}
				</g>
				{t >= 15.42 ? (
					<g transform={`translate(610 350) rotate(-14) scale(${lerp(1.7, 1, s)})`} opacity={lin(t, 15.42, 15.5)} filter="url(#carimbo)">
						<rect x={-180} y={-58} width={360} height={116} rx={10} fill="none" stroke={C.vermelho} strokeWidth={9} />
						<rect x={-166} y={-44} width={332} height={88} rx={6} fill="none" stroke={C.vermelho} strokeWidth={3} />
						<text x={0} y={20} textAnchor="middle" style={{fontFamily: F.sans, fontWeight: 900, fontSize: 56, letterSpacing: 3}} fill={C.vermelho}>
							DESCONTADO
						</text>
					</g>
				) : null}
				<Pessoa x={450} y={960} s={0.9} bracos={t > 14.0 ? 'abertos' : 'nenhum'} />
				<path d="M250,960 H650" {...traco} />
			</svg>
		</Papel>
	);
};

// ---------------------------------------------------------------------------
// 04 — quem cobra: prédio da Receita que vira bolo
const Predio: React.FC = () => {
	const cols = [0, 1, 2, 3, 4, 5].map((i) => 210 + i * 96);
	return (
		<g filter="url(#traco)">
			<path d="M140,280 L450,110 L760,280 Z" fill={C.roxo} fillOpacity={0.25} />
			<path d="M140,280 L450,110 L760,280 Z" fill="url(#hachuraRoxo)" />
			<path d="M140,280 L450,110 L760,280 Z" fill="none" {...traco} />
			<rect x={140} y={280} width={620} height={44} fill={C.creme} {...traco} />
			{cols.map((cx) => (
				<g key={cx}>
					<rect x={cx - 26} y={324} width={52} height={16} fill={C.creme} {...traco} />
					<path d={`M${cx - 20},340 V682 M${cx + 20},340 V682`} fill="none" {...traco} />
					<path d={`M${cx - 6},355 V668 M${cx + 6},355 V668`} stroke={C.escuro} strokeWidth={2.5} strokeOpacity={0.5} />
					<rect x={cx - 26} y={682} width={52} height={16} fill={C.creme} {...traco} />
				</g>
			))}
			<rect x={125} y={698} width={650} height={30} fill={C.creme} {...traco} />
			<rect x={105} y={728} width={690} height={26} fill={C.creme} {...traco} />
			<rect x={85} y={754} width={730} height={26} fill={C.creme} {...traco} />
		</g>
	);
};
const cobertura = (x1: number, x2: number, y: number, drops: number[], k: number) => {
	let d = `M${x1 - 6},${y - 14} L${x2 + 6},${y - 14} L${x2 + 6},${y + 18}`;
	const step = (x2 - x1 + 12) / drops.length;
	drops.forEach((len0, i) => {
		const len = len0 * k + 4;
		const xa = x2 + 6 - i * step;
		const xb = xa - step;
		d += ` C${xa},${y + 18 + len} ${xa - step * 0.5},${y + 18 + len} ${xa - step * 0.5},${y + 18 + len * 0.6}`;
		d += ` C${xa - step * 0.5},${y + 26} ${xb},${y + 26} ${xb},${y + 18}`;
	});
	return d + ' Z';
};
const Bolo: React.FC<{t: number}> = ({t}) => {
	const k = eo(lin(t, 21.35, 21.9));
	const chama = (cx: number, i: number) => {
		const on = lin(t, 19.6 + i * 0.06, 19.75 + i * 0.06);
		const fl = 1 + 0.08 * Math.sin(t * 22 + i * 2);
		const y0 = 210 - (i % 2) * 14;
		return (
			<g key={cx}>
				<rect x={cx - 12} y={y0 + 90} width={24} height={100 + (i % 2) * 14} rx={4} fill={C.creme} {...traco} />
				<path d={`M${cx - 12},${y0 + 120} l24,-14 M${cx - 12},${y0 + 152} l24,-14`} stroke={C.coral} strokeWidth={5} />
				<path d={`M${cx},${y0 + 90} v-14`} stroke={C.escuro} strokeWidth={4} />
				<g transform={`translate(${cx} ${y0 + 72}) scale(${on * fl})`}>
					<path d="M0,-72 C26,-37 20,-2 0,0 C-20,-2 -24,-37 0,-72 Z" fill={C.coral} stroke={C.escuro} strokeWidth={4} strokeLinejoin="round" />
					<path d="M0,-26 q-8,10 0,20 q8,-10 0,-20" fill={C.creme} />
				</g>
			</g>
		);
	};
	return (
		<g filter="url(#traco)">
			<ellipse cx={450} cy={776} rx={370} ry={26} fill={C.creme} {...traco} />
			<rect x={160} y={550} width={580} height={210} fill={C.ocre} fillOpacity={0.6} />
			<rect x={160} y={550} width={580} height={210} fill="url(#hachuraOcre)" opacity={0.6} />
			<rect x={160} y={550} width={580} height={210} fill="none" {...traco} />
			<path d="M160,675 h580" stroke={C.escuro} strokeWidth={3} strokeOpacity={0.5} strokeDasharray="14 10" />
			<path d={cobertura(160, 740, 550, [40, 70, 26, 58, 34, 80, 30, 52, 44], k)} fill={C.creme} {...traco} />
			<rect x={265} y={400} width={370} height={150} fill={C.ocre} fillOpacity={0.6} />
			<rect x={265} y={400} width={370} height={150} fill="url(#hachuraOcre)" opacity={0.6} />
			<rect x={265} y={400} width={370} height={150} fill="none" {...traco} />
			<path d={cobertura(265, 635, 412, [36, 62, 28, 54, 40, 66], k)} fill={C.creme} {...traco} />
			{[320, 385, 450, 515, 580].map((cx, i) => chama(cx, i))}
		</g>
	);
};
export const C04Receita: React.FC<T> = ({t}) => {
	const sai = eio(lin(t, 18.85, 19.25));
	const entra = eback(lin(t, 19.15, 19.6));
	return (
		<Papel t={t} tIn={16.3} tOut={21.95} w={900} h={1000} top={330}>
			<svg width={900} height={1000} viewBox="0 0 900 1000">
				{sai < 1 ? (
					<g transform={`translate(0 ${780 * sai}) scale(1 ${1 - sai})`} opacity={1 - sai * 0.6}>
						<Predio />
					</g>
				) : null}
				{t > 19.15 ? (
					<g transform={`translate(0 ${780 * (1 - entra)}) scale(1 ${entra})`}>
						<Bolo t={t} />
					</g>
				) : null}
				<Mao x={450} y={905} t={t} t0={17.24} size={96} rot={-2}>
					Receita Federal
				</Mao>
			</svg>
		</Papel>
	);
};

// ---------------------------------------------------------------------------
// pictogramas (mesmos no vídeo inteiro)
export const Picto: React.FC<{tipo: 'saude' | 'escola' | 'merenda' | 'universidade' | 'social'; cor: string}> = ({tipo, cor}) => {
	if (tipo === 'saude') return <path d="M-9,-24 h18 v15 h15 v18 h-15 v15 h-18 v-15 h-15 v-18 h15 z" fill={cor} />;
	if (tipo === 'escola')
		return (
			<g>
				<path d="M-24,-4 L0,-22 L24,-4" fill="none" stroke={cor} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
				<rect x={-18} y={-4} width={36} height={26} fill="none" stroke={cor} strokeWidth={5} strokeLinejoin="round" />
				<rect x={-5} y={8} width={10} height={14} fill={cor} />
				<path d="M0,-22 v-12" stroke={cor} strokeWidth={4} />
				<path d="M0,-34 h12 l-3,5 l3,5 h-12" fill={cor} />
			</g>
		);
	if (tipo === 'merenda')
		return (
			<g>
				<path d="M-26,-2 h52 a26,24 0 0 1 -52,0 z" fill={cor} />
				<path d="M-30,24 h60" stroke={cor} strokeWidth={5} strokeLinecap="round" />
				<path d="M-8,-12 q-6,-8 0,-16 M8,-12 q-6,-8 0,-16" stroke={cor} strokeWidth={4} fill="none" strokeLinecap="round" />
			</g>
		);
	if (tipo === 'universidade')
		return (
			<g>
				<path d="M0,-22 L30,-8 L0,6 L-30,-8 Z" fill={cor} />
				<path d="M-18,0 v12 q18,10 36,0 v-12" fill="none" stroke={cor} strokeWidth={5} strokeLinejoin="round" />
				<path d="M30,-8 v18" stroke={cor} strokeWidth={4} strokeLinecap="round" />
			</g>
		);
	return (
		<g>
			<path d="M-24,-2 L0,-24 L24,-2" fill="none" stroke={cor} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
			<path d="M-18,-6 V22 H18 V-6" fill="none" stroke={cor} strokeWidth={5} strokeLinejoin="round" />
			<path d="M0,16 C-14,6 -10,-6 0,0 C10,-6 14,6 0,16 Z" fill={cor} />
		</g>
	);
};

// medalhão: círculo com pictograma (roxo = serviço público; coral = ativo)
export const Medalhao: React.FC<{x: number; y: number; r?: number; tipo: Parameters<typeof Picto>[0]['tipo']; cor?: string; s?: number}> = ({x, y, r = 56, tipo, cor = C.roxo, s = 1}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<circle r={r} fill={cor} stroke={C.escuro} strokeWidth={LW} />
		<g transform={`scale(${r / 40})`}>
			<Picto tipo={tipo} cor={C.creme} />
		</g>
	</g>
);
