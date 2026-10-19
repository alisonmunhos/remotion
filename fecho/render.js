// Renderiza fecho.html quadro a quadro (30 fps) em frames/NNNN.png
// Uso: node render.js <pasta-com-node_modules> [nQuadros] [apenas=idx,idx]
const path = require('path');
const fs = require('fs');
const {chromium} = require(path.join(process.argv[2], 'node_modules/playwright-core'));
const N = Number(process.argv[3] || 136);
const only = process.argv[4] ? process.argv[4].split(',').map(Number) : null;
(async () => {
	const out = path.join(__dirname, 'frames');
	fs.mkdirSync(out, {recursive: true});
	const browser = await chromium.launch({executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
	const page = await browser.newPage({viewport: {width: 1080, height: 1920}});
	await page.goto('file://' + path.join(__dirname, 'fecho.html'));
	await page.evaluate(() => document.fonts.ready);
	for (let i = 0; i < N; i++) {
		if (only && !only.includes(i)) {
			await page.evaluate((t) => window.render(t), i / 30);
			continue;
		}
		await page.evaluate((t) => window.render(t), i / 30);
		await page.screenshot({path: path.join(out, String(i).padStart(4, '0') + '.png')});
	}
	await browser.close();
})();
