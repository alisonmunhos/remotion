import './base';
import {Player, PlayerRef} from '@remotion/player';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {FPS, HEIGHT, WIDTH} from '../src/theme';
import {DURATION_IN_FRAMES, Video} from '../src/Video';

const ref = React.createRef<PlayerRef>();

// Usado pelos botões de trecho da página.
(window as unknown as {seekToSeconds: (s: number) => void}).seekToSeconds = (s) => {
	ref.current?.seekTo(Math.round(s * FPS));
	ref.current?.play();
};

// A narração é baixada uma vez e tocada da memória, para o avanço/retrocesso funcionar em qualquer servidor.
const audio = await fetch('narracao.mp3').then((r) => r.blob());
(window as unknown as {__ASSET_OVERRIDES__: Record<string, string>}).__ASSET_OVERRIDES__ = {
	'narracao.wav': URL.createObjectURL(audio),
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
