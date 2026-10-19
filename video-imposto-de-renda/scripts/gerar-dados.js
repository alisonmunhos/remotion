// Pré-calcula dados usados pelo vídeo: mapas (caminhos SVG planos) e tempos das palavras da legenda.
// Uso: node scripts/gerar-dados.js <pasta-com-node_modules-de-d3-geo-e-topojson-client>
const fs = require('fs');
const path = require('path');
const M = process.argv[2];
const d3 = require(path.join(M, 'node_modules/d3-geo'));
const topo = require(path.join(M, 'node_modules/topojson-client'));
const here = (...p) => path.join(__dirname, ...p);
const out = (name, data) => fs.writeFileSync(here('../src/data', name), JSON.stringify(data));

// ---------- Brasil ----------
const br = JSON.parse(fs.readFileSync(here('brazil-states.geojson')));
for (const f of br.features) {
	if (f.geometry.type === 'MultiPolygon') {
		f.geometry.coordinates = f.geometry.coordinates.filter((poly) => poly[0].some(([lon]) => lon < -34.6));
	}
}
const NE = ['MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA'];
const brProj = d3.geoMercator().fitExtent([[0, 0], [900, 900]], br);
// projeção com simplificação: descarta pontos a menos de 2,5 px do anterior
const simplificada = (proj, minD) =>
	d3.geoTransform({
		point(lon, lat) {
			const [x, y] = proj([lon, lat]);
			if (this._last && Math.hypot(x - this._last[0], y - this._last[1]) < minD) return;
			this._last = [x, y];
			this.stream.point(x, y);
		},
		lineStart() {
			this._last = null;
			this.stream.lineStart();
		},
	});
const brPath = d3.geoPath(simplificada(brProj, 2.5)).digits(1);
const pt = (lon, lat) => brProj([lon, lat]).map((v) => Math.round(v * 10) / 10);
out('brasil.json', {
	w: 900,
	h: 900,
	all: br.features.map((f) => brPath(f)).join(''),
	ne: br.features.filter((f) => NE.includes(f.properties.sigla)).map((f) => brPath(f)).join(''),
	pontos: {posto: pt(-38.0, -7.6), escola: pt(-44.6, -4.8), merenda: pt(-41.8, -12.8), nordeste: pt(-40.2, -10.2), brasilia: pt(-47.9, -15.8)},
});

// ---------- EUA (48 estados contíguos) ----------
const us = JSON.parse(fs.readFileSync(here('states-10m.json')));
const fora = ['02', '15', '72', '60', '66', '69', '78'];
const geoms = us.objects.states.geometries.filter((g) => !fora.includes(g.id));
const nation = topo.merge(us, geoms);
const usProj = d3.geoAlbers().fitExtent([[0, 0], [900, 560]], nation);
const usPath = d3.geoPath(usProj).digits(1);
const [[x0, y0], [x1, y1]] = usPath.bounds(nation);
out('eua.json', {
	w: 900,
	h: Math.round(y1),
	nation: usPath(nation),
	mesh: usPath(topo.mesh(us, us.objects.states, (a, b) => a !== b && !fora.includes(a.id) && !fora.includes(b.id))),
});

// ---------- legenda: palavras do roteiro com os tempos da transcrição ----------
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const stt = JSON.parse(fs.readFileSync(here('transcricao.json'))).words.filter((w) => w.type === 'word');
let roteiro = fs.readFileSync(here('roteiro.txt'), 'utf8').trim();
roteiro = roteiro.slice(0, roteiro.indexOf('Você pode acreditar')).trim(); // o fecho tem legenda própria
const rw = roteiro.split(/\s+/);
// alinhamento por programação dinâmica (custo de edição) entre palavras do roteiro e da transcrição
const A = rw.map(norm);
const B = stt.map((w) => norm(w.text));
const n = A.length;
const m = B.length;
const D = Array.from({length: n + 1}, () => new Array(m + 1).fill(0));
for (let i = 0; i <= n; i++) D[i][0] = i;
for (let j = 0; j <= m; j++) D[0][j] = j;
for (let i = 1; i <= n; i++)
	for (let j = 1; j <= m; j++)
		D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + (A[i - 1] === B[j - 1] ? 0 : 1));
const map = new Array(n).fill(null);
let i = n;
let j = m;
while (i > 0 && j > 0) {
	if (D[i][j] === D[i - 1][j - 1] + (A[i - 1] === B[j - 1] ? 0 : 1)) {
		map[i - 1] = j - 1;
		i--;
		j--;
	} else if (D[i][j] === D[i - 1][j] + 1) i--;
	else j--;
}
const words = rw.map((w, k) => {
	const s = map[k] !== null ? stt[map[k]] : null;
	return {w, start: s ? s.start : null, end: s ? s.end : null};
});
// preenche palavras sem par (ex.: "27" × "vinte e sete") interpolando entre vizinhas
for (let k = 0; k < words.length; k++) {
	if (words[k].start === null) {
		const prev = words.slice(0, k).reverse().find((x) => x.start !== null);
		const next = words.slice(k + 1).find((x) => x.start !== null);
		words[k].start = prev ? prev.end + 0.02 : 0;
		words[k].end = next ? next.start - 0.02 : words[k].start + 0.3;
	}
}
out('palavras.json', words.map((x) => ({w: x.w, s: Math.round(x.start * 100) / 100, e: Math.round(x.end * 100) / 100})));
console.log(words.filter((x, k) => map[k] === null || A[k] !== B[map[k]]).map((x) => x.w + '@' + x.start.toFixed(2)).join(' '));
