import {staticFile} from 'remotion';

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Paleta editorial: papel frio, tinta quase preta e dois sinais de temperatura.
// O amarelo é reservado para o conceito central (DECIDIR).
export const C = {
	paper: '#ECEEF0',
	wall: '#E2E5E9',
	grid: '#D6DBE1',
	ink: '#0F1720',
	muted: '#7A8594',
	white: '#FFFFFF',
	cold: '#1F5BFF',
	hot: '#FF4A1C',
	yellow: '#FFC21A',
	green: '#16A36A',
};

export const FONT = "'Archivo', 'Helvetica Neue', Arial, sans-serif";

// No Studio/render os arquivos vêm de public/ via staticFile().
// No player publicado eles ficam ao lado da página, então usamos caminho relativo.
export const asset = (path: string) => {
	const w =
		typeof window !== 'undefined'
			? (window as unknown as {
					__ASSET_BASE__?: string;
					__ASSET_OVERRIDES__?: Record<string, string>;
				})
			: {};
	const override = w.__ASSET_OVERRIDES__?.[path];
	if (override !== undefined) {
		return override;
	}
	return w.__ASSET_BASE__ === undefined ? staticFile(path) : w.__ASSET_BASE__ + path;
};
