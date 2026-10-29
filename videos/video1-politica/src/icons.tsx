import React from 'react';
import {C} from './theme';

// Ícones desenhados num quadro de -75 a 75.

export const Thermometer: React.FC<{level: number; color: string}> = ({
	level,
	color,
}) => (
	<g>
		<rect x={-16} y={-68} width={32} height={100} rx={16} fill="#E8EEF5" />
		<circle cx={0} cy={44} r={28} fill="#E8EEF5" />
		<circle cx={0} cy={44} r={19} fill={color} />
		<rect
			x={-8}
			y={30 - 88 * level}
			width={16}
			height={88 * level + 14}
			rx={8}
			fill={color}
		/>
	</g>
);

export const Flame: React.FC = () => (
	<g>
		<path
			d="M 0 -66 C 30 -30 52 -6 52 22 C 52 52 28 68 0 68 C -28 68 -52 52 -52 22 C -52 -6 -26 -18 -14 -44 C -6 -24 4 -18 0 -66 Z"
			fill={C.hot}
		/>
		<path
			d="M 0 0 C 14 16 24 28 24 42 C 24 58 12 66 0 66 C -12 66 -24 58 -24 42 C -24 28 -10 20 0 0 Z"
			fill={C.yellow}
		/>
	</g>
);

export const Crown: React.FC = () => (
	<g>
		<circle cx={0} cy={22} r={30} fill={C.cold} />
		<rect x={-44} y={46} width={88} height={30} rx={14} fill={C.cold} />
		<path
			d="M -44 -12 L -44 -58 L -22 -32 L 0 -64 L 22 -32 L 44 -58 L 44 -12 Z"
			fill={C.yellow}
		/>
	</g>
);

export const Ballot: React.FC = () => (
	<g>
		<rect x={-30} y={-70} width={60} height={70} rx={6} fill="#FFFFFF" />
		<path
			d="M -14 -38 L -4 -26 L 16 -52"
			stroke={C.green}
			strokeWidth={9}
			fill="none"
			strokeLinecap="round"
		/>
		<rect x={-62} y={-14} width={124} height={84} rx={14} fill={C.cold} />
		<rect x={-40} y={-20} width={80} height={12} rx={6} fill={C.bg1} />
	</g>
);

export const Dome: React.FC = () => (
	<g>
		<path d="M -60 10 A 60 60 0 0 1 60 10 Z" fill="#E8EEF5" />
		<rect x={-70} y={10} width={140} height={14} fill="#E8EEF5" />
		{[-50, -25, 0, 25, 50].map((x) => (
			<rect key={x} x={x - 6} y={26} width={12} height={34} fill="#E8EEF5" />
		))}
		<rect x={-75} y={60} width={150} height={12} rx={4} fill="#E8EEF5" />
	</g>
);

export const Flags: React.FC = () => (
	<g>
		<rect x={-46} y={-60} width={8} height={130} fill="#E8EEF5" />
		<path d="M -38 -60 L 30 -60 L 16 -36 L 30 -12 L -38 -12 Z" fill={C.hot} />
		<rect x={14} y={-20} width={8} height={90} fill="#E8EEF5" />
		<path d="M 22 -20 L 72 -20 L 60 0 L 72 20 L 22 20 Z" fill={C.cold} />
	</g>
);

export const Coin: React.FC = () => (
	<g>
		<circle cx={0} cy={0} r={62} fill={C.yellow} />
		<circle cx={0} cy={0} r={48} fill="none" stroke="#E0A800" strokeWidth={6} />
		<text
			x={0}
			y={22}
			textAnchor="middle"
			fontFamily="Poppins, sans-serif"
			fontWeight={900}
			fontSize={62}
			fill="#B07F00"
		>
			R$
		</text>
	</g>
);

export const School: React.FC = () => (
	<g>
		<path d="M -70 -10 L 0 -60 L 70 -10 Z" fill={C.hot} />
		<rect x={-60} y={-10} width={120} height={80} fill="#E8EEF5" />
		<rect x={-14} y={26} width={28} height={44} fill={C.cold} />
		<rect x={-48} y={6} width={24} height={22} fill={C.cold} />
		<rect x={24} y={6} width={24} height={22} fill={C.cold} />
		<rect x={-4} y={-90} width={6} height={36} fill="#E8EEF5" />
		<path d="M 2 -90 L 30 -82 L 2 -74 Z" fill={C.green} />
	</g>
);

export const Health: React.FC = () => (
	<g>
		<circle cx={0} cy={0} r={66} fill="#FFFFFF" />
		<rect x={-16} y={-46} width={32} height={92} rx={6} fill="#E53935" />
		<rect x={-46} y={-16} width={92} height={32} rx={6} fill="#E53935" />
	</g>
);

export const Magnifier: React.FC = () => (
	<g>
		<circle cx={-12} cy={-12} r={44} fill="rgba(79,195,247,0.18)" stroke="#E8EEF5" strokeWidth={12} />
		<rect
			x={24}
			y={14}
			width={20}
			height={62}
			rx={10}
			fill="#E8EEF5"
			transform="rotate(-45 34 45)"
		/>
	</g>
);
