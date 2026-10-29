import {createTikTokStyleCaptions} from '@remotion/captions';
import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {pop, useTime} from './components';
import tempos from './tempos.json';
import {C, FONT} from './theme';

// Legenda estilo TikTok: 2 a 4 palavras por vez, com a palavra falada em destaque.
export const Captions: React.FC = () => {
	const t = useTime();
	const ms = t * 1000;
	const {pages} = useMemo(
		() =>
			createTikTokStyleCaptions({
				captions: tempos.palavras.map((p, i) => ({
					text: (i === 0 ? '' : ' ') + p.w,
					startMs: p.ini * 1000,
					endMs: p.fim * 1000,
					timestampMs: null,
					confidence: null,
					// quebra a legenda no fim de frase ou vírgula
					pageBreakAfter: /[.,?!]$/.test(p.w),
				})),
				combineTokensWithinMilliseconds: 900,
			}),
		[],
	);
	const page = pages.find((p, i) => {
		const next = pages[i + 1];
		const end = Math.min(p.startMs + p.durationMs, next ? next.startMs : Infinity);
		return ms >= p.startMs && ms < end;
	});
	// no cartão final a pergunta já aparece grande na tela
	if (!page || t >= 72.0) {
		return null;
	}
	const enter = pop(t, page.startMs / 1000, 16);
	return (
		<AbsoluteFill style={{top: 1400, height: 280, alignItems: 'center', justifyContent: 'center'}}>
			<div
				style={{
					maxWidth: 960,
					textAlign: 'center',
					fontFamily: FONT,
					fontWeight: 800,
					fontSize: 80,
					lineHeight: 1.2,
					whiteSpace: 'pre-wrap',
					transform: `scale(${interpolate(enter, [0, 1], [0.85, 1])})`,
					opacity: enter,
				}}
			>
				{page.tokens.map((tok) => {
					const active = ms >= tok.fromMs && ms < tok.toMs;
					return (
						<span
							key={tok.fromMs}
							style={{
								color: active ? C.yellow : C.ink,
								WebkitTextStroke: '14px rgba(8,14,24,0.9)',
								paintOrder: 'stroke fill',
							}}
						>
							{tok.text}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
