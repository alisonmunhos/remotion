import {continueRender, delayRender} from 'remotion';
import {asset} from './theme';

// Fonte Poppins embutida no projeto (public/fonts), para não depender da internet ao renderizar.
const handle = delayRender('Carregando a fonte Poppins');
Promise.all(
	[600, 800, 900].map((weight) => {
		const face = new FontFace('Poppins', `url(${asset(`fonts/poppins-${weight}.woff2`)}) format('woff2')`, {
			weight: String(weight),
		});
		document.fonts.add(face);
		return face.load();
	}),
)
	.then(() => continueRender(handle))
	.catch((err) => {
		console.error(err);
		continueRender(handle);
	});
