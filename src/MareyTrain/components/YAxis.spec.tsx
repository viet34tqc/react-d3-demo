import { render, screen } from '@testing-library/react';
import { extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { Station } from '../types';
import YAxis from './YAxis';

const stations = [
	{
		distance: 0,
		key: 'stop|San Francisco|0|1',
		name: 'San Francisco',
		zone: 1,
	},
	{ distance: 40, key: 'stop|22nd Street|40|1', name: '22nd Street', zone: 1 },
];

const scale = scaleLinear()
	.domain(extent(stations, (d: Station) => d.distance) as [number, number])
	.range([0, 400]);

describe('YAxis', () => {
	beforeAll(() => {
		render(
			<svg>
				<YAxis scale={scale} stations={stations} />
			</svg>
		);
	});

	test('should display time', () => {
		expect(screen.getByText('San Francisco')).toBeInTheDocument();
	});
});
