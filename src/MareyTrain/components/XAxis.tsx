import { select } from 'd3';
import { axisBottom, axisTop } from 'd3-axis';
import React, { useEffect, useRef } from 'react';
import { convertDateToString } from '../utils';

interface XAxisProps {
	type: string;
	scale: any;
	transform?: string;
}

const XAxis = ({ type, scale, transform }: XAxisProps) => {
	const ref = useRef<SVGGElement>(null as unknown as SVGGElement);
	useEffect(() => {
		const axisGenerator = type === 'top' ? axisTop : axisBottom;
		const axis = axisGenerator<Date>(scale)
			.ticks(8)
			.tickFormat(date => convertDateToString(date));
		const axisGroup = select(ref.current);
		axisGroup.call(axis).select('.domain').remove();
	}, [type, scale]);

	return <g ref={ref} transform={transform}></g>;
};

export default XAxis;
