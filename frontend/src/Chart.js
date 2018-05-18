import React from 'react';
import Rickshaw from 'rickshaw'

export default class Chart extends React.Component {
    componentDidMount() {
      // set up our data series with 50 random data points

var seriesData = [ [], [], [] ];
var random = new Rickshaw.Fixtures.RandomData(150);

for (var i = 0; i < 150; i++) {
	random.addData(seriesData);
}

// instantiate our graph!

var graph = new Rickshaw.Graph( {
	element: document.querySelector("#chart_container"),
	width: 960,
	height: 500,
	renderer: 'line',
	series: [
		{
			color: "#c05020",
			data: seriesData[0],
			name: 'New York'
		}, {
			color: "#30c020",
			data: seriesData[1],
			name: 'London'
		}, {
			color: "#6060c0",
			data: seriesData[2],
			name: 'Tokyo'
		}
	]
} );
  
      graph.render();

      var hoverDetail = new Rickshaw.Graph.HoverDetail( {
        graph: graph
    } );
    
    var legend = new Rickshaw.Graph.Legend( {
        graph: graph,
        element: document.getElementById('legend')
    
    } );
    
    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
        graph: graph,
        legend: legend
    } );
    
    var axes = new Rickshaw.Graph.Axis.Time( {
        graph: graph
    } );
    axes.render();
    }
  
    render() {
      return(
          <div>
        <div id="chart_container" />
        <div id="legend" />
        </div>
      );
    }
  }