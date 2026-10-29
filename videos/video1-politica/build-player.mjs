import {build} from 'esbuild';
import {execSync} from 'node:child_process';
import fs from 'node:fs';

// Gera dist/ com o player: player.js + narração + fontes.
fs.rmSync('dist', {recursive: true, force: true});
await build({
	entryPoints: ['player/index.tsx'],
	bundle: true,
	minify: true,
	format: 'esm',
	jsx: 'automatic',
	target: 'es2022',
	define: {'process.env.NODE_ENV': '"production"'},
	outfile: 'dist/player.js',
});
fs.cpSync('public/fonts', 'dist/fonts', {recursive: true});
// Prévia usa MP3 (menor); o render final continua usando o WAV original.
execSync('ffmpeg -loglevel error -y -i public/narracao.wav -b:a 160k dist/narracao.mp3');
fs.copyFileSync('player/index.html', 'dist/index.html');
console.log('dist/ pronto');
