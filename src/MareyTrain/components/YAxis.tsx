import { select } from 'd3';
import { memo, useEffect, useRef } from 'react';
import { Station } from '../types';
import { innerWidth } from '../utils';

interface YAxisProps {
	scale: any;
	stations: Station[];
}

const YAxis = ({ scale, stations }: YAxisProps) => {
	const ref = useRef<SVGGElement>(null as unknown as SVGGElement);
	useEffect(() => {
		const axisGroup = select(ref.current);
		axisGroup.selectAll('*').remove();
		const yAxis = (g: any) =>
			g
				.style('font', '10px sans-serif')
				.selectAll('g')
				.data(stations)
				.join('g')
				.attr('transform', (d: Station) => `translate(0, ${scale(d.distance)})`)
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
		axisGroup.call(yAxis);
	}, [scale, stations]);
	return <g ref={ref} />;
};

export default memo(YAxis);
