import { render, screen } from '@testing-library/react';
import TimeRangeSlider from './TimeRangeSlider';

const handleChangeMinutes = jest.fn();
describe('Slider', () => {
	test('should display slider', () => {
		render(
			<TimeRangeSlider minutes={[270, 720]} onChange={handleChangeMinutes} />
		);

        expect(screen.getByText('4:30AM')).toBeInTheDocument();
        expect(screen.getByText('12:00PM')).toBeInTheDocument();
	});
});
