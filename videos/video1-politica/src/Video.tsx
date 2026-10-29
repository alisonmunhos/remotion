import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Captions} from './Captions';
import {Background, SceneOffset} from './components';
import './fonts';
import {
	Scene01,
	Scene02,
	Scene03,
	Scene04,
	Scene05,
	Scene06,
	Scene07,
	Scene08,
	Scene09,
	Scene10,
	Scene11,
} from './scenes';
import tempos from './tempos.json';
import {asset, FPS} from './theme';

const SCENES = [Scene01, Scene02, Scene03, Scene04, Scene05, Scene06, Scene07, Scene08, Scene09, Scene10, Scene11];

export const DURATION_IN_FRAMES = Math.ceil(tempos.duracao_total * FPS);

// Cada cena vai do início do seu trecho até o início do próximo,
// com uma pequena sobreposição para as cenas se fundirem durante as pausas.
const OVERLAP = 6;

export const Video: React.FC = () => {
	return (
		<AbsoluteFill>
			<Background />
			{tempos.trechos.map((trecho, i) => {
				const Scene = SCENES[i];
				const start = i === 0 ? 0 : Math.round(trecho.ini * FPS) - OVERLAP;
				const next = tempos.trechos[i + 1];
				const end = next ? Math.round(next.ini * FPS) + OVERLAP : DURATION_IN_FRAMES;
				return (
					<Sequence key={trecho.trecho} from={start} durationInFrames={end - start} name={`Trecho ${trecho.trecho}`}>
						<FadeInOut duration={end - start} first={i === 0} last={!next}>
							<SceneOffset.Provider value={start}>
								<Scene />
							</SceneOffset.Provider>
						</FadeInOut>
					</Sequence>
				);
			})}
			<Captions />
			<Audio src={asset('narracao.wav')} />
		</AbsoluteFill>
	);
};

const FadeInOut: React.FC<{duration: number; first: boolean; last: boolean; children: React.ReactNode}> = ({
	duration,
	first,
	last,
	children,
}) => {
	const frame = useCurrentFrame();
	const fadeIn = first ? 1 : interpolate(frame, [0, OVERLAP * 2], [0, 1], {extrapolateRight: 'clamp'});
	const fadeOut = last
		? 1
		: interpolate(frame, [duration - OVERLAP * 2, duration], [1, 0], {extrapolateLeft: 'clamp'});
	return <AbsoluteFill style={{opacity: Math.min(fadeIn, fadeOut)}}>{children}</AbsoluteFill>;
};
