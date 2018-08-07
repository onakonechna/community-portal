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
    console.log(e);
    const position = this.pieRef.current!.getBoundingClientRect();
    console.log((position as any).x, (position as any).y);
    // this.setState({ x: position.x, y: position: y })
    // const position = (this.refs.pc as any).findDOMNode().getBoundingClientRect();
    // console.log(position, e.nativeEvent.offsetX, e.screenX);

    // this.setState({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  }

  displayText(data: any) {
    return `Project: ${data.key} has ${data.value} Pull Requests`;
  }

  drawChart() {
    const div = new ReactFauxDOM.Element('div');
    const data = this.props.data.map((d:any) => ({ ...d }));

    const formattedData = d3.nest()
    .key((d: any) => d.project)
    .rollup(leaves => leaves.length as any)
    .entries(data);

    const svg = d3.select(div).append('svg')
      .attr('width', this.props.width)
      .attr('height', this.props.height)
      .append('g')
      .attr('transform', `translate(${this.props.width / 2}, ${this.props.height / 2})`);

    const pie = d3.pie()
      .sort(null)
      .value((d:any) => d.value);

    const path = d3.arc()
      .outerRadius(this.state.radius - 30)
      .innerRadius(0);

    d3.select(div)
      .append('div')
      .attr('class', 'pietip')
      .style('color', 'black')
      .style('opacity', 0)
      .style('position', 'relative');

    svg.append('g')
      .attr('class', 'title')
      .append('text')
      .text('Pull Requests by project')
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
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY + 'px')
          .style('opacity', 0.9)
          .text(this.displayText(d.data))
          .style('font-family', 'system-ui');
      })
      .on('mouseout', () => {
        d3.select('.pietip')
          .transition()
          .duration(300)
          .style('opacity', 0);
      });

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
