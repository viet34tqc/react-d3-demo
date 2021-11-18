import { select } from 'd3';
import { memo, useEffect, useRef } from 'react';
import { height, innerWidth, margin } from '../utils';

const Def = () => {
	const ref = useRef<SVGDefsElement>(null as unknown as SVGDefsElement);
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

export default memo(Def);
