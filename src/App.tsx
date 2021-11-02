import { select, Selection } from 'd3';
import { useEffect, useRef, useState } from 'react';
import './App.css';

const data = [
	{ width: 100, height: 200, color: 'blue' },
	{ width: 100, height: 150, color: 'red' },
	{ width: 100, height: 120, color: 'green' },
	{ width: 100, height: 100, color: 'orange' },
	{ width: 100, height: 70, color: 'teal' },
];

function App() {
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
			selection
				.selectAll('rect')
				.data(data)
				.enter()
				.append('rect')
				.attr('width', (d) => d.width)
				.attr('height', (d) => d.height)
				.attr('fill', (d) => d.color)
				.attr('x', (_, i) => i * 100);
		}
	}, [selection]);
	return (
		<div>
			<svg ref={svgRef} width={500}>

			</svg>
		</div>
	);
}

export default App;
