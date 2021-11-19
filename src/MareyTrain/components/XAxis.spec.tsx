import XAxis from './XAxis';
import { render, screen } from '@testing-library/react';
import { scaleTime } from 'd3-scale';
import { parseTime } from '../utils';

const scale = scaleTime()
	.domain([parseTime('4:30AM'), parseTime('9:30AM')])
	.range([0, 800]);

describe('XAxis', () => {
	beforeAll(() => {
		render(
			<svg>
				<XAxis type="bottom" scale={scale} />
			</svg>
		);
	});

	test('should display time', () => {
		expect(screen.getByText('05:00AM')).toBeInTheDocument();
	});
});
