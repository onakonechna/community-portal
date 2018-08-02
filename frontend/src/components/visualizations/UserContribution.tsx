import * as React from 'react';
import * as d3 from 'd3';
import * as ReactFauxDOM from 'react-faux-dom';

const data = [
  { time: '2018-01-30T22:53:13Z', pr: 2 },
  { time: '2018-02-23T22:53:13Z', pr: 3 },
  { time: '2018-03-14T22:53:13Z', pr: 7 },
  { time: '2018-03-19T22:53:13Z', pr: 9 },
  { time: '2018-04-05T22:54:23Z', pr: 12 },
  { time: '2018-05-03T22:53:13Z', pr: 4 },
  { time: '2018-05-31T22:53:13Z', pr: 3 },
  { time: '2018-06-21T22:57:13Z', pr: 5 },
  { time: '2018-06-30T22:53:15Z', pr: 6 },
  { time: '2018-07-07T22:53:13Z', pr: 7 },
  { time: '2018-07-10T22:53:13Z', pr: 8 },
  { time: '2018-07-29T22:53:13Z', pr: 4 },
];

interface LineChartProps {
  chart?: any;
  data?: any;
  width: number;
  height: number;
}

interface Data {
  time: string;
  pr: number;
}

class LineChart extends React.Component<LineChartProps, {}> {
  static defaultProps: Partial<LineChartProps> = {
    chart: 'loading',
  };
  constructor(props: LineChartProps) {
    super(props);
  }

  drawChart() {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = this.props.width - margin.left - margin.right;
    const height = this.props.height - margin.top - margin.bottom;

    const x = d3.scaleTime()
      .rangeRound([0, width]);

    const y = d3.scaleLinear()
      .rangeRound([height, 0]);

    const parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%SZ');

    data.forEach((record) => {
      record.time = parseTime(record.time) as any;
    });

    const line = d3.line<Data>()
      .x(d => x(d.time as any))
      .y(d => y(d.pr));

    x.domain(d3.extent(data, d => d.time) as any);
    y.domain(d3.extent(data, d => d.pr) as any);

    const xAxis = d3.axisBottom(x).ticks(12).tickSizeInner(10);

    const yAxis = d3.axisLeft(y)
      .ticks(6);

    // Create the element
    const div = new ReactFauxDOM.Element('div');

    // Pass it to d3.select and proceed as normal
    const svg = d3.select(div).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);
      // .append('text')
      // .attr('transform', 'rotate(-90)')
      // .attr('y', 60)
      // .attr('dy', '.71em')
      // .style('text-anchor', 'end')
      // .text('#PR');

    svg.append('g')
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    return div.toReact();
  }

  render() {
    return this.drawChart();
  }
}

export default LineChart;
