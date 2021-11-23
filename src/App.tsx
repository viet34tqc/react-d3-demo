/* istanbul ignore file */

import {
	axisBottom,
	axisLeft,
	scaleBand,
	scaleLinear,
	select,
	Selection,
} from 'd3';
import { max } from 'd3-array';
import randomstring from 'randomstring';
import { useEffect, useRef, useState } from 'react';
import './App.css';

const initialData = [
	{ name: 'foo', number: 9000 },
	{ name: 'bar', number: 1234 },
	{ name: 'baz', number: 3456 },
	{ name: 'fuu', number: 4567 },
	{ name: 'pill', number: 5678 },
];

const dimension = {
	width: 800,
	height: 500,
	chartWidth: 700,
	chartHeight: 400,
	marginLeft: 100,
};

function App() {
	const svgRef = useRef(null);
	const [data, setData] = useState(initialData);
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
			const maxValue = max(data, d => d.number) || 10000;
			const y = scaleLinear()
				//domain([0, 10000]) 10000 is the biggest number above, and 500 is the height of the svg. However, the data can be remove or changed, so does the max number
				.domain([0, maxValue])
				.range([dimension.chartHeight, 0]);
			const x = scaleBand()
				.domain(data.map(d => d.name))
				.range([0, dimension.chartWidth])
				.paddingInner(0.05);

			const yAxis = axisLeft(y)
				.ticks(3)
				.tickFormat(d => `$${d}`);
			const xAxis = axisBottom(x);
			selection
				.append('g')
				.classed('xAxis', true)
				.attr(
					'transform',
					`translate(${dimension.marginLeft}, ${dimension.chartHeight})`
				)
				.call(xAxis);

			selection
				.append('g')
				.attr('transform', `translate(${dimension.marginLeft}, 0)`)
				.call(yAxis);

			selection
				.append('g')
				.classed('wrapper', true)
				.attr('transform', `translate(${dimension.marginLeft}, 0)`)
				.selectAll('rect')
				.data(data)
				.enter()
				.append('rect')
				.attr('width', x.bandwidth)
				.attr('height', d => dimension.chartHeight - y(d.number))
				.attr('x', d => x(d.name) || null)
				.attr('y', d => y(d.number))
				.attr('fill', 'orange');
		}
	}, [selection]);

	useEffect(() => {
		if (selection) {
			const rects = selection.select('.wrapper').selectAll('rect').data(data);
			rects.exit().remove();

			const maxValue = max(data, d => d.number) || 10000;
			const y = scaleLinear()
				//domain([0, 10000]) 10000 is the biggest number above, and 500 is the height of the svg. However, the data can be remove or changed, so does the max number
				.domain([0, maxValue])
				.range([dimension.chartHeight, 0]);
			const x = scaleBand()
				.domain(data.map(d => d.name))
				.range([0, dimension.chartWidth])
				.paddingInner(0.05);

			const xAxis = axisBottom(x);
			selection.select('.xAxis').remove();
			selection
				.append('g')
				.classed('xAxis', true)
				.attr(
					'transform',
					`translate(${dimension.marginLeft}, ${dimension.chartHeight})`
				)
				.call(xAxis);

			rects
				.attr('width', x.bandwidth)
				.attr('height', d => dimension.chartHeight - y(d.number))
				.attr('x', d => x(d.name) || null)
				.attr('y', d => y(d.number))
				.attr('fill', 'orange');

			rects
				.enter()
				.append('rect')
				.attr('width', x.bandwidth)
				.attr('height', d => dimension.chartHeight - y(d.number))
				.attr('x', d => x(d.name) || null)
				.attr('y', d => y(d.number))
				.attr('fill', 'orange');
		}
	}, [data]);

	const addRandom = () => {
		const dataTobeAdded = {
			name: randomstring.generate(10),
			number: Math.floor(Math.random() * 8000 + 1000),
		};
		setData([...data, dataTobeAdded]);
	};

	const removeLast = () => {
		if (data.length === 0) return;

		const slicedData = data.slice(0, data.length - 1);
		setData(slicedData);
	};

	return (
		<div>
			<svg ref={svgRef} width={dimension.width} height={dimension.height} />
			<button onClick={addRandom}>Add random data</button>
			<button onClick={removeLast}>Remove data</button>
		</div>
	);
}

export default App;
