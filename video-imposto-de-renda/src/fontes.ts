import {continueRender, delayRender, staticFile} from 'remotion';

// Fontes embutidas em public/fonts (todas SIL OFL), para o render não depender do sistema.
const faces: [string, string, number][] = [
	['Inter', 'fonts/Inter-Medium.otf', 500],
	['Inter', 'fonts/Inter-SemiBold.otf', 600],
	['Inter', 'fonts/Inter-Bold.otf', 700],
	['Inter', 'fonts/Inter-ExtraBold.otf', 800],
	['Inter', 'fonts/Inter-Black.otf', 900],
	['JetBrains Mono', 'fonts/JetBrainsMono-Regular.ttf', 400],
	['JetBrains Mono', 'fonts/JetBrainsMono-Bold.ttf', 700],
	['JetBrains Mono', 'fonts/JetBrainsMono-ExtraBold.ttf', 800],
	['Caveat', 'fonts/Caveat-Bold.woff2', 700],
];

let loaded = false;
export const carregarFontes = () => {
	if (loaded || typeof document === 'undefined') return;
	loaded = true;
	const handle = delayRender('fontes');
	Promise.all(
		faces.map(([family, file, weight]) => {
			const f = new FontFace(family, `url(${staticFile(file)})`, {weight: String(weight)});
			document.fonts.add(f);
			return f.load();
		}),
	)
		.then(() => continueRender(handle))
		.catch((e) => {
			console.error(e);
			continueRender(handle);
		});
};
