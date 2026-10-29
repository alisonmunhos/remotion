import {continueRender, delayRender} from 'remotion';
import {asset} from './theme';

// Archivo variável (largura 62–125%, peso 100–900), embutida no projeto.
const handle = delayRender('Carregando a fonte Archivo');
const face = new FontFace('Archivo', `url(${asset('fonts/archivo-latin.woff2')}) format('woff2')`, {
	weight: '100 900',
	stretch: '62% 125%',
});
document.fonts.add(face);
face
	.load()
	.then(() => continueRender(handle))
	.catch((err) => {
		console.error(err);
		continueRender(handle);
	});
