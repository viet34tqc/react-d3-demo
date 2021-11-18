import { BaseType, select, Selection, timeFormat, timeParse } from 'd3';
import { Stop, Train } from './types';

export const timeFormatStr = '%I:%M%p';

const margin = { top: 20, right: 30, bottom: 20, left: 100 },
	width = 1400,
	innerWidth = width - margin.left - margin.right,
	height = 500,
	innerHeight = 500 - margin.top - margin.bottom;
export { margin, width, innerWidth, innerHeight, height };

export enum colors {
	N = 'rgb(34, 34, 34)',
	L = 'rgb(183, 116, 9)',
	B = 'rgb(42, 102, 212)',
	W = 'rgb(97, 143, 67)',
	S = 'currentColor',
}

export enum strokes {
	N = '0',
	L = '5,5',
	B = '10,10',
	W = '10,10,5,5,5,10',
	S = '0',
}

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

export function getTransform(transform: string) {
	// Create a dummy g for calculation purposes only. This will never
	// be appended to the DOM and will be discarded once this function
	// returns.
	var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

	// Set the transform attribute to the provided string value.
	g.setAttributeNS(null, 'transform', transform);

	// consolidate the SVGTransformList containing all transformations
	// to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
	// its SVGMatrix.
	var matrix = g.transform.baseVal?.consolidate()?.matrix as DOMMatrix;

	// As per definition values e and f are the ones for the translation.
	return [matrix.e, matrix.f];
}

export function getCollisions(
	circles: Selection<BaseType | SVGCircleElement, Stop, SVGGElement, Train>
) {
	const transforms: any = {};
	const collision: any[] = [];

	circles.each(function (d, i) {
		const transform = select(this).attr('transform');
		const [x, y] = getTransform(transform);
		if (transforms.hasOwnProperty(transform)) {
			collision.push({ location: [x, y], data: d });
		}
		transforms[transform] = [x, y];
	});

	return collision;
}
