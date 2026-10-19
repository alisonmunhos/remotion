// Paleta e tipografia do canal Vire à Esquerda. Use só estas cores (transparências delas são permitidas).
export const C = {
	escuro: '#141414',
	creme: '#EEE9E1',
	coral: '#FF5F45',
	ocre: '#C9A26B',
	vermelho: '#9B2C2C',
	roxo: '#7A5CC4',
} as const;

// Papéis das cores:
// creme    = papel e texto sobre a mesa
// escuro   = traço, texto sobre o papel, pílula da legenda
// coral    = foco / mão do narrador / palavra-chave / elemento ativo
// ocre     = apoio neutro (sombras, hachura de terreno, massa do bolo)
// vermelho = o que é tirado de você (descontos, carimbos negativos)
// roxo     = o Estado e o dinheiro público

export const F = {
	sans: 'Inter',
	mono: 'JetBrains Mono',
	mao: 'Caveat',
} as const;

export const FPS = 30;
export const W = 1080;
export const H = 1920;

// fim do corpo: o fecho começa exatamente aqui (corte na pausa entre "bolso." e "Você")
export const CORPO_S = 67.05;
export const CORPO_FRAMES = Math.round(CORPO_S * FPS); // 2012 (último quadro cobre até 67,07 s)
export const FECHO_FRAMES = 226; // fecho.mp4 = 7,54 s

export const LW = 6; // espessura do traço principal

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lin = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const eo = (x: number) => 1 - Math.pow(1 - x, 3);
export const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const eback = (x: number) => {
	const c = 1.6;
	return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};
