// Gera frame_01.png ... frame_08.png (1080x1920) a partir de SVG desenhado em código.
// Uso: node gerar.js <pasta-com-dados-e-node_modules>
const fs = require('fs');
const path = require('path');
const DATA = process.argv[2];
const {chromium} = require(path.join(DATA, 'node_modules/playwright-core'));
const d3 = require(path.join(DATA, 'node_modules/d3-geo'));
const topo = require(path.join(DATA, 'node_modules/topojson-client'));

const C = {
	escuro: '#141414',
	creme: '#EEE9E1',
	coral: '#FF5F45',
	ocre: '#C9A26B',
	vermelho: '#9B2C2C',
	roxo: '#7A5CC4',
};
const W = 1080;
const H = 1920;
const LW = 5; // espessura do traço principal

const fontsDir = path.join(__dirname, 'fonts');
const fontFace = [500, 600, 700]
	.map(
		(w) =>
			`@font-face{font-family:'Caveat';font-weight:${w};src:url('data:font/woff2;base64,${fs
				.readFileSync(path.join(fontsDir, `caveat-latin-${w}.woff2`))
				.toString('base64')}') format('woff2');}`,
	)
	.join('\n');

const HAND = `font-family:Caveat;font-weight:700;fill:${C.coral}`;
const SANS = 'font-family:Inter';
const MONO = "font-family:'JetBrains Mono'";

// ---------- utilidades ----------
const esc = (s) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// linha "à mão": pequena oscilação determinística
let seed = 7;
const rnd = () => {
	seed = (seed * 16807) % 2147483647;
	return seed / 2147483647;
};
const handLine = (x1, y1, x2, y2, j = 2.2) => {
	const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 60));
	let d = `M${x1},${y1}`;
	for (let i = 1; i <= n; i++) {
		const t = i / n;
		const x = x1 + (x2 - x1) * t + (i < n ? (rnd() - 0.5) * j : 0);
		const y = y1 + (y2 - y1) * t + (i < n ? (rnd() - 0.5) * j : 0);
		d += ` L${x.toFixed(1)},${y.toFixed(1)}`;
	}
	return d;
};
// elipse à mão com sobreposição no fim (como um círculo feito de caneta)
const handEllipse = (cx, cy, rx, ry, turns = 1.12, start = -2.2) => {
	let d = '';
	const steps = 90;
	for (let i = 0; i <= steps; i++) {
		const a = start + (i / steps) * Math.PI * 2 * turns;
		const k = 1 + 0.05 * Math.sin(i * 0.21) + (i / steps) * 0.06;
		const x = cx + Math.cos(a) * rx * k;
		const y = cy + Math.sin(a) * ry * k;
		d += `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)} `;
	}
	return d;
};

const defs = `
<defs>
	<pattern id="hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
		<line x1="0" y1="0" x2="0" y2="14" stroke="${C.escuro}" stroke-width="2" stroke-opacity="0.55"/>
	</pattern>
	<pattern id="hatchOcre" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
		<line x1="0" y1="0" x2="0" y2="16" stroke="${C.ocre}" stroke-width="3"/>
	</pattern>
	<pattern id="hatchRoxo" width="13" height="13" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
		<line x1="0" y1="0" x2="0" y2="13" stroke="${C.roxo}" stroke-width="3"/>
	</pattern>
	<pattern id="hatchVerm" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
		<line x1="0" y1="0" x2="0" y2="12" stroke="${C.vermelho}" stroke-width="2.5"/>
	</pattern>
	<filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
		<feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="3"/>
		<feDisplacementMap in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G"/>
	</filter>
	<filter id="grain">
		<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="11" result="n"/>
		<feColorMatrix in="n" type="matrix" values="0 0 0 0 0.0784  0 0 0 0 0.0784  0 0 0 0 0.0784  0 0 0 -2.4 1.25"/>
		<feComposite in2="SourceGraphic" operator="in"/>
	</filter>
	<filter id="stamp">
		<feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="5" result="n"/>
		<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.75" result="m"/>
		<feComposite in="SourceGraphic" in2="m" operator="in"/>
	</filter>
	<marker id="arrowCoral" viewBox="0 0 20 20" refX="14" refY="10" markerWidth="9" markerHeight="9" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
	</marker>
</defs>`;

// cabeçalho de capítulo (topo), legenda e fonte (parte inferior)
const chapter = (num, title) => `
	<line x1="80" y1="196" x2="124" y2="196" stroke="${C.coral}" stroke-width="5" stroke-linecap="round"/>
	<text x="142" y="206" style="${MONO};font-weight:700;font-size:30px;letter-spacing:5px">
		<tspan fill="${C.coral}">${num}</tspan><tspan fill="${C.escuro}" dx="14">${esc(title)}</tspan>
	</text>`;

// legenda: partes [{t, hi}] — hi=true pinta de coral
const caption = (parts, y = 1470) => `
	<text x="${W / 2}" y="${y}" text-anchor="middle" style="${SANS};font-weight:800;font-size:66px;letter-spacing:-1.5px" fill="${C.escuro}">${parts
		.map((p) => `<tspan${p.hi ? ` fill="${C.coral}"` : ''}>${esc(p.t)}</tspan>`)
		.join('')}</text>`;

// linha de fonte: quebra simples por largura aproximada de caractere mono
const source = (txt) => {
	const maxChars = 50;
	const words = ('FONTE ' + txt).split(' ');
	const lines = [];
	let cur = '';
	for (const w of words) {
		if ((cur + ' ' + w).trim().length > maxChars) {
			lines.push(cur.trim());
			cur = w;
		} else cur += ' ' + w;
	}
	lines.push(cur.trim());
	// a última linha de base fica em 1730: tudo acima de 1785 (93% da altura)
	const lh = 36;
	const y0 = 1730 - (lines.length - 1) * lh;
	return `
	<line x1="80" y1="${y0 - 52}" x2="250" y2="${y0 - 52}" stroke="${C.escuro}" stroke-opacity="0.45" stroke-width="2"/>
	${lines
		.map((l, i) => {
			const body =
				i === 0
					? `<tspan style="font-weight:800">FONTE</tspan> ${esc(l.slice(6))}`
					: esc(l);
			return `<text x="80" y="${y0 + i * lh}" style="${MONO};font-weight:400;font-size:26px" fill="${C.escuro}" fill-opacity="0.85">${body}</text>`;
		})
		.join('\n')}`;
};

const page = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFace}
html,body{margin:0;padding:0;background:${C.creme};}
svg{display:block}
</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${defs}
<rect width="${W}" height="${H}" fill="${C.creme}"/>
<rect width="${W}" height="${H}" fill="${C.creme}" filter="url(#grain)" opacity="0.10"/>
${inner}
</svg></body></html>`;

// ---------- objetos ----------
const stroke = `stroke="${C.escuro}" stroke-width="${LW}" stroke-linejoin="round" stroke-linecap="round"`;

// contracheque (frames 01 e 08) — mesma geometria e posição
const PAY = {x: 110, y: 430, w: 860, h: 760, rot: -1.5};
const payRows = [
	{label: 'Salário bruto', value: 'R$ 4.000', y: 720},
	{label: 'INSS', value: '– R$ 373', y: 815, neg: true},
	{label: 'Imposto de Renda', value: '– R$ 115', y: 910, neg: true},
	{label: 'Líquido', value: 'R$ 3.512', y: 1060, bold: true},
];
const VAL_X = 690; // valores alinhados à direita aqui; o espaço depois fica livre para anotações
const payslip = (overlay = '') => {
	const {x, y, w, h, rot} = PAY;
	const fold = 70;
	const cx = x + w / 2;
	const cy = y + h / 2;
	return `
<g transform="rotate(${rot} ${cx} ${cy})">
	<path d="M${x + 18},${y + 22} h${w - fold} l${fold},${fold} v${h - fold} h${-w} z" fill="${C.ocre}" fill-opacity="0.55"/>
	<g filter="url(#wobble)">
		<path d="M${x},${y} h${w - fold} l${fold},${fold} v${h - fold} h${-w} z" fill="${C.creme}" ${stroke}/>
		<path d="M${x + w - fold},${y} v${fold} h${fold}" fill="none" ${stroke}/>
		<path d="${handLine(x + 50, 980, x + w - 50, 980)}" ${stroke} fill="none"/>
	</g>
	<text x="${x + 50}" y="${y + 105}" style="${SANS};font-weight:900;font-size:56px;letter-spacing:1px" fill="${C.escuro}">CONTRACHEQUE</text>
	<text x="${x + 52}" y="${y + 160}" style="${MONO};font-size:24px;letter-spacing:2px" fill="${C.escuro}" fill-opacity="0.6">COMPETÊNCIA 01 · VALORES EM REAIS</text>
	<line x1="${x + 50}" y1="${y + 200}" x2="${x + w - 50}" y2="${y + 200}" stroke="${C.escuro}" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="8 8"/>
	${payRows
		.map(
			(r) => `
	<text x="${x + 50}" y="${r.y}" style="${SANS};font-weight:${r.bold ? 900 : 600};font-size:${r.bold ? 40 : 36}px" fill="${C.escuro}">${esc(r.label)}</text>
	<text x="${VAL_X}" y="${r.y}" text-anchor="end" style="${MONO};font-weight:${r.bold ? 800 : 500};font-size:${r.bold ? 40 : 34}px" fill="${r.neg ? C.vermelho : C.escuro}">${esc(r.value)}</text>`,
		)
		.join('')}
	${overlay}
</g>`;
};

// pessoa simples, em traço (cabeça + corpo + braços + pernas)
const person = (cx, top, s = 1, opts = {}) => {
	const {armsOpen = false, fill = C.creme, color = C.escuro, lw = LW} = opts;
	const st = `stroke="${color}" stroke-width="${lw}" stroke-linecap="round" stroke-linejoin="round"`;
	const head = 26 * s;
	const hy = top + head;
	const bTop = hy + head + 10 * s;
	const bBot = bTop + 120 * s;
	const arms = armsOpen
		? `<path d="M${cx - 34 * s},${bTop + 22 * s} L${cx - 95 * s},${bTop - 30 * s} M${cx + 34 * s},${bTop + 22 * s} L${cx + 95 * s},${bTop - 30 * s}" fill="none" ${st}/>
		   <path d="M${cx - 95 * s},${bTop - 30 * s} l-14,-10 M${cx - 95 * s},${bTop - 30 * s} l-4,-16 M${cx + 95 * s},${bTop - 30 * s} l14,-10 M${cx + 95 * s},${bTop - 30 * s} l4,-16" fill="none" ${st}/>`
		: `<path d="M${cx - 36 * s},${bTop + 20 * s} L${cx - 48 * s},${bTop + 100 * s} M${cx + 36 * s},${bTop + 20 * s} L${cx + 48 * s},${bTop + 100 * s}" fill="none" ${st}/>`;
	return `<g>
		${arms}
		<path d="M${cx - 38 * s},${bBot} L${cx - 38 * s},${bTop + 30 * s} Q${cx - 38 * s},${bTop} ${cx - 8 * s},${bTop} L${cx + 8 * s},${bTop} Q${cx + 38 * s},${bTop} ${cx + 38 * s},${bTop + 30 * s} L${cx + 38 * s},${bBot} Z" fill="${fill}" ${st}/>
		<path d="M${cx - 20 * s},${bBot} L${cx - 22 * s},${bBot + 80 * s} M${cx + 20 * s},${bBot} L${cx + 22 * s},${bBot + 80 * s}" fill="none" ${st}/>
		<circle cx="${cx}" cy="${hy}" r="${head}" fill="${fill}" ${st}/>
	</g>`;
};

// ---------- quadros ----------
const frames = {};

frames.frame_01 = () =>
	page(`
${chapter('01', 'IMPOSTO DE RENDA')}
${payslip(`<path d="${handEllipse(VAL_X - 95, 1046, 150, 58)}" fill="none" stroke="${C.coral}" stroke-width="7" stroke-linecap="round"/>`)}
${caption([{t: 'Ele não '}, {t: 'sumiu', hi: true}, {t: '.'}])}
${source('Exemplo: salário de R$ 4.000, com as tabelas de 2025 do INSS e da Receita Federal.')}
`);

frames.frame_08 = () => {
	const strike = (x1, x2, y) =>
		`<path d="M${x1},${y + 4} C${(x1 + x2) / 2},${y - 10} ${(x1 + x2) / 2},${y + 6} ${x2},${y - 8}" fill="none" stroke="${C.coral}" stroke-width="6" stroke-linecap="round"/>
		 <path d="M${x1 + 6},${y - 6} C${(x1 + x2) / 2},${y + 6} ${(x1 + x2) / 2},${y - 12} ${x2 - 4},${y + 2}" fill="none" stroke="${C.coral}" stroke-width="5" stroke-linecap="round"/>`;
	return page(`
${chapter('11', 'TEM NOVIDADE')}
${payslip(`
	${strike(150, 700, 897)}
	<text x="725" y="922" style="${HAND};font-size:72px">R$ 0</text>
	${strike(490, 702, 1046)}
	<text x="720" y="1068" style="${HAND};font-size:64px">R$ 3.627</text>
`)}
<text x="540" y="350" text-anchor="middle" style="${HAND};font-size:110px" transform="rotate(-3 540 350)">novidade!</text>
<path d="M370,384 C450,372 560,370 712,362" fill="none" stroke="${C.coral}" stroke-width="7" stroke-linecap="round" transform="rotate(-3 540 350)"/>
<path d="M392,402 C480,394 580,394 690,386" fill="none" stroke="${C.coral}" stroke-width="5" stroke-linecap="round" transform="rotate(-3 540 350)"/>
${caption([{t: 'mais '}, {t: 'Imposto de Renda', hi: true}, {t: '.'}])}
${source('Lei 15.270/2025, em vigor desde janeiro de 2026.')}
`);
};

frames.frame_02 = () => {
	// pote
	const jx = 470;
	const jarTop = 760;
	const jar = `
	<g filter="url(#wobble)">
		<path d="M${jx - 205},${jarTop + 70} Q${jx - 205},${jarTop + 30} ${jx - 165},${jarTop + 30} L${jx + 165},${jarTop + 30} Q${jx + 205},${jarTop + 30} ${jx + 205},${jarTop + 70} L${jx + 205},1250 Q${jx + 205},1300 ${jx + 155},1300 L${jx - 155},1300 Q${jx - 205},1300 ${jx - 205},1250 Z" fill="${C.creme}" ${stroke}/>
		<path d="M${jx - 205},1170 Q${jx},1140 ${jx + 205},1170 L${jx + 205},1250 Q${jx + 205},1300 ${jx + 155},1300 L${jx - 155},1300 Q${jx - 205},1300 ${jx - 205},1250 Z" fill="${C.ocre}" fill-opacity="0.55"/>
		<path d="M${jx - 205},1170 Q${jx},1140 ${jx + 205},1170 L${jx + 205},1250 Q${jx + 205},1300 ${jx + 155},1300 L${jx - 155},1300 Q${jx - 205},1300 ${jx - 205},1250 Z" fill="url(#hatchOcre)"/>
		<path d="M${jx - 205},${jarTop + 70} Q${jx - 205},${jarTop + 30} ${jx - 165},${jarTop + 30} L${jx + 165},${jarTop + 30} Q${jx + 205},${jarTop + 30} ${jx + 205},${jarTop + 70} L${jx + 205},1250 Q${jx + 205},1300 ${jx + 155},1300 L${jx - 155},1300 Q${jx - 205},1300 ${jx - 205},1250 Z" fill="none" ${stroke}/>
		<rect x="${jx - 175}" y="${jarTop}" width="350" height="34" rx="6" fill="${C.creme}" ${stroke}/>
		<path d="M${jx - 160},${jarTop + 100} q-8,60 0,140" fill="none" stroke="${C.escuro}" stroke-width="4" stroke-linecap="round" stroke-opacity="0.5"/>
		<rect x="${jx - 150}" y="${jarTop + 140}" width="300" height="150" rx="8" fill="${C.creme}" ${stroke}/>
	</g>
	<text x="${jx}" y="${jarTop + 240}" text-anchor="middle" style="${SANS};font-weight:900;font-size:70px;letter-spacing:3px" fill="${C.escuro}">RENDA</text>`;

	// itens caindo
	const holerite = `<g transform="translate(250 430) rotate(-14)" filter="url(#wobble)">
		<path d="M-60,-80 h90 l30,30 v130 h-120 z" fill="${C.creme}" ${stroke}/>
		<path d="M30,-80 v30 h30" fill="none" ${stroke}/>
		<path d="M-40,-30 h70 M-40,0 h80 M-40,30 h50" stroke="${C.escuro}" stroke-width="4" stroke-linecap="round"/>
		<text x="-40" y="68" style="${MONO};font-weight:800;font-size:26px" fill="${C.escuro}">R$</text>
	</g>`;
	const card = `<g transform="translate(560 330) rotate(9)" filter="url(#wobble)">
		<rect x="-95" y="-60" width="190" height="120" rx="14" fill="${C.creme}" ${stroke}/>
		<circle cx="-48" cy="-12" r="18" fill="none" stroke="${C.escuro}" stroke-width="4"/>
		<path d="M-76,32 q28,-36 56,0" fill="none" stroke="${C.escuro}" stroke-width="4" stroke-linecap="round"/>
		<path d="M5,-20 h60 M5,4 h48 M5,28 h60" stroke="${C.escuro}" stroke-width="4" stroke-linecap="round"/>
	</g>`;
	const house = `<g transform="translate(700 560) rotate(-8)" filter="url(#wobble)">
		<path d="M-70,-10 L0,-75 L70,-10" fill="none" ${stroke}/>
		<path d="M-55,-22 V70 H55 V-22" fill="${C.creme}" ${stroke}/>
		<path d="M-55,-22 L0,-72 L55,-22 Z" fill="url(#hatch)"/>
		<rect x="-16" y="20" width="32" height="50" fill="${C.creme}" stroke="${C.escuro}" stroke-width="4"/>
		<rect x="22" y="0" width="22" height="22" fill="${C.creme}" stroke="${C.escuro}" stroke-width="4"/>
	</g>`;
	// riscos de movimento
	const motion = (x, y) =>
		`<path d="M${x},${y} v-50 M${x + 22},${y - 14} v-40 M${x - 22},${y - 10} v-34" stroke="${C.escuro}" stroke-opacity="0.45" stroke-width="4" stroke-linecap="round"/>`;
	return page(`
${chapter('02', 'O QUE É RENDA')}
${motion(262, 320)}${motion(566, 236)}${motion(706, 452)}
${holerite}${card}${house}
<text x="210" y="604" text-anchor="middle" style="${HAND};font-size:58px" transform="rotate(-6 210 604)">salário</text>
<text x="690" y="250" style="${HAND};font-size:58px" transform="rotate(-4 690 250)">aposentadoria</text>
<text x="800" y="680" style="${HAND};font-size:58px" transform="rotate(-4 800 680)">aluguel</text>
<path d="M300,510 q30,120 90,240" fill="none" stroke="${C.escuro}" stroke-opacity="0.0"/>
${jar}
${person(860, 1064, 0.9)}
<path d="M140,1300 h860" stroke="${C.escuro}" stroke-width="${LW}" stroke-linecap="round"/>
${caption([{t: 'salário, aposentadoria, até '}, {t: 'aluguel', hi: true}], 1470)}
`);
};

frames.frame_03 = () => {
	const ctps = `<g transform="translate(290 640) rotate(-6)" filter="url(#wobble)">
		<rect x="-150" y="-215" width="300" height="430" rx="16" fill="${C.roxo}" ${stroke}/>
		<path d="M-122,-215 v430" stroke="${C.escuro}" stroke-width="3" stroke-opacity="0.6"/>
		<circle cx="15" cy="-95" r="48" fill="none" stroke="${C.creme}" stroke-width="5"/>
		<path d="M15,-143 v96 M-33,-95 h96" stroke="${C.creme}" stroke-width="3"/>
		<text x="15" y="10" text-anchor="middle" style="${SANS};font-weight:900;font-size:30px;letter-spacing:2px" fill="${C.creme}">CARTEIRA</text>
		<text x="15" y="46" text-anchor="middle" style="${SANS};font-weight:900;font-size:30px;letter-spacing:2px" fill="${C.creme}">DE TRABALHO</text>
		<path d="M-50,110 h130 M-50,140 h100" stroke="${C.creme}" stroke-width="4" stroke-linecap="round" stroke-opacity="0.6"/>
	</g>`;
	const slip = `<g transform="translate(690 620) rotate(4)">
		<path d="M-168,-244 h300 l60,60 v460 h-360 z" fill="${C.ocre}" fill-opacity="0.55"/>
		<g filter="url(#wobble)">
			<path d="M-180,-260 h300 l60,60 v460 h-360 z" fill="${C.creme}" ${stroke}/>
			<path d="M120,-260 v60 h60" fill="none" ${stroke}/>
		</g>
		<text x="-150" y="-190" style="${SANS};font-weight:900;font-size:32px" fill="${C.escuro}">CONTRACHEQUE</text>
		${[-110, -40, 30, 100, 170]
			.map(
				(yy, i) =>
					`<path d="M-150,${yy} h${[150, 110, 170, 90, 130][i]}" stroke="${C.escuro}" stroke-width="5" stroke-linecap="round"/>
					 <path d="M60,${yy} h90" stroke="${i === 1 || i === 2 ? C.vermelho : C.escuro}" stroke-width="5" stroke-linecap="round"/>`,
			)
			.join('')}
	</g>`;
	const stamp = `<g transform="translate(690 650) rotate(-14)" filter="url(#stamp)">
		<rect x="-180" y="-58" width="360" height="116" rx="10" fill="none" stroke="${C.vermelho}" stroke-width="9"/>
		<rect x="-166" y="-44" width="332" height="88" rx="6" fill="none" stroke="${C.vermelho}" stroke-width="3"/>
		<text x="0" y="22" text-anchor="middle" style="${SANS};font-weight:900;font-size:56px;letter-spacing:3px" fill="${C.vermelho}">DESCONTADO</text>
	</g>`;
	return page(`
${chapter('03', 'CARTEIRA ASSINADA')}
${ctps}
${slip}
${stamp}
${person(540, 985, 1.0, {armsOpen: true})}
<path d="M380,1310 h320" stroke="${C.escuro}" stroke-width="${LW}" stroke-linecap="round"/>
${caption([{t: 'porque já vem '}, {t: 'descontado', hi: true}, {t: '.'}])}
`);
};

// prédio e bolo compartilham a mesma caixa: x 220–860, base em y=1080
const BASE_Y = 1080;
const receitaLabel = `<text x="540" y="1205" text-anchor="middle" style="${HAND};font-size:96px" transform="rotate(-2 540 1205)">Receita Federal</text>`;

frames.frame_04 = () => {
	const cols = [0, 1, 2, 3, 4, 5].map((i) => 300 + i * 96);
	const building = `<g filter="url(#wobble)">
		<path d="M230,580 L540,410 L850,580 Z" fill="${C.roxo}" fill-opacity="0.25" ${stroke}/>
		<path d="M230,580 L540,410 L850,580 Z" fill="url(#hatchRoxo)"/>
		<path d="M230,580 L540,410 L850,580 Z" fill="none" ${stroke}/>
		<path d="M480,532 h120" stroke="${C.escuro}" stroke-width="4"/>
		<rect x="230" y="580" width="620" height="44" fill="${C.creme}" ${stroke}/>
		${cols
			.map(
				(cx) => `
		<rect x="${cx - 26}" y="624" width="52" height="16" fill="${C.creme}" ${stroke}/>
		<path d="M${cx - 20},640 V982 M${cx + 20},640 V982" fill="none" ${stroke}/>
		<path d="M${cx - 6},655 V968 M${cx + 6},655 V968" stroke="${C.escuro}" stroke-width="2.5" stroke-opacity="0.5"/>
		<rect x="${cx - 26}" y="982" width="52" height="16" fill="${C.creme}" ${stroke}/>`,
			)
			.join('')}
		<rect x="215" y="998" width="650" height="30" fill="${C.creme}" ${stroke}/>
		<rect x="195" y="1028" width="690" height="26" fill="${C.creme}" ${stroke}/>
		<rect x="175" y="1054" width="730" height="26" fill="${C.creme}" ${stroke}/>
	</g>`;
	return page(`
${chapter('04', 'QUEM COBRA')}
${building}
${receitaLabel}
${caption([{t: 'Quem cobra é a '}, {t: 'Receita Federal', hi: true}, {t: '.'}])}
`);
};

frames.frame_05 = () => {
	// cobertura com pingos nas bordas
	const icing = (x1, x2, y, drops) => {
		let d = `M${x1 - 6},${y - 14} L${x2 + 6},${y - 14} L${x2 + 6},${y + 18}`;
		const n = drops.length;
		const step = (x2 - x1 + 12) / n;
		for (let i = 0; i < n; i++) {
			const xa = x2 + 6 - i * step;
			const xb = xa - step;
			const len = drops[i];
			d += ` C${xa},${y + 18 + len} ${xa - step * 0.5},${y + 18 + len} ${xa - step * 0.5},${y + 18 + len * 0.6}`;
			d += ` C${xa - step * 0.5},${y + 26} ${xb},${y + 26} ${xb},${y + 18}`;
		}
		d += ' Z';
		return d;
	};
	const sprinkles = (x1, x2, y1, y2, n) => {
		let s = '';
		for (let i = 0; i < n; i++) {
			const x = x1 + rnd() * (x2 - x1);
			const y = y1 + rnd() * (y2 - y1);
			const a = rnd() * 180;
			s += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="20" height="7" rx="3.5" fill="${C.roxo}" transform="rotate(${a.toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`;
		}
		return s;
	};
	const candles = [410, 475, 540, 605, 670]
		.map(
			(cx, i) => `
		<rect x="${cx - 12}" y="${610 - (i % 2) * 14}" width="24" height="${100 + (i % 2) * 14}" rx="4" fill="${C.creme}" ${stroke}/>
		<path d="M${cx - 12},${640 - (i % 2) * 14} l24,-14 M${cx - 12},${672 - (i % 2) * 14} l24,-14" stroke="${C.coral}" stroke-width="5"/>
		<path d="M${cx},${610 - (i % 2) * 14} v-14" stroke="${C.escuro}" stroke-width="4"/>
		<path d="M${cx},${520 - (i % 2) * 14} C${cx + 26},${555 - (i % 2) * 14} ${cx + 20},${590 - (i % 2) * 14} ${cx},${592 - (i % 2) * 14} C${cx - 20},${590 - (i % 2) * 14} ${cx - 24},${555 - (i % 2) * 14} ${cx},${520 - (i % 2) * 14} Z" fill="${C.coral}" stroke="${C.escuro}" stroke-width="4" stroke-linejoin="round"/>
		<path d="M${cx},${566 - (i % 2) * 14} q-8,10 0,20 q8,-10 0,-20" fill="${C.creme}"/>`,
		)
		.join('');
	return page(`
${chapter('04', 'QUEM COBRA')}
<g filter="url(#wobble)">
	<ellipse cx="540" cy="${BASE_Y - 4}" rx="370" ry="26" fill="${C.creme}" ${stroke}/>
	<!-- andar de baixo -->
	<rect x="250" y="850" width="580" height="${BASE_Y - 20 - 850}" fill="${C.ocre}" fill-opacity="0.6"/>
	<rect x="250" y="850" width="580" height="${BASE_Y - 20 - 850}" fill="url(#hatchOcre)" opacity="0.6"/>
	<rect x="250" y="850" width="580" height="${BASE_Y - 20 - 850}" fill="none" ${stroke}/>
	<path d="M250,975 h580" stroke="${C.escuro}" stroke-width="3" stroke-opacity="0.5" stroke-dasharray="14 10"/>
	<path d="${icing(250, 830, 850, [40, 70, 26, 58, 34, 80, 30, 52, 44])}" fill="${C.creme}" ${stroke}/>
	<!-- andar de cima -->
	<rect x="355" y="700" width="370" height="150" fill="${C.ocre}" fill-opacity="0.6"/>
	<rect x="355" y="700" width="370" height="150" fill="url(#hatchOcre)" opacity="0.6"/>
	<rect x="355" y="700" width="370" height="150" fill="none" ${stroke}/>
	<path d="${icing(355, 725, 712, [36, 62, 28, 54, 40, 66])}" fill="${C.creme}" ${stroke}/>
	${candles}
</g>
${sprinkles(270, 810, 840, 856, 12)}${sprinkles(375, 705, 702, 716, 7)}
${receitaLabel}
${caption([{t: 'vinha com '}, {t: 'cobertura!', hi: true}])}
`);
};

// ---------- mapas ----------
const BR_DATA = JSON.parse(fs.readFileSync(path.join(DATA, 'brazil-states.geojson')));
// remove ilhas oceânicas (Fernando de Noronha, Atol das Rocas, Trindade) — viram ruído na escala do quadro
for (const f of BR_DATA.features) {
	if (f.geometry.type === 'MultiPolygon') {
		f.geometry.coordinates = f.geometry.coordinates.filter((poly) =>
			poly[0].some(([lon]) => lon < -34.6),
		);
	}
}
const NE = ['MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA'];

frames.frame_06 = () => {
	// projeção plana, depois uma "câmera" inclinada (rotação em Z + inclinação em X com perspectiva)
	const flat = d3.geoMercator().fitExtent(
		[
			[90, 330],
			[990, 1230],
		],
		BR_DATA,
	);
	const cx = 540;
	const cy = 760;
	const yaw = (28 * Math.PI) / 180;
	const tilt = (44 * Math.PI) / 180;
	const dist = 1500;
	const cam = (x, y) => {
		let dx = x - cx;
		let dy = y - cy;
		const rx = dx * Math.cos(yaw) - dy * Math.sin(yaw);
		const ry = dx * Math.sin(yaw) + dy * Math.cos(yaw);
		const y3 = ry * Math.cos(tilt);
		const z = -ry * Math.sin(tilt);
		const f = dist / (dist + z);
		return [cx - 120 + rx * f * 1.08, cy + 10 + y3 * f * 1.08];
	};
	const proj = d3.geoTransform({
		point(lon, lat) {
			const [x, y] = flat([lon, lat]);
			const [X, Y] = cam(x, y);
			this.stream.point(X, Y);
		},
	});
	const pathGen = d3.geoPath(proj);
	const pt = (lon, lat) => cam(...flat([lon, lat]));
	const all = BR_DATA.features.map((f) => pathGen(f)).join(' ');
	const ne = BR_DATA.features
		.filter((f) => NE.includes(f.properties.sigla))
		.map((f) => pathGen(f))
		.join(' ');
	const stateLines = BR_DATA.features.map((f) => pathGen(f)).join(' ');

	// pictogramas
	const picto = {
		saude: (c) =>
			`<path d="M-9,-24 h18 v15 h15 v18 h-15 v15 h-18 v-15 h-15 v-18 h15 z" fill="${c}"/>`,
		escola: (c) =>
			`<path d="M-24,-4 L0,-22 L24,-4" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
			 <rect x="-18" y="-4" width="36" height="26" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round"/>
			 <rect x="-5" y="8" width="10" height="14" fill="${c}"/>
			 <path d="M0,-22 v-12 h12 v-0" stroke="${c}" stroke-width="4" fill="none"/><path d="M0,-34 h12 l-3,5 l3,5 h-12" fill="${c}"/>`,
		merenda: (c) =>
			`<path d="M-26,-2 h52 a26,24 0 0 1 -52,0 z" fill="${c}"/>
			 <path d="M-30,24 h60" stroke="${c}" stroke-width="5" stroke-linecap="round"/>
			 <path d="M-8,-12 q-6,-8 0,-16 M8,-12 q-6,-8 0,-16" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
	};
	// marcador desenhado: alfinete de traço (haste + sombra elíptica) com medalhão redondo
	const marker = (lon, lat, kind, label, active, lab, stemH) => {
		const [x, y] = pt(lon, lat);
		const r = active ? 58 : 42;
		const top = y - stemH;
		const col = active ? C.coral : C.creme;
		const ic = active ? C.creme : C.escuro;
		const s = active ? 1.25 : 0.9;
		const lx = x + lab.dx;
		const anchor = lab.anchor;
		return `
		<ellipse cx="${x}" cy="${y}" rx="${active ? 26 : 18}" ry="${active ? 9 : 6}" fill="${C.escuro}" fill-opacity="0.35"/>
		<path d="M${x},${y} V${top + r}" stroke="${C.escuro}" stroke-width="${active ? 5 : 4}" stroke-linecap="round"/>
		<circle cx="${x}" cy="${top}" r="${r}" fill="${col}" stroke="${C.escuro}" stroke-width="${active ? 5 : 4}"/>
		${active ? `<circle cx="${x}" cy="${top}" r="${r + 18}" fill="none" stroke="${C.coral}" stroke-width="4" stroke-dasharray="10 10"/>` : ''}
		<g transform="translate(${x} ${top + 2}) scale(${s})">${picto[kind](ic)}</g>
		<text x="${lx}" y="${top + lab.dy}" text-anchor="${anchor}" style="font-family:Caveat;font-weight:700;font-size:${active ? 70 : 56}px;paint-order:stroke" stroke="${C.creme}" stroke-width="12" stroke-linejoin="round" fill="${active ? C.coral : C.escuro}" ${active ? '' : 'fill-opacity="0.8"'}>${label}</text>`;
	};

	// espessura do "bloco" do mapa (desce alguns px)
	return page(`
${chapter('07', 'PRA ONDE VAI O DINHEIRO')}
<g transform="translate(0 22)"><path d="${all}" fill="${C.escuro}" stroke="${C.escuro}" stroke-width="3"/></g>
<g transform="translate(0 11)"><path d="${all}" fill="${C.escuro}" stroke="${C.escuro}" stroke-width="3"/></g>
<path d="${all}" fill="${C.creme}" stroke="${C.creme}" stroke-width="1"/>
<path d="${all}" fill="url(#hatchOcre)" opacity="0.55"/>
<path d="${ne}" fill="${C.roxo}" fill-opacity="0.35" stroke="${C.roxo}" stroke-opacity="0.35" stroke-width="1"/>
<path d="${ne}" fill="url(#hatchRoxo)"/>
<path d="${stateLines}" fill="none" stroke="${C.escuro}" stroke-opacity="0.35" stroke-width="1.5" stroke-linejoin="round"/>
<path d="${ne}" fill="none" stroke="${C.escuro}" stroke-width="2.5" stroke-linejoin="round" stroke-opacity="0.8"/>
<path d="${all}" fill="none" stroke="${C.escuro}" stroke-width="4" stroke-linejoin="round" filter="url(#wobble)"/>
${(() => {
	const [x, y] = pt(-39.6, -10.9);
	return `<text x="${x}" y="${y}" text-anchor="middle" style="${SANS};font-weight:900;font-size:30px;letter-spacing:4px;paint-order:stroke" stroke="${C.creme}" stroke-width="8" stroke-linejoin="round" fill="${C.roxo}" transform="rotate(-6 ${x} ${y})">NORDESTE</text>`;
})()}
${marker(-45.6, -4.6, 'escola', 'escola', false, {dx: -62, dy: 16, anchor: 'end'}, 120)}
${marker(-42.2, -13.2, 'merenda', 'merenda', false, {dx: -62, dy: 16, anchor: 'end'}, 120)}
${marker(-38.0, -7.6, 'saude', 'posto de saúde', true, {dx: 0, dy: -100, anchor: 'middle'}, 200)}
${caption([{t: 'posto de saúde', hi: true}, {t: ', escola, merenda.'}])}
${source('Constituição Federal, art. 159.')}
`);
};

frames.frame_07 = () => {
	const us = JSON.parse(fs.readFileSync(path.join(DATA, 'states-10m.json')));
	const states = topo.feature(us, us.objects.states);
	const lower48 = {
		type: 'FeatureCollection',
		features: states.features.filter(
			(f) => !['02', '15', '72', '60', '66', '69', '78'].includes(f.id),
		),
	};
	const geoms = {
		type: 'GeometryCollection',
		geometries: us.objects.states.geometries.filter(
			(g) => !['02', '15', '72', '60', '66', '69', '78'].includes(g.id),
		),
	};
	const nation = topo.merge(us, geoms.geometries);
	const proj = d3.geoAlbers().fitExtent(
		[
			[60, 560],
			[800, 1120],
		],
		lower48,
	);
	const pg = d3.geoPath(proj);
	const [[bx0, by0], [bx1, by1]] = pg.bounds(nation);
	// grade 6 x 4 de pessoas sobre o mapa
	const cols = 6;
	const rows = 4;
	const gx0 = bx0 + 110;
	const gx1 = bx1 - 150;
	const gy0 = by0 + 95;
	const gy1 = by1 - 120;
	const dx = (gx1 - gx0) / (cols - 1);
	const dy = (gy1 - gy0) / (rows - 1);
	const hi = {c: 5, r: 0};
	let people = '';
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const x = gx0 + c * dx;
			const y = gy0 + r * dy;
			const on = c === hi.c && r === hi.r;
			const col = on ? C.coral : C.escuro;
			people += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
				${on ? `<circle cx="0" cy="-4" r="48" fill="${C.creme}" stroke="${C.coral}" stroke-width="4"/>` : ''}
				<g transform="scale(1.25)"><circle cx="0" cy="-22" r="10" fill="${col}"/>
				<path d="M-17,22 V2 Q-17,-8 -7,-8 H7 Q17,-8 17,2 V22 Z" fill="${col}"/></g>
			</g>`;
		}
	}
	const tx = gx0 + hi.c * dx;
	const ty = gy0 + hi.r * dy;
	return page(`
${chapter('09', 'NOS ESTADOS UNIDOS')}
<g transform="translate(0 14)"><path d="${pg(nation)}" fill="${C.escuro}"/></g>
<path d="${pg(nation)}" fill="${C.creme}"/>
<path d="${pg(nation)}" fill="url(#hatchOcre)" opacity="0.55"/>
<path d="${pg(topo.mesh(us, us.objects.states, (a, b) => a !== b && !['02', '15'].includes(a.id)))}" fill="none" stroke="${C.escuro}" stroke-opacity="0.25" stroke-width="1.5"/>
<path d="${pg(nation)}" fill="none" stroke="${C.escuro}" stroke-width="4" stroke-linejoin="round" filter="url(#wobble)"/>
${people}
<text x="1005" y="440" text-anchor="end" style="${HAND};font-size:64px" transform="rotate(-4 1005 440)">≈ 1 milhão</text>
<text x="1005" y="504" text-anchor="end" style="${HAND};font-size:64px" transform="rotate(-4 1005 504)">de pessoas</text>
<path d="M905,530 C930,600 900,${ty - 70} ${tx + 52},${ty - 18}" fill="none" stroke="${C.coral}" stroke-width="6" stroke-linecap="round"/>
<path d="M${tx + 52},${ty - 18} l20,-24 M${tx + 52},${ty - 18} l30,4" fill="none" stroke="${C.coral}" stroke-width="6" stroke-linecap="round"/>
${caption([{t: 'E uns '}, {t: '27 milhões', hi: true}])}
${source('US Census Bureau, cobertura de saúde.')}
`);
};

(async () => {
	const out = __dirname;
	const browser = await chromium.launch({executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
	const pageObj = await browser.newPage({viewport: {width: W, height: H}, deviceScaleFactor: 1});
	const only = process.argv[3];
	for (const name of Object.keys(frames).sort()) {
		if (only && name !== only) continue;
		seed = 7;
		const html = frames[name]();
		await pageObj.setContent(html, {waitUntil: 'load'});
		await pageObj.evaluate(() => document.fonts.ready);
		await pageObj.screenshot({path: path.join(out, `${name}.png`), clip: {x: 0, y: 0, width: W, height: H}});
		console.log('ok', name);
	}
	await browser.close();
})();
