import './base';
import {Player, PlayerRef} from '@remotion/player';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {SFX_FILES} from '../src/sfx';
import {FPS, HEIGHT, WIDTH} from '../src/theme';
import {DURATION_IN_FRAMES, Video} from '../src/Video';

const ref = React.createRef<PlayerRef>();

// Usado pelos botões de trecho da página.
(window as unknown as {seekToSeconds: (s: number) => void}).seekToSeconds = (s) => {
	ref.current?.seekTo(Math.round(s * FPS));
	ref.current?.play();
};

// A narração é baixada uma vez e tocada da memória, para o avanço/retrocesso funcionar em qualquer servidor.
const toBlobUrl = (path: string) =>
	fetch(path)
		.then((r) => r.blob())
		.then((b) => URL.createObjectURL(b));
const [narration, ...effects] = await Promise.all(['narracao.mp3', ...SFX_FILES].map(toBlobUrl));
(window as unknown as {__ASSET_OVERRIDES__: Record<string, string>}).__ASSET_OVERRIDES__ = {
	'narracao.wav': narration,
	...Object.fromEntries(SFX_FILES.map((f, i) => [f, effects[i]])),
};

createRoot(document.getElementById('root')!).render(
	<Player
		ref={ref}
		component={Video}
		durationInFrames={DURATION_IN_FRAMES}
		fps={FPS}
		compositionWidth={WIDTH}
		compositionHeight={HEIGHT}
		controls
		clickToPlay
		doubleClickToFullscreen
		allowFullscreen
		showVolumeControls
		style={{width: '100%', height: '100%'}}
	/>,
);
