import { render, screen } from '@testing-library/react';
import MareyTrainChart from './MareyTrainChart';

describe('MareyTrainChart', () => {
	test('should render svg', () => {
		render(<MareyTrainChart stations={[]} trains={[]} times={[]} />);
		expect(screen.getByTestId('svgRef')).toBeInTheDocument();
	});
});
