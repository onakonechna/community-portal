import * as React from "react";
import {Line} from 'react-chartjs-2';

export class LineGraph extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
	}

	getDatasets = (item, labels) => item.map(data => ({
		label: data.label,
		fill: false,
		lineTension: 0.1,
		backgroundColor: data.colors.primaryColor,
		borderColor: data.colors.secondaryColor,
		borderCapStyle: 'butt',
		borderDash: [],
		borderDashOffset: 0.0,
		borderJoinStyle: 'miter',
		pointBorderColor: 'rgba(75,192,192,1)',
		pointBackgroundColor: '#fff',
		pointBorderWidth: 1,
		pointHoverRadius: 5,
		pointHoverBackgroundColor: data.colors.primaryColor,
		pointHoverBorderColor: data.colors.secondaryColor,
		pointHoverBorderWidth: 2,
		pointRadius: 3,
		pointHitRadius: 10,
		data: this.normalizeData(labels, data.data)
	}));

	normalizeData = (labels, dataset) => {
		let data:any[] = [];
		let previous = 0;

		labels.forEach(item => {
			if (!dataset[item]) {
				data.push({x: item, y: previous})
			} else {
				previous = dataset[item];
				data.push({x: item, y:dataset[item]})
			}
		});

		return data;
	};

	render() {
		return (
			<Line
				data={{
					labels: this.props.labels,
					datasets: this.getDatasets(this.props.datasets, this.props.labels)
				}}
				options={{
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true,
								// @ts-ignore
								precision: 0
							}
						}]
					}
				}}
				width={600}
				height={300}
			/>
		);
	}
}

export default LineGraph;
