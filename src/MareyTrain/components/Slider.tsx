import { Box, Slider } from '@mui/material';
import { convertMinutesToTimes } from '../utils';

interface SliderProps {
	minutes: number[];
	onChange: (event: any, newValue: any) => void;
}

const TimeRangeSlider = ({ minutes, onChange }: SliderProps) => {
	const valueLabelFormat = (value: number) => {
		return <div>{convertMinutesToTimes(value)}</div>;
	};
	return (
		<Box mt="30px">
			<Slider
				value={minutes}
				max={1440}
				onChange={onChange}
				valueLabelDisplay="auto"
				valueLabelFormat={valueLabelFormat}
			/>
		</Box>
	);
};

export default TimeRangeSlider;
