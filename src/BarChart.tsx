import { csv, max, scaleBand, scaleLinear } from 'd3';
import React, { useEffect, useState } from 'react';

interface User {
	date: string;
	price: string;
}

interface dataState {
	date: Date | null;
	price: number;
}

const csvUrl =
	'https://gist.githubusercontent.com/curran/0ac4077c7fc6390f5dd33bf5c06cb5ff/raw/605c54080c7a93a417a3cea93fd52e7550e76500/UN_Population_2019.csv';

const width = 960;
const height = 500;
const margin = { top: 20, right: 20, bottom: 20, left: 200 };

interface MarksProp {
	data: any[];
	xScale: any;
	yScale: any;
}
const Marks = ({ data, xScale, yScale }: MarksProp) => {
	return (
		<>
			{data.map(d => (
				<rect
					key={d.Country}
					x={0}
					y={yScale(d.Country)}
					width={xScale(d.Population)}
					height={yScale.bandwidth()}
				/>
			))}
		</>
	);
};
const BarChart = () => {
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		const row = (d: any) => {
			d.Population = +d['2020'];
			return d;
		};
		csv(csvUrl, row).then(data => {
			setData(data.slice(0, 10));
		});
	}, []);

	if (!data) {
		return <pre>Loading...</pre>;
	}

	const innerHeight = height - margin.top - margin.bottom;
	const innerWidth = width - margin.left - margin.right;

	const yScale = scaleBand()
		.domain(data.map(d => d.Country))
		.range([0, innerHeight]);

	const xScale = scaleLinear()
		.domain([0, max(data, d => d.Population)])
		.range([0, innerWidth]);

	return (
		<svg width={width} height={height}>
			<g transform={`translate(${margin.left},${margin.top})`}>
				{xScale.ticks().map(tickValue => (
					<g key={tickValue} transform={`translate(${xScale(tickValue)},0)`}>
						<line y2={innerHeight} stroke="black" />
						<text
							style={{ textAnchor: 'middle' }}
							dy=".71em"
							y={innerHeight + 3}
						>
							{tickValue}
						</text>
					</g>
				))}
				{yScale.domain().map(tickValue => (
					<text
						key={tickValue}
						style={{ textAnchor: 'end' }}
						x={-3}
						dy=".32em"
						y={yScale(tickValue) || 0 + yScale.bandwidth() / 2}
					>
						{tickValue}
					</text>
				))}
				<Marks data={data} xScale={xScale} yScale={yScale} />
			</g>
		</svg>
	);
};

export default BarChart;
