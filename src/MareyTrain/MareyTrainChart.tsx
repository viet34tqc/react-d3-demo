import { extent, scaleLinear, scaleTime } from 'd3';
import { useMemo, useRef } from 'react';
import Def from './components/Def';
import Trains from './components/Trains';
import XAxis from './components/XAxis';
import YAxis from './components/YAxis';
import { Station, Train } from './types';
import {
	height,
	innerHeight,
	innerWidth,
	margin,
	parseTime,
	width,
} from './utils';

interface MareyTrainChartProps {
	stations: Station[];
	trains: Train[];
	times: string[];
}

const MareyTrainChart = ({ trains, stations, times }: MareyTrainChartProps) => {
	const svgRef = useRef(null);

	const xScale = useMemo(
		() =>
			scaleTime()
				.domain([parseTime(times[0]), parseTime(times[1])])
				.range([0, innerWidth]),
		[times]
	);

	const yScale = useMemo(
		() =>
			scaleLinear()
				.domain(
					extent(stations, (d: Station) => d.distance) as [number, number]
				)
				.range([0, innerHeight]),
		[stations]
	);

	return (
		<svg ref={svgRef} width={width} height={height}>
			<g transform={`translate(${margin.left},${margin.top})`}>
				<XAxis type="top" scale={xScale} />
				<XAxis
					type="bottom"
					scale={xScale}
					transform={`translate(0,${innerHeight})`}
				/>
				<YAxis scale={yScale} stations={stations} />
				<Def />
				<Trains xScale={xScale} yScale={yScale} trains={trains} />
			</g>
		</svg>
	);
};

export default MareyTrainChart;
