import { scaleBand, scaleLinear, select, Selection } from 'd3';
import { max } from 'd3-array';
import { useEffect, useRef, useState } from 'react';
import './App.css';

const data = [
	{ name: 'foo', number: 9000 },
	{ name: 'bar', number: 1234 },
	{ name: 'baz', number: 3456 },
	{ name: 'fuu', number: 4567 },
	{ name: 'pill', number: 5678 },
];

function App() {
	const svgRef = useRef(null);
	const [selection, setSelection] = useState<null | Selection<
		null,
		unknown,
		null,
		undefined
	>>(null);
	const maxValue = max(data, d => d.number) || 10000;
	const y = scaleLinear()
		//domain([0, 10000]) 10000 is the biggest number above, and 500 is the height of the svg. However, the data can be remove or changed, so does the max number
		.domain([0, maxValue])
		.range([0, 500]);
	const x = scaleBand()
		.domain(data.map(d => d.name))
		.range([0, 800])
		.paddingInner(0.05);
	useEffect(() => {
		if (!selection) {
			setSelection(select(svgRef.current));
		} else {
			selection
				.selectAll('rect')
				.data(data)
				.enter()
				.append('rect')
				.attr('width', x.bandwidth)
				.attr('height', d => y(d.number))
				.attr('x', d => x(d.name) || null)
				.attr('fill', 'blue');
		}
	}, [selection, y, x]);

	return (
		<div>
			<svg ref={svgRef} width={800} height={500} />
		</div>
	);
}

export default App;
