import * as React from 'react';
import * as d3 from 'd3';
import * as ReactFauxDOM from 'react-faux-dom';

import { Range } from 'rc-slider';
import SliderTooltip from './SliderTooltip';

import 'rc-slider/assets/index.css';

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
  data?: any;
  chart?: any;
  width: number;
  height: number;
}

interface LineChartState {
  data: any;
  slider: number[];
  minTime: any;
  maxTime: any;
  margin: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  x: number;
  y: number;
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

class LineChart extends React.Component<LineChartProps, LineChartState> {
  private lineRef : React.RefObject<HTMLDivElement>;
  static defaultProps: Partial<LineChartProps> = {
    chart: 'loading',
  };
  constructor(props: LineChartProps) {
    super(props);
    this.lineRef = React.createRef();
    this.state = {
      data: this.props.data,
      slider: [0, 100],
      minTime: new Date('December 17, 1995 03:24:00'),
      maxTime: new Date(),
      margin: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40,
      },
      x: 0,
      y: 0,
    };
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
  }

  onMouseMove(e:any) {
    const position = this.lineRef.current!.getBoundingClientRect();
    this.setState({
      x: e.nativeEvent.offsetX + (position as any).x,
      y: e.nativeEvent.offsetY + (position as any).y,
    });
  }

  onSliderChange(value:any) {
    this.setState({ slider: value });
  }

  drawChart() {
    const width = this.props.width - this.state.margin.left - this.state.margin.right;
    const height = this.props.height - this.state.margin.top - this.state.margin.bottom;

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

    const data = this.state.data.map((d:any) => ({ ...d }));

    data.forEach((record:any) => {
      record.time = parseTime(record.time) as any;
    });

    const x = d3.scaleTime()
    .rangeRound([0, width])
    .domain(d3.extent(data, (d: any) => d.time) as any);

    const y = d3.scaleLinear()
    .rangeRound([height, 0]);

    const formattedData = d3.nest()
      .key(toMonth)
      .rollup(leaves => leaves.length as any)
      .entries(data)
      .filter((record: any) => {
        const scale = width / 100;
        const minTime = x.invert(scale * this.state.slider[0]);
        const maxTime = x.invert(scale * this.state.slider[1]);
        return convertToDate(record.key)! >= minTime && convertToDate(record.key)! <= maxTime;
      });

    x.domain(d3.extent(formattedData, d => convertToDate(d.key)) as any);
    y.domain([0, d3.max(formattedData, d => d.value)] as any);

    const line = d3.line<Tally>()
      .curve(d3.curveNatural)
      .x(d => x(convertToDate(d.key) as Date) as number)
      .y(d => y(d.value));

    const xAxis = d3.axisBottom(x)
      .ticks(d3.timeMonth)
      .tickFormat(d3.timeFormat('%b'));

    const yAxis = d3.axisLeft(y)
      .ticks(4);

    const div = new ReactFauxDOM.Element('div');

    d3.select(div)
      .append('div')
      .attr('class', 'tooltip')
      .style('background-color', 'steelblue')
      .style('color', 'white')
      .style('width', '5%')
      .style('opacity', 0)
      .style('position', 'absolute')
      .text('tooltip');

    const svg = d3.select(div).append('svg')
      .attr('width', width + this.state.margin.left + this.state.margin.right)
      .attr('height', height + this.state.margin.top + this.state.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.state.margin.left},${this.state.margin.top})`);

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
      .style('position', 'relative')
      .style('bottom', '30px')
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
          .style('left', this.state.x + 'px')
          .style('top', this.state.y + 'px')
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
    const chart = this.drawChart();
    return (
      <div ref={this.lineRef} onMouseMove={this.onMouseMove}>
        {chart}
        <Range
          min={0}
          max={100}
          value={this.state.slider}
          handle={SliderTooltip}
          onChange={this.onSliderChange}
          style={{
            width: this.props.width - 50,
            position: 'relative',
            left: '35px',
          }}
        />
      </div>
    );
  }
}

export default LineChart;
