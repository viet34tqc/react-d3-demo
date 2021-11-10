import { timeFormat, timeParse } from 'd3';
import { Train } from './types';

export const timeFormatStr = '%I:%M%p';

const getParseTime = () => timeParse(timeFormatStr);

export const parseTime = (timeStr: string): Date => {
	const timeDate = getParseTime()(timeStr);

	if (timeDate !== null && timeDate.getHours() < 3) {
		timeDate.setDate(timeDate.getDate() + 1);
	}

	return timeDate!;
};

export const convertDateToString = (date: Date): string => {
	return timeFormat(timeFormatStr)(date);
};

export const getTrainTitle = (trainData: Train): string => {
	const {
		stops: { 0: firstStop, [trainData.stops.length - 1]: lastStop },
	} = trainData;

	if (trainData.direction === 'S') {
		return `${firstStop.station.name} -> ${lastStop.station.name}`;
	}

	return `${lastStop.station.name} -> ${firstStop.station.name}`;
};
