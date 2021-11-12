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

export const convertMinutesToTimes = (limit: number): string => {
	let fragment = 'AM';
	let hours = limit / 60;
	const rhours = Math.floor(hours);
	const minutes = (hours - rhours) * 60;
	const rminutes = Math.round(minutes);

	if (rhours > 11) {
		fragment = 'PM';
	}

	const minutesStr = rminutes < 10 ? `0${rminutes}` : rminutes.toString();

	return `${rhours}:${minutesStr}${fragment}`;
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
