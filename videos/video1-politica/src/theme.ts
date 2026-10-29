import {staticFile} from 'remotion';

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const C = {
	bg1: '#0E1A2B',
	bg2: '#1B2E4A',
	ink: '#FFFFFF',
	muted: '#9FB3C8',
	hot: '#FF7A45',
	cold: '#4FC3F7',
	yellow: '#FFD166',
	green: '#7BD389',
	wall: '#22385A',
	floor: '#1A2C47',
	line: '#35527D',
};

export const PEOPLE_COLORS = ['#4FC3F7', '#4DB6E8', '#FF8A65', '#B39DDB', '#81C784'];

export const FONT = 'Poppins, sans-serif';

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
