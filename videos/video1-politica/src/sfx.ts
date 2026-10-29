// Efeitos sonoros: arquivo em public/sfx, momento (s) e volume.
// A narração está em −14 LUFS; os efeitos ficam bem abaixo dela.
export const SFX: {file: string; at: number; volume: number}[] = [
	// 01 gancho: controle remoto
	{file: 'mouse-click', at: 0.12, volume: 0.35},
	{file: 'beep', at: 0.15, volume: 0.18},
	{file: 'beep', at: 0.45, volume: 0.18},
	{file: 'beep', at: 0.75, volume: 0.18},
	{file: 'whoosh', at: 0.98, volume: 0.35},
	{file: 'whip', at: 1.34, volume: 0.3},
	// 02 a sala
	{file: 'whoosh', at: 3.1, volume: 0.3},
	{file: 'pop', at: 4.24, volume: 0.22},
	{file: 'pop', at: 4.44, volume: 0.22},
	{file: 'pop', at: 4.64, volume: 0.22},
	{file: 'switch', at: 5.39, volume: 0.3},
	{file: 'pop', at: 6.91, volume: 0.22},
	{file: 'pop', at: 8.29, volume: 0.22},
	{file: 'pop', at: 9.5, volume: 0.22},
	{file: 'record-scratch', at: 10.5, volume: 0.22},
	// 03 lupa
	{file: 'whoosh', at: 13.58, volume: 0.3},
	// 04 uma decisão afeta todos
	{file: 'pop', at: 16.45, volume: 0.2},
	{file: 'pop', at: 16.75, volume: 0.2},
	{file: 'beep', at: 18.4, volume: 0.2},
	// 05 elásticos
	{file: 'whoosh', at: 19.7, volume: 0.3},
	{file: 'boing', at: 22.0, volume: 0.25},
	{file: 'boing', at: 23.3, volume: 0.25},
	{file: 'boing', at: 25.7, volume: 0.25},
	// 06 três formas
	{file: 'whoosh', at: 26.7, volume: 0.3},
	{file: 'page-turn', at: 29.09, volume: 0.3},
	{file: 'page-turn', at: 31.87, volume: 0.3},
	{file: 'page-turn', at: 33.73, volume: 0.3},
	// 07 resultados
	{file: 'whoosh', at: 35.1, volume: 0.3},
	{file: 'pop', at: 38.7, volume: 0.22},
	// 08 onde a política começa
	{file: 'whoosh', at: 39.6, volume: 0.3},
	{file: 'pop', at: 41.98, volume: 0.22},
	{file: 'pop', at: 42.48, volume: 0.22},
	{file: 'pop', at: 43.26, volume: 0.22},
	{file: 'whip', at: 44.0, volume: 0.3},
	{file: 'whoosh', at: 45.5, volume: 0.25},
	{file: 'ding', at: 50.53, volume: 0.25},
	// 09 vida real
	{file: 'whoosh', at: 51.5, volume: 0.3},
	{file: 'page-turn', at: 53.33, volume: 0.3},
	{file: 'page-turn', at: 54.59, volume: 0.3},
	{file: 'page-turn', at: 55.9, volume: 0.3},
	// 10 isso é política
	{file: 'vine-boom', at: 57.75, volume: 0.22},
	{file: 'pop', at: 61.12, volume: 0.22},
	{file: 'pop', at: 63.74, volume: 0.22},
	{file: 'pop', at: 64.24, volume: 0.22},
	// 11 de volta à sala
	{file: 'whoosh', at: 65.35, volume: 0.3},
	{file: 'whoosh', at: 69.4, volume: 0.25},
	{file: 'ding', at: 72.11, volume: 0.25},
];

export const SFX_FILES = [...new Set(SFX.map((s) => `sfx/${s.file}.wav`))];
