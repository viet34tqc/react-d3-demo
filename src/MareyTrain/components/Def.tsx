import { select } from 'd3';
import { useEffect, useRef } from 'react';
import { height, innerWidth, margin } from '../utils';

const Def = () => {
	const ref = useRef<SVGGElement>(null as unknown as SVGGElement);
	useEffect(() => {
		const def = select(ref.current);
		def
			.append('clipPath')
			.attr('id', 'clipPath')
			.append('rect')
			.attr('y', -margin.top)
			.attr('width', innerWidth)
			.attr('height', height);
	}, []);

	return <defs ref={ref} />;
};

export default Def;
