import React from 'react';
import {Composition} from 'remotion';
import {Corpo, Video} from './Video';
import {CORPO_FRAMES, FECHO_FRAMES, FPS, H, W} from './tokens';

export const Root: React.FC = () => (
	<>
		<Composition id="Video" component={Video} durationInFrames={CORPO_FRAMES + FECHO_FRAMES} fps={FPS} width={W} height={H} />
		<Composition id="Corpo" component={Corpo} durationInFrames={CORPO_FRAMES} fps={FPS} width={W} height={H} />
	</>
);
