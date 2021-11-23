import { select, selectAll } from 'd3';
import { line } from 'd3-shape';
import { useEffect, useRef } from 'react';
import { Stop, Train } from '../types';
import {
	colors,
	convertDateToString,
	getCollisions,
	getTrainTitle,
	strokes,
} from '../utils';

interface TrainsProps {
	xScale: any;
	yScale: any;
	trains: Train[];
}

const Trains = ({ xScale, yScale, trains }: TrainsProps) => {
	const ref = useRef<SVGGElement>(null as unknown as SVGGElement);
	useEffect(() => {
		const lineGroup = select(ref.current);
		lineGroup.selectAll('*').remove();

		// Here is the line charts
		// Put it at the bottom so that it can be on top of other lines.
		const trainsChart = lineGroup
			.attr('stroke-width', 2)
			.attr('clip-path', 'url(#clipPath)')
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
				select(this).transition().attr('stroke-width', 4);
				const title = getTrainTitle(train);
				select('body')
					.append('div')
					.style('position', 'absolute')
					.attr('class', 'tooltip')
					.style('visibility', 'visible')
					.html(title)
					.style('top', `${event.clientY + 15}px`)
					.style('left', `${event.clientX + 15}px`);
			})
			.on('mouseleave', function () {
				select(this).transition().attr('stroke-width', 2);
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
			lineGroup
				.append('rect')
				.attr('x', location[0] - 3)
				.attr('y', location[1] - 3)
				.style('fill', 'white')
				.style('width', '10px')
				.style('height', '10px')
				.style('stroke-width', '1px')
				.style('stroke', '#333')
				.style('cursor', 'pointer')
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
				})
				// Demo broadcastChanel
				.on('click', () => {
					window.open(
						window.location.href,
						'_blank',
						'toolbar=0,location=0,menubar=0'
					);
				});
		});
	}, [trains, xScale, yScale]);
	return <g ref={ref} />;
};

export default Trains;
