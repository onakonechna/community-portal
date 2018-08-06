import * as React from 'react';
import * as d3 from 'd3';
import * as ReactFauxDOM from 'react-faux-dom';

const test = [
  { time: '2017-11-30T22:53:13Z', project: 'PHP' },
  { time: '2018-02-23T22:53:13Z', project: 'Community Portal' },
  { time: '2018-03-14T22:53:13Z', project: 'AWS DynamoDB' },
  { time: '2018-03-19T22:53:13Z', project: 'Serverless Framework' },
  { time: '2018-04-05T22:54:23Z', project: 'AWS DynamoDB' },
  { time: '2018-05-03T22:53:13Z', project: 'AWS DynamoDB' },
  { time: '2018-05-31T22:53:13Z', project: 'Community Portal' },
  { time: '2018-06-21T22:57:13Z', project: 'Community Portal' },
  { time: '2018-06-30T22:53:15Z', project: 'AWS DynamoDB' },
  { time: '2018-07-07T22:53:13Z', project: 'Community Portal' },
  { time: '2018-07-10T22:53:13Z', project: 'Serverless Framework' },
  { time: '2018-07-29T22:53:13Z', project: 'Community Portal' },
];

const monthMap = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

interface LineChartProps {
  chart?: any;
  data?: any;
  width: number;
  height: number;
}

interface Tally {
  key: string;
  value: number;
}

function displayText(frequency: number, month: string) {
  if (frequency === 1) {
    return `1 PR for ${month}`;
  }
  return `${frequency} PRs for ${month}`;
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
    const parseFormattedTime = d3.timeParse('%Y%m');

    function convertToDate(input: string) {
      const year = input.split(' ')[0];
      const month = input.split(' ')[1];
      const convertedMonth = monthMap[month];
      return parseFormattedTime(year + convertedMonth);
    }

    const MonthFormatter = d3.timeFormat('%B');
    const YearFormatter = d3.timeFormat('%Y');

    const toMonth = (d:any) => YearFormatter(d.time) + ' ' + MonthFormatter(d.time).substring(0, 3);

    test.forEach((record) => {
      record.time = parseTime(record.time) as any;
    });

    const formattedData = d3.nest()
      .key(toMonth)
      .rollup(leaves => leaves.length as any)
      .entries(test);

    const line = d3.line<Tally>()
      .curve(d3.curveNatural)
      .x(d => x(convertToDate(d.key) as Date) as number)
      .y(d => y(d.value));

    x.domain(d3.extent(formattedData, d => convertToDate(d.key)) as any);
    y.domain([0, d3.max(formattedData, d => d.value)] as any);

    const xAxis = d3.axisBottom(x)
      .tickFormat(d3.timeFormat('%b'));

    const yAxis = d3.axisLeft(y)
      .ticks(4);

    const div = new ReactFauxDOM.Element('div');

    d3.select(div)
      .append('div')
      .attr('class', 'tooltip')
      .style('background-color', 'steelblue')
      .style('color', 'white')
      .style('width', '20%')
      .style('opacity', 0)
      .style('position', 'relative')
      .text('tooltip');

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
      .call(yAxis)
      .append('text')
      .attr('x', -5)
      .attr('y', -7)
      .attr('font-size', '15px')
      .attr('fill', 'black')
      .style('text-anchor', 'end')
      .text('#PR');

    svg.append('g')
      .attr('class', 'line chart title')
      .append('text')
      .attr('x', 200)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .text('#PRs over time')
      .style('font-family', 'system-ui');

    svg.append('g')
      .append('path')
      .datum(formattedData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line as any);

    svg.selectAll('dot')
      .data(formattedData)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('cx', d => x(convertToDate(d.key) as any))
      .attr('cy', (d:any) => y(d.value))
      .attr('fill', 'steelblue')
      .on('mouseover', (d:any) => {
        d3.select('.tooltip')
          .transition()
          .duration(300)
          .style('left', d3.event.pageX - 780 + 'px')
          .style('top', d3.event.pageY - 200 + 'px')
          .text(displayText(d.value, d.key))
          .style('opacity', 0.9);
      })
      .on('mouseout', (d:any) => {
        d3.select('.tooltip')
          .transition()
          .duration(500)
          .style('opacity', 0);
      });
    return div.toReact();
  }

  render() {
    return this.drawChart();
  }
}

export default LineChart;
