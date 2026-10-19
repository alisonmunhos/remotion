import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import palavras from './data/palavras.json';
import {C, CORPO_S, eio, eo, F, LW, lerp, lin} from './tokens';

// ---------------------------------------------------------------------------
// Mesa: o mundo do vídeo. Fundo escuro com vinheta (o mesmo do fecho da marca) e grade sutil.
export const Mesa: React.FC<{gradeOpacity: number}> = ({gradeOpacity}) => (
	<AbsoluteFill>
		<Img src={staticFile('mesa.png')} style={{width: '100%', height: '100%'}} />
		<AbsoluteFill
			style={{
				opacity: gradeOpacity,
				backgroundImage: `linear-gradient(to right, rgba(238,233,225,.05) 2px, transparent 2px), linear-gradient(to bottom, rgba(238,233,225,.05) 2px, transparent 2px)`,
				backgroundSize: '90px 90px',
				backgroundPosition: '45px 0',
				WebkitMaskImage: 'radial-gradient(ellipse 70% 55% at 50% 45%, #000 30%, transparent 100%)',
			}}
		/>
	</AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Definições SVG compartilhadas: traço "vivo" (muda 8x por segundo) e hachuras.
export const Defs: React.FC<{t: number}> = ({t}) => {
	const seed = 1 + (Math.floor(t * 8) % 6);
	return (
		<svg width={0} height={0} style={{position: 'absolute'}}>
			<defs>
				<filter id="traco" x="-10%" y="-10%" width="120%" height="120%">
					<feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={seed} />
					<feDisplacementMap in="SourceGraphic" scale={6} xChannelSelector="R" yChannelSelector="G" />
				</filter>
				<pattern id="hachura" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
					<line x1="0" y1="0" x2="0" y2="14" stroke={C.escuro} strokeWidth="2.5" strokeOpacity=".5" />
				</pattern>
				<pattern id="hachuraOcre" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
					<line x1="0" y1="0" x2="0" y2="16" stroke={C.ocre} strokeWidth="3" />
				</pattern>
				<pattern id="hachuraRoxo" width="13" height="13" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
					<line x1="0" y1="0" x2="0" y2="13" stroke={C.roxo} strokeWidth="3" />
				</pattern>
				<pattern id="hachuraVerm" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
					<line x1="0" y1="0" x2="0" y2="12" stroke={C.vermelho} strokeWidth="2.5" />
				</pattern>
				<filter id="carimbo">
					<feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves={2} seed={5} result="n" />
					<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.75" result="m" />
					<feComposite in="SourceGraphic" in2="m" operator="in" />
				</filter>
			</defs>
		</svg>
	);
};

// ---------------------------------------------------------------------------
// Papel: folha creme sobre a mesa, com câmera 3D. Entra pela direita e sai pela esquerda ("vire à esquerda").
export const Papel: React.FC<{
	t: number;
	tIn: number;
	tOut: number;
	w: number;
	h: number;
	top: number;
	dx?: number;
	semPapel?: boolean;
	tilt?: number;
	children: React.ReactNode;
}> = ({t, tIn, tOut, w, h, top, dx = 0, semPapel = false, tilt = 9, children}) => {
	if (t < tIn - 0.05 || t > tOut + 0.5) return null;
	const a = eo(lin(t, tIn, tIn + 0.45));
	const b = eio(lin(t, tOut, tOut + 0.45));
	const x = lerp(950, 0, a) + lerp(0, -1150, b) + dx;
	const ry = lerp(-28, -6, a) + lerp(0, 24, b) + 2.5 * Math.sin((t - tIn) * 1.2);
	const rz = lerp(4, -1.5, a);
	const z = -40 + 30 * lin(t, tIn, tOut);
	const blur = b * 12 + (1 - a) * 6;
	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top,
				width: w,
				height: h,
				marginLeft: -w / 2,
				transform: `translate3d(${x}px,0,${z}px) rotateX(${tilt}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
				filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
				transformStyle: 'preserve-3d',
			}}
		>
			<div
				style={{
					width: w,
					height: h,
					position: 'relative',
					background: semPapel ? 'transparent' : C.creme,
					borderRadius: 22,
					boxShadow: semPapel ? undefined : '0 40px 70px rgba(20,20,20,.75), 0 6px 14px rgba(20,20,20,.6)',
				}}
			>
				{children}
			</div>
		</div>
	);
};

// ---------------------------------------------------------------------------
// Peças de desenho
export const traco = {stroke: C.escuro, strokeWidth: LW, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

// caminho desenhado progressivamente (u de 0 a 1)
export const Desenho: React.FC<{d: string; u: number; cor?: string; w?: number; fill?: string}> = ({d, u, cor = C.coral, w = 8, fill = 'none'}) =>
	u <= 0 ? null : (
		<path d={d} fill={fill} stroke={cor} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - u} />
	);

// texto manuscrito (Caveat), em coral por padrão; aparece com leve subida
export const Mao: React.FC<{x: number; y: number; t: number; t0: number; size?: number; rot?: number; anchor?: 'start' | 'middle' | 'end'; cor?: string; children: string}> = ({
	x,
	y,
	t,
	t0,
	size = 64,
	rot = -4,
	anchor = 'middle',
	cor = C.coral,
	children,
}) => {
	const a = eo(lin(t, t0, t0 + 0.22));
	if (a <= 0) return null;
	return (
		<text
			x={x}
			y={y + (1 - a) * 14}
			textAnchor={anchor}
			opacity={a}
			transform={`rotate(${rot} ${x} ${y})`}
			style={{fontFamily: F.mao, fontWeight: 700, fontSize: size}}
			fill={cor}
		>
			{children}
		</text>
	);
};

// rótulo de seção dentro do papel ("— TÍTULO")
export const Rotulo: React.FC<{x?: number; y?: number; children: string}> = ({x = 44, y = 66, children}) => (
	<text x={x} y={y} style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 5}} fill={C.escuro} fillOpacity={0.55}>
		— {children}
	</text>
);

// pessoa: o mesmo personagem em todo o vídeo (cabeça + tronco hachurado); braços opcionais
export const Pessoa: React.FC<{x: number; y: number; s?: number; bracos?: 'nenhum' | 'abertos' | 'apontando'; cor?: string; preenchimento?: string}> = ({
	x,
	y,
	s = 1,
	bracos = 'nenhum',
	cor = C.escuro,
	preenchimento = 'url(#hachura)',
}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#traco)">
		{bracos === 'abertos' ? (
			<path d="M-58,-60 L-118,-128 M58,-60 L118,-128" fill="none" stroke={cor} strokeWidth={LW} strokeLinecap="round" />
		) : null}
		{bracos === 'apontando' ? <path d="M58,-60 L128,-104" fill="none" stroke={cor} strokeWidth={LW} strokeLinecap="round" /> : null}
		<path d="M-70,0 V-50 Q-70,-100 -15,-100 H15 Q70,-100 70,-50 V0" fill={preenchimento} stroke={cor} strokeWidth={LW} strokeLinejoin="round" />
		<path d="M-70,0 H70" stroke={cor} strokeWidth={LW} strokeLinecap="round" />
		<circle cx={0} cy={-145} r={38} fill={C.creme} stroke={cor} strokeWidth={LW} />
	</g>
);

// ---------------------------------------------------------------------------
// Sobreposições globais: barra de progresso, capítulo, legenda e linha de fonte.
export const Barra: React.FC<{t: number}> = ({t}) => (
	<div style={{position: 'absolute', left: 0, top: 0, height: 8, width: `${(t / CORPO_S) * 100}%`, background: C.coral}} />
);

export const CAPITULOS: [number, number, string, string][] = [
	[0, 7.3, '01', 'IMPOSTO DE RENDA'],
	[7.3, 12.8, '02', 'O QUE É RENDA'],
	[12.8, 16.4, '03', 'CARTEIRA ASSINADA'],
	[16.4, 22.1, '04', 'QUEM COBRA'],
	[22.1, 32.7, '05', 'A DECLARAÇÃO'],
	[32.7, 42.1, '06', 'PRA ONDE VAI O DINHEIRO'],
	[42.1, 45.0, '07', 'IMPOSTO VOLTA?'],
	[45.0, 55.5, '08', 'NOS ESTADOS UNIDOS'],
	[55.5, 59.9, '09', 'E AQUI?'],
	[59.9, 64.7, '10', 'TEM NOVIDADE'],
	[64.7, 66.75, '11', 'PRÓXIMO POST'],
];

export const Capitulo: React.FC<{t: number}> = ({t}) => {
	const c = CAPITULOS.find(([a, b]) => t >= a && t < b);
	if (!c) return null;
	const [a, b, num, titulo] = c;
	const op = eo(lin(t, a, a + 0.3)) * (1 - lin(t, b - 0.2, b));
	return (
		<div style={{position: 'absolute', left: 80, top: 172, display: 'flex', alignItems: 'center', gap: 18, opacity: op, transform: `translateX(${(1 - eo(lin(t, a, a + 0.3))) * 30}px)`}}>
			<div style={{width: 44, height: 5, borderRadius: 3, background: C.coral}} />
			<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: C.creme}}>
				<span style={{color: C.coral}}>{num}</span>&nbsp;&nbsp;{titulo}
			</div>
		</div>
	);
};

// palavras-chave destacadas em coral, na ordem em que aparecem
const DESTAQUES = [
	'contracheque', 'sumiu.', 'Imposto de Renda.', 'salário,', 'aposentadoria,', 'aluguel,', 'descontado.', 'Receita Federal.', 'bolo.', 'cobertura!',
	'declaração:', 'devolve.', 'completa.', 'nem todo mundo', 'estados', 'prefeituras:', 'posto de saúde,', 'SUS,', 'universidades', 'programas sociais.',
	'Volta sim!', 'plano de saúde,', 'SUS.', '27 milhões', 'fortuna.', 'SUS', 'universidade pública.', 'novidade!', 'cinco mil', 'bolso.',
];
type Palavra = {w: string; s: number; e: number; hi?: boolean};
const PAL: Palavra[] = (palavras as Palavra[]).map((p) => ({...p}));
{
	let from = 0;
	for (const frase of DESTAQUES) {
		const parts = frase.split(' ');
		for (let i = from; i <= PAL.length - parts.length; i++) {
			if (parts.every((p, k) => PAL[i + k].w === p)) {
				parts.forEach((_, k) => (PAL[i + k].hi = true));
				from = i + parts.length;
				break;
			}
		}
	}
}
// agrupa em linhas curtas: quebra em pontuação forte ou acima de 26 caracteres
const LINHAS: {ws: Palavra[]; from: number; to: number}[] = [];
{
	let cur: Palavra[] = [];
	const flush = () => {
		if (cur.length) LINHAS.push({ws: cur, from: cur[0].s - 0.05, to: 0});
		cur = [];
	};
	for (const p of PAL) {
		const len = cur.map((x) => x.w).join(' ').length + p.w.length + 1;
		if (cur.length && len > 26) flush();
		cur.push(p);
		if (/[.?!:]$/.test(p.w)) flush();
	}
	flush();
	LINHAS.forEach((l, i) => {
		const fim = l.ws[l.ws.length - 1].e + 0.45;
		const prox = LINHAS[i + 1] ? LINHAS[i + 1].from : CORPO_S - 0.15;
		l.to = Math.min(fim, prox);
	});
}

export const Legenda: React.FC<{t: number}> = ({t}) => {
	const l = LINHAS.find((x) => t >= x.from && t < x.to);
	if (!l) return null;
	const sai = lin(t, l.to - 0.1, l.to);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 1490, display: 'flex', justifyContent: 'center', opacity: 1 - sai}}>
			<div
				style={{
					background: 'rgba(20,20,20,.88)',
					borderRadius: 20,
					padding: '16px 32px 22px',
					fontFamily: F.sans,
					fontWeight: 800,
					fontSize: 60,
					letterSpacing: -1,
					color: C.creme,
					whiteSpace: 'nowrap',
				}}
			>
				{l.ws
					.filter((p) => t >= p.s - 0.03)
					.map((p, i) => {
						const a = lin(t, p.s - 0.03, p.s + 0.07);
						return (
							<span key={i} style={{display: 'inline-block', marginRight: '.26em', opacity: a, transform: `translateY(${(1 - a) * 10}px)`, color: p.hi ? C.coral : C.creme}}>
								{p.w}
							</span>
						);
					})}
			</div>
		</div>
	);
};

export const FONTES: [number, number, string][] = [
	[0.0, 7.3, 'Exemplo: salário de R$ 4.000, com as tabelas de 2025 do INSS e da Receita Federal.'],
	[22.1, 32.7, 'Receita Federal, regras de obrigatoriedade da declaração do IRPF.'],
	[32.7, 38.5, 'Constituição Federal, art. 159.'],
	[50.0, 52.6, 'US Census Bureau, cobertura de saúde.'],
	[59.9, 64.7, 'Lei 15.270/2025, em vigor desde janeiro de 2026.'],
];

export const Fonte: React.FC<{t: number}> = ({t}) => {
	const f = FONTES.find(([a, b]) => t >= a && t < b);
	if (!f) return null;
	const [a, b, txt] = f;
	const op = lin(t, a + 0.3, a + 0.6) * (1 - lin(t, b - 0.2, b));
	return (
		<div style={{position: 'absolute', left: 80, right: 120, top: 1652, opacity: op}}>
			<div style={{width: 170, height: 2, background: C.creme, opacity: 0.4, marginBottom: 16}} />
			<div style={{fontFamily: F.mono, fontSize: 25, lineHeight: '34px', color: C.creme, opacity: 0.8}}>
				<b style={{fontWeight: 800}}>FONTE</b> {txt}
			</div>
		</div>
	);
};
