import { tsv } from 'd3';
import { useEffect, useState } from 'react';
import TimeRangeSlider from './components/Slider';
import MareyTrainChart from './MareyTrainChart';
import { RawDataItem, Station, Train } from './types';
import { convertMinutesToTimes, parseTime } from './utils';

const MareyTrain = () => {
	const [stations, setStations] = useState<Station[]>([]);
	const [minutes, setMinutes] = useState([270, 720]);
	const [trains, setTrains] = useState<Train[]>([]);
	const fetchData = async () => {
		const originalItems = (await tsv(
			'data/data.tsv'
		)) as unknown as RawDataItem[];
		const stations: Station[] = [];

		const trains: Train[] = originalItems
			.map((...[train, trainIndex]) => {
				if (trainIndex === 0) {
					for (const key in train) {
						if (/^stop\|/.test(key)) {
							const stopFragments = key.split('|');

							// Get the station list
							// This station list from each item from raw Data is the same
							// So we only need to extract the stations from the first one
							stations.push({
								distance: +stopFragments[2],
								key,
								name: stopFragments[1],
								zone: +stopFragments[3],
							});
						}
					}
					setStations(stations);
				}

				return {
					direction: train.direction,
					id: trainIndex,
					number: train.number,
					stops: stations
						.map(station => ({
							station,
							time: parseTime(train[station.key]),
							trainId: trainIndex,
						}))
						.filter(station => (station.time as unknown) !== null),
					type: train.type,
				};
			})
			.filter(train => /[NLB]/.test(train.type));

		setTrains(trains);
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleChangeMinutes = (event: any, newValue: any) => {
		setMinutes(newValue);
	};

	if (stations.length === 0) return <div>Loading...</div>;

	const times = minutes.map(convertMinutesToTimes);

	return (
		<>
			<TimeRangeSlider minutes={minutes} onChange={handleChangeMinutes} />
			<MareyTrainChart stations={stations} trains={trains} times={times} />
		</>
	);
};

export default MareyTrain;
