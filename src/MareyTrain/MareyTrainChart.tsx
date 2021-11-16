import {
	axisBottom,
	axisTop,
	extent,
	line,
	scaleLinear,
	scaleTime,
	select,
	selectAll,
} from 'd3';
import React, { useEffect, useRef } from 'react';
import { Station, Stop, Train } from './types';
import {
	convertDateToString,
	getCollisions,
	getTrainTitle,
	parseTime,
} from './utils';

interface MareyTrainChartProps {
	stations: Station[];
	trains: Train[];
	times: string[];
}

const margin = { top: 20, right: 30, bottom: 20, left: 100 },
	width = 1400,
	innerWidth = width - margin.left - margin.right,
	height = 500,
	innerHeight = 500 - margin.top - margin.bottom;

enum colors {
	N = 'rgb(34, 34, 34)',
	L = 'rgb(183, 116, 9)',
	B = 'rgb(42, 102, 212)',
	W = 'rgb(97, 143, 67)',
	S = 'currentColor',
}

enum strokes {
	N = '0',
	L = '5,5',
	B = '10,10',
	W = '10,10,5,5,5,10',
	S = '0',
}

const MareyTrainChart = ({ trains, stations, times }: MareyTrainChartProps) => {
	const svgRef = useRef(null);

	useEffect(() => {
		const svg = select(svgRef.current);
		svg.selectAll('*').remove(); // Clear the svg before redraw

		const wrapper = svg
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const xScale = scaleTime()
			.domain([parseTime(times[0]), parseTime(times[1])])
			.range([0, innerWidth]);

		const yScale = scaleLinear()
			.domain(extent(stations, (d: Station) => d.distance) as [number, number])
			.range([0, innerHeight]);

		const xAxisBottom = axisBottom<Date>(xScale)
			.ticks(8)
			.tickFormat(date => convertDateToString(date));

		const xAxisTop = axisTop<Date>(xScale)
			.ticks(8)
			.tickFormat(date => convertDateToString(date));

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

		// Clip path
		wrapper
			.append('defs')
			.append('clipPath')
			.attr('id', 'clipPath')
			.append('rect')
			.attr('y', -margin.top)
			.attr('width', innerWidth)
			.attr('height', height);

		// Here is the line charts
		// Put it at the bottom so that it can be on top of other lines.
		const trainsChart = wrapper
			.append('g')
			.attr('stroke-width', 1.5)
			.attr('clip-path', "url(#clipPath)")
			.selectAll('g')
			.data(trains)
			.join('g');

		// d here has the type Stop
		const lines = line()
			.x((d: any) => xScale(d.time))
			.y((d: any) => yScale(d.station.distance));

		// Each train includes a line chart and circles
		// The data input is that train's stop list
		trainsChart
			.append('path')
			.attr('id', (d: Train) => `train_${d.id}`)
			.attr('fill', 'none')
			.attr('stroke', (d: Train) => colors[d.type])
			.attr('stroke-dasharray', (d: Train) => strokes[d.type])
			.attr('d', (d: any) => lines(d.stops))
			.on('mouseover', function (event: MouseEvent, train: Train) {
				const title = getTrainTitle(train);

				select('body')
					.append('div')
					.style('position', 'absolute')
					.attr('class', 'tooltip')
					.style('visibility', 'visible')
					.html(title)
					.style('top', `${event.clientY}px`)
					.style('left', `${event.clientX}px`);
			})
			.on('mouseleave', function () {
				selectAll('.tooltip').remove();
			});

		// Train name
		trainsChart
			.append('text')
			.attr('dy', '-2')
			.append('textPath')
			.attr('xlink:href', (d: Train) => `#train_${d.id}`)
			.style('text-anchor', 'middle')
			.style('font-size', '10px')
			.attr('startOffset', '50%')
			.text((d: Train) => getTrainTitle(d));

		const circles = trainsChart
			.append('g')
			.attr('stroke', 'white')
			.attr('fill', (d: Train) => colors[d.type])
			.selectAll('circle')
			.data((d: Train) => d.stops)
			.join('circle')
			.attr(
				'transform',
				(d: Stop) =>
					`translate(${xScale(d.time as Date)}, ${yScale(d.station.distance)})`
			)
			.attr('r', 3)
			.on('mouseover', function (event: MouseEvent, stop: Stop) {
				select('body')
					.append('div')
					.style('position', 'absolute')
					.attr('class', 'tooltip')
					.style('visibility', 'visible')
					.html(
						`
								<div>Current station: ${stop.station.name}</div>
								<div>Time: ${convertDateToString(stop.time as Date)}</div>
							`
					)
					.style('top', `${event.clientY}px`)
					.style('left', `${event.clientX}px`);
			})
			.on('mouseout', function () {
				selectAll('.tooltip').remove();
			});

		// Conflict points
		const collisions = getCollisions(circles);
		collisions.forEach(({ location, data }) => {
			console.log('data', data);
			trainsChart
				.append('rect')
				.attr('x', location[0] - 3)
				.attr('y', location[1] - 3)
				.style('fill', 'white')
				.style('width', '10px')
				.style('height', '10px')
				.style('stroke-width', '1px')
				.style('stroke', '#333')
				.on('mouseover', function (event: MouseEvent) {
					select('body')
						.append('div')
						.style('position', 'absolute')
						.attr('class', 'tooltip')
						.style('visibility', 'visible')
						.html(
							`
								<div>Conflict point: ${data.station.name}</div>
							`
						)
						.style('top', `${event.clientY}px`)
						.style('left', `${event.clientX}px`);
				})
				.on('mouseout', function () {
					selectAll('.tooltip').remove();
				});
		});
	}, [stations, trains, times]);

	return (
		<div>
			<svg ref={svgRef} width={width} height={height}></svg>
		</div>
	);
};

export default MareyTrainChart;
