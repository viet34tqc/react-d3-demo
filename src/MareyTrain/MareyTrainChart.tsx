import {
	axisBottom,
	axisTop,
	extent,
	line,
	scaleLinear,
	scaleUtc,
	select,
	Selection,
	timeFormat,
	utcHour,
} from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import { Station, Stop, Train } from './types';
import { parseTime, timeFormatStr } from './utils';

interface MareyTrainChartProps {
	stations: Station[];
	trains: Train[];
}

const margin = { top: 20, right: 30, bottom: 20, left: 100 },
	width = 1400,
	innerWidth = width - margin.left - margin.right,
	height = 500,
	innerHeight = 500 - margin.top - margin.bottom;

const colors = {
	N: 'rgb(34, 34, 34)',
	L: 'rgb(183, 116, 9)',
	B: 'rgb(192, 62, 29)',
	W: 'currentColor',
	S: 'currentColor',
};

const MareyTrainChart = ({ trains, stations }: MareyTrainChartProps) => {
	const svgRef = useRef(null);
	const [selection, setSelection] = useState<null | Selection<
		null,
		unknown,
		null,
		undefined
	>>(null);

	useEffect(() => {
		if (!selection) {
			setSelection(select(svgRef.current));
		} else {
			const wrapper = selection
				.append('g')
				.attr('transform', `translate(${margin.left},${margin.top})`);

			const xScale = scaleUtc()
				.domain([parseTime('4:30AM'), parseTime('1:30AM')])
				.range([0, innerWidth]);

			const yScale = scaleLinear()
				.domain(
					extent(stations, (d: Station) => d.distance) as [number, number]
				)
				.range([0, innerHeight]);

			const xAxisBottom = axisBottom<Date>(xScale)
				.ticks(utcHour)
				.tickFormat(date => timeFormat(timeFormatStr)(date as Date));

			const xAxisTop = axisTop<Date>(xScale)
				.ticks(utcHour)
				.tickFormat(date => timeFormat(timeFormatStr)(date as Date));

			const yAxis = (g: any) =>
				g
					.style('font', '10px sans-serif')
					.selectAll('g')
					.data(stations)
					.join('g')
					.attr(
						'transform',
						(d: Station) => `translate(0, ${yScale(d.distance)})`
					)
					.call((g: any) =>
						g
							.append('line')
							.attr('x2', innerWidth)
							.attr('stroke', '#ddd')
							.attr('stroke-dasharray', '1.1')
							.attr('shape-rendering', 'crispEdges')
					)
					.call((g: any) =>
						g
							.append('text')
							.attr('x', -12)
							.attr('dy', '0.35em')
							.attr('text-anchor', 'end')
							.text((d: Station) => d.name)
					);

			wrapper
				.append('g')
				.call(xAxisTop)
				.select('.domain')
				.remove()
				.selectAll('.tick line');

			wrapper
				.append('g')
				.call(xAxisBottom)
				.attr('transform', `translate(0,${innerHeight})`)
				.select('.domain')
				.remove();

			wrapper.append('g').call(yAxis);

			// Here is the line chart
			// Put it at the bottom so that it can't be hidden other lines

			const trainsChart = wrapper
				.append('g')
				.attr('stroke-width', 1.5)
				.selectAll('g')
				.data(trains)
				.join('g')
				.on('mouseover', function () {
					select(this).select('path').style('stroke-width', '5px');
				})
				.on('mouseleave', function () {
					select(this).select('path').style('stroke-width', '1.5px');
				});

			// d here has the type Stop
			const lines = line()
				.x((d: any) => xScale(d.time))
				.y((d: any) => yScale(d.station.distance));

			// Each train includes a line chart and circles
			// The data input is that train's stop list
			trainsChart
				.append('path')
				.attr('fill', 'none')
				.attr('stroke', (d: Train) => colors[d.type])
				.attr('d', (d: any) => lines(d.stops));

			trainsChart
				.append('g')
				.attr('stroke', 'white')
				.attr('fill', (d: Train) => colors[d.type])
				.selectAll('circle')
				.data((d: Train) => d.stops)
				.join('circle')
				.attr(
					'transform',
					(d: Stop) =>
						`translate(${xScale(d.time as Date)}, ${yScale(
							d.station.distance
						)})`
				)
				.attr('r', 3);
		}
	}, [stations, trains, selection]);

	return (
		<div>
			<svg ref={svgRef} width={width} height={height}></svg>
		</div>
	);
};

export default MareyTrainChart;
