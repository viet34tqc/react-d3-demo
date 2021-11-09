import { timeParse } from 'd3';

export const timeFormatStr = '%I:%M%p';

const getParseTime = () => timeParse(timeFormatStr);

export const parseTime = (timeStr: string): Date => {
	const timeDate = getParseTime()(timeStr);

	if (timeDate !== null && timeDate.getHours() < 3) {
		timeDate.setDate(timeDate.getDate() + 1);
	}

	return timeDate!;
};
