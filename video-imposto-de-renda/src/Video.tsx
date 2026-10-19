import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Barra, Capitulo, Defs, Fonte, Legenda, Mesa} from './base';
import {C01Contracheque, C02Renda, C03Carteira, C04Receita, C16Novidade} from './cenas-a';
import {C05Declaracao, C06Devolve, C07NemTodo, C08Pizza, C09Mapa, C10Resto, C11Volta, C12EUA, C13Milhoes, C14Hospital, C15Aqui, C17Proximo} from './cenas-b';
import {carregarFontes} from './fontes';
import {CORPO_FRAMES, FPS} from './tokens';

carregarFontes();

const CENAS = [C01Contracheque, C02Renda, C03Carteira, C04Receita, C05Declaracao, C06Devolve, C07NemTodo, C08Pizza, C09Mapa, C10Resto, C11Volta, C12EUA, C13Milhoes, C14Hospital, C15Aqui, C16Novidade, C17Proximo];

// Corpo do vídeo (0 a 67,05 s). Todas as cenas usam o tempo absoluto t (s), amarrado à narração.
export const Corpo: React.FC = () => {
	const t = useCurrentFrame() / FPS;
	return (
		<AbsoluteFill style={{background: '#1d1c1f'}}>
			<Defs t={t} />
			<Mesa gradeOpacity={1} />
			<AbsoluteFill style={{perspective: 1800, perspectiveOrigin: '50% 40%'}}>
				{CENAS.map((Cena, i) => (
					<Cena key={i} t={t} />
				))}
			</AbsoluteFill>
			<Capitulo t={t} />
			<Legenda t={t} />
			<Fonte t={t} />
			<Barra t={t} />
		</AbsoluteFill>
	);
};

export const Video: React.FC = () => (
	<AbsoluteFill>
		<Sequence durationInFrames={CORPO_FRAMES}>
			<Audio src={staticFile('narracao_corpo.wav')} />
			<Corpo />
		</Sequence>
		<Sequence from={CORPO_FRAMES}>
			<OffthreadVideo src={staticFile('fecho.mp4')} />
		</Sequence>
	</AbsoluteFill>
);
