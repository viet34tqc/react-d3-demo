export type TrainType = 'B' | 'L' | 'N';

export type RawDataItem = {
	[stop: string]: string;
	direction: string;
	number: string;
	type: TrainType;
};

export type Station = {
	distance: number;
	key: string;
	name: string;
	zone: number;
};

export type Stop = {
	station: Station;
	time: Date | null;
	trainId: number;
};

export type Train = {
	direction: string;
	id: number;
	number: string;
	stops: Stop[];
	type: TrainType;
};

export type SchedulesData = {
	stations: Station[];
	trains: Train[];
};
