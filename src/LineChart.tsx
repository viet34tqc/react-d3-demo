/* istanbul ignore file */
import {
	csv,
	curveNatural,
	extent,
	line,
	scaleLinear,
	scaleTime,
	timeFormat,
} from 'd3';
import { useEffect, useState } from 'react';

const width = 960;
const height = 500;
const margin = { top: 20, right: 30, bottom: 65, left: 90 };
const xAxisLabelOffset = 50;
const yAxisLabelOffset = 45;
const csvUrl =
	'https://gist.githubusercontent.com/curran/90240a6d88bdb1411467b21ea0769029/raw/7d4c3914cc6a29a7f5165f7d5d82b735d97bcfe4/week_temperature_sf.csv';

interface AxisBottomProp {
	xScale: any;
	innerHeight: any;
	tickFormat: any;
	tickOffset: any;
}
interface AxisLeftProp {
	yScale: any;
	innerWidth: any;
	tickOffset: any;
}

const AxisBottom = ({
	xScale,
	innerHeight,
	tickFormat,
	tickOffset = 3,
}: AxisBottomProp) =>
	xScale.ticks().map((tickValue: any) => (
		<g
			className="tick"
			key={tickValue}
			transform={`translate(${xScale(tickValue)},0)`}
		>
			<line y2={innerHeight} />
			<text
				style={{ textAnchor: 'middle' }}
				dy=".71em"
				y={innerHeight + tickOffset}
			>
				{tickFormat(tickValue)}
			</text>
		</g>
	));

const AxisLeft = ({ yScale, innerWidth, tickOffset = 3 }: AxisLeftProp) =>
	yScale.ticks().map((tickValue: any) => (
		<g className="tick" transform={`translate(0,${yScale(tickValue)})`}>
			<line x2={innerWidth} />
			<text
				key={tickValue}
				style={{ textAnchor: 'end' }}
				x={-tickOffset}
				dy=".32em"
			>
				{tickValue}
			</text>
		</g>
	));

interface MarksProp {
	data: any[];
	xScale: any;
	yScale: any;
	xValue: any;
	yValue: any;
	tooltipFormat: any;
	circleRadius: any;
}

const Marks = ({
	data,
	xScale,
	yScale,
	xValue,
	yValue,
	tooltipFormat,
	circleRadius,
}: MarksProp) => (
	<>
		<path
			fill="none"
			stroke="black"
			strokeLinejoin="round"
			d={
				line()
					.curve(curveNatural)
					.x(d => xScale(xValue(d)))
					.y(d => yScale(yValue(d)))(data) || ''
			}
		/>
		{data.map(d => (
			<circle
				className="mark"
				cx={xScale(xValue(d))}
				cy={yScale(yValue(d))}
				r={circleRadius}
			>
				<title>{tooltipFormat(xValue(d))}</title>
			</circle>
		))}
	</>
);

const LineChart = () => {
	const [data, setData] = useState<Array<any>>([]);
	useEffect(() => {
		const row = (d: any) => {
			d.temperature = +d.temperature;
			d.timestamp = new Date(d.timestamp);
			return d;
		};
		csv(csvUrl, row).then(setData);
	}, []);

	if (!data) {
		return <pre>Loading...</pre>;
	}

	const innerHeight = height - margin.top - margin.bottom;
	const innerWidth = width - margin.left - margin.right;

	const xValue = (d: any) => d.timestamp;
	const xAxisLabel = 'Time';

	const yValue = (d: any) => d.temperature;
	const yAxisLabel = 'Temperature';
	const xScale = scaleTime()
		.domain(extent(data, xValue) as [Date, Date])
		.range([0, innerWidth])
		.nice();

	const yScale = scaleLinear()
		.domain(extent(data, yValue) as [Number, Number])
		.range([innerHeight, 0])
		.nice();

	const xAxisTickFormat = timeFormat('%a');

	return (
		<svg width={width} height={height}>
			<g transform={`translate(${margin.left},${margin.top})`}>
				<AxisBottom
					xScale={xScale}
					innerHeight={innerHeight}
					tickFormat={xAxisTickFormat}
					tickOffset={5}
				/>
				<text
					className="axis-label"
					textAnchor="middle"
					transform={`translate(${-yAxisLabelOffset},${
						innerHeight / 2
					}) rotate(-90)`}
				>
					{yAxisLabel}
				</text>
				<AxisLeft yScale={yScale} innerWidth={innerWidth} tickOffset={5} />
				<text
					className="axis-label"
					x={innerWidth / 2}
					y={innerHeight + xAxisLabelOffset}
					textAnchor="middle"
				>
					{xAxisLabel}
				</text>
				<Marks
					data={data}
					xScale={xScale}
					yScale={yScale}
					xValue={xValue}
					yValue={yValue}
					tooltipFormat={xAxisTickFormat}
					circleRadius={3}
				/>
			</g>
		</svg>
	);
};

export default LineChart;
