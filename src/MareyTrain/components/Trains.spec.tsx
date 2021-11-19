import { render, screen } from '@testing-library/react';
import { extent } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
import { Station, Train } from '../types';
import { parseTime } from '../utils';
import Trains from './Trains';

const stations = [
	{
		distance: 0,
		key: 'stop|San Francisco|0|1',
		name: 'San Francisco',
		zone: 1,
	},
	{ distance: 40, key: 'stop|22nd Street|40|1', name: '22nd Street', zone: 1 },
];

const trains: Train[] = [
	{
		direction: 'S',
		id: 0,
		number: '102',
		stops: [
			{
				station: {
					distance: 0,
					key: 'stop|San Francisco|0|1',
					name: 'San Francisco',
					zone: 1,
				},
				time: parseTime('4:55AM'),
				trainId: 0,
			},
			{
				station: {
					distance: 124,
					key: 'stop|22nd Street|40|1',
					name: '22nd Street',
					zone: 1,
				},
				time: parseTime('5:00AM'),
				trainId: 0,
			},
		],
		type: 'N',
	},
];

const xScale = scaleTime()
	.domain([parseTime('4:30AM'), parseTime('9:30AM')])
	.range([0, 800]);

const yScale = scaleLinear()
	.domain(extent(stations, (d: Station) => d.distance) as [number, number])
	.range([0, 400]);

describe('Trains', () => {
	beforeAll(() => {
		render(
			<svg>
				<Trains trains={trains} xScale={xScale} yScale={yScale} />
			</svg>
		);
	});

	test('should display train name', () => {
		expect(screen.getByText(/San Francisco/)).toBeInTheDocument();
		expect(screen.getByText(/22nd Street/)).toBeInTheDocument();
	});
});
