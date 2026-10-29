import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
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
import {SFX} from './sfx';
import tempos from './tempos.json';
import {asset, FPS} from './theme';

type Entrance = 'none' | 'fade' | 'zoom' | 'slide' | 'wipe';

// Uma cena por trecho, com a forma de entrada de cada uma.
// 03 e 04 continuam na mesma sala, então só esmaecem.
const SCENES: {Scene: React.FC; entrance: Entrance}[] = [
	{Scene: Scene01, entrance: 'none'},
	{Scene: Scene02, entrance: 'zoom'},
	{Scene: Scene03, entrance: 'fade'},
	{Scene: Scene04, entrance: 'fade'},
	{Scene: Scene05, entrance: 'wipe'},
	{Scene: Scene06, entrance: 'slide'},
	{Scene: Scene07, entrance: 'slide'},
	{Scene: Scene08, entrance: 'zoom'},
	{Scene: Scene09, entrance: 'slide'},
	{Scene: Scene10, entrance: 'zoom'},
	{Scene: Scene11, entrance: 'wipe'},
];

export const DURATION_IN_FRAMES = Math.ceil(tempos.duracao_total * FPS);

// Cada cena vai do início do seu trecho até o início do próximo,
// com uma pequena sobreposição para a transição acontecer durante a pausa.
const OVERLAP = 6;

export const Video: React.FC = () => {
	return (
		<AbsoluteFill>
			<Background />
			{tempos.trechos.map((trecho, i) => {
				const {Scene, entrance} = SCENES[i];
				const start = i === 0 ? 0 : Math.round(trecho.ini * FPS) - OVERLAP;
				const next = tempos.trechos[i + 1];
				const end = next ? Math.round(next.ini * FPS) + OVERLAP : DURATION_IN_FRAMES;
				return (
					<Sequence key={trecho.trecho} from={start} durationInFrames={end - start} name={`Trecho ${trecho.trecho}`}>
						<SceneFrame duration={end - start} entrance={entrance} last={!next}>
							<SceneOffset.Provider value={start}>
								<Scene />
							</SceneOffset.Provider>
						</SceneFrame>
					</Sequence>
				);
			})}
			<Captions />
			<Audio src={asset('narracao.wav')} />
			{SFX.map((s, i) => (
				<Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={2 * FPS} name={`Som: ${s.file}`} layout="none">
					<Audio src={asset(`sfx/${s.file}.wav`)} volume={s.volume} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};

// Entrada da cena, saída em esmaecimento e uma aproximação lenta de câmera.
const SceneFrame: React.FC<{duration: number; entrance: Entrance; last: boolean; children: React.ReactNode}> = ({
	duration,
	entrance,
	last,
	children,
}) => {
	const frame = useCurrentFrame();
	const p =
		entrance === 'none'
			? 1
			: interpolate(frame, [0, OVERLAP * 2], [0, 1], {
					extrapolateRight: 'clamp',
					easing: Easing.out(Easing.cubic),
				});
	const fadeOut = last
		? 1
		: interpolate(frame, [duration - OVERLAP * 2, duration], [1, 0], {extrapolateLeft: 'clamp'});
	const push = interpolate(frame, [0, duration], [1, 1.035]);
	return (
		<AbsoluteFill
			style={{
				opacity: (entrance === 'wipe' ? 1 : p) * fadeOut,
				scale: String(push * (entrance === 'zoom' ? 1.18 - 0.18 * p : 1)),
				translate: entrance === 'slide' ? `0 ${(1 - p) * 320}px` : undefined,
				clipPath: entrance === 'wipe' && p < 1 ? `circle(${p * 120}% at 50% 45%)` : undefined,
			}}
		>
			{children}
		</AbsoluteFill>
	);
};
