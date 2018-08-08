import * as React from 'react';
import * as d3 from 'd3';
import * as ReactFauxDOM from 'react-faux-dom';

interface PieChartProps {
  data: any;
  width: number;
  height: number;
}

interface PieChartState {
  colorScale: any;
  margin: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  radius: number;
  x: number;
  y: number;
}

class PieChart extends React.Component<PieChartProps, PieChartState> {
  private pieRef : React.RefObject<HTMLDivElement>;
  constructor(props: PieChartProps) {
    super(props);
    this.pieRef = React.createRef();
    this.state = {
      colorScale: d3.scaleOrdinal(d3.schemeCategory10),
      margin: {
        left: 20,
        right: 80,
        top: 15,
        bottom: 20,
      },
      radius: Math.min(this.props.width, this.props.height) / 2,
      x: 0,
      y: 0,
    };
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  onMouseMove(e:any) {
    const position = this.pieRef.current!.getBoundingClientRect();
    this.setState({
      x: e.nativeEvent.offsetX + (position as any).x,
      y: e.nativeEvent.offsetY + (position as any).y,
    });
  }

  displayKey(data: any) {
    return data.key;
  }

  displayNumberOfPR(data: any) {
    if (data.value === 1) return '1PR';
    return `${data.value} PRs`;
  }

  drawChart() {
    const div = new ReactFauxDOM.Element('div');
    const data = this.props.data.map((d:any) => ({ ...d }));

    const formattedData = d3.nest()
    .key((d: any) => d.project)
    .rollup(leaves => leaves.length as any)
    .entries(data);

    d3.select(div)
      .append('div')
      .attr('class', 'pietip')
      .style('width', '10%')
      .style('color', 'black')
      .style('background-color', 'white')
      .style('border-radius', '0.2rem')
      .style('opacity', 0)
      .style('position', 'absolute');

    const svg = d3.select(div).append('svg')
      .attr('width', this.props.width)
      .attr('height', this.props.height)
      .style('overflow', 'visible')
      .append('g')
      .attr('transform', `translate(${this.props.width / 2}, ${this.props.height / 2})`);

    const pie = d3.pie()
      .sort(null)
      .value((d:any) => d.value);

    const path = d3.arc()
      .outerRadius(this.state.radius * .8)
      .innerRadius(this.state.radius * .2)
      .cornerRadius(7)
      .padAngle(.05);

    svg.append('g')
      .attr('class', 'title')
      .append('text')
      .text('Pull Requests by Project')
      .style('font-family', 'system-ui')
      .attr('transform', `translate(-${this.state.margin.right}, -${this.props.height / 2 - this.state.margin.top})`);

    const arc = svg.selectAll('arc')
      .data(pie(formattedData as any))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arc.append('path')
      .attr('d', path as any)
      .attr('fill', (d:any) => this.state.colorScale(d.data.key))
      .on('mouseover', (d:any) => {
        d3.select('.pietip')
          .transition()
          .duration(300)
          .style('left', this.state.x + 'px')
          .style('top', this.state.y + 'px')
          .style('opacity', 0.9)
          .style('font-family', 'system-ui');
        d3.select('.pietip').html(this.displayKey(d.data) + '<br />' + this.displayNumberOfPR(d.data));
      })
      .on('mouseout', () => {
        d3.select('.pietip')
          .transition()
          .duration(300)
          .style('opacity', 0);
      });

    const legend = svg.selectAll('legend')
      .data(formattedData)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', ((d:any, i: number) => {
        return `translate(0, ${this.props.height / 2 + i * 30})`;
      }));

    legend
      .append('rect')
      .attr('width', '1rem')
      .attr('height', '1rem')
      .style('fill', ((d:any) => this.state.colorScale(d.key)));

    legend
      .append('text')
      .attr('x', '1.5rem')
      .attr('y', '1rem')
      .text((d:any) => d.key)
      .style('font-family', 'system-ui')
      .style('font-size', '0.875rem');

    return div.toReact();
  }
  render() {
    const chart = this.drawChart();
    return <div ref={this.pieRef} onMouseMove={this.onMouseMove}>
      {chart}
    </div>;
  }
}

export default PieChart;
