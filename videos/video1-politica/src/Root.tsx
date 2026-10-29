import React from 'react';
import {Composition} from 'remotion';
import {HEIGHT, FPS, WIDTH} from './theme';
import {DURATION_IN_FRAMES, Video} from './Video';

export const Root: React.FC = () => (
	<Composition
		id="Video1"
		component={Video}
		durationInFrames={DURATION_IN_FRAMES}
		fps={FPS}
		width={WIDTH}
		height={HEIGHT}
	/>
);
