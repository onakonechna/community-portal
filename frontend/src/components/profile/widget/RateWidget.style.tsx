import _extend from 'lodash/extend';
import {widgetCard, widgetCardTitle, header, blueBox, underline} from './Widget.style';

export default () => ({
	header, widgetCardTitle, blueBox,
	widgetCard: _extend(widgetCard, {
		'width': '600px',
		['@media (max-width: 1520px)']: {
			'width': '800px'
		}
	}),
	underline: _extend(underline, {
		'color': '#6b6868',
		'text-decoration': 'none'
	}),
	widgetCardText: {
		'font-size': '14px',
		'font-family': 'system-ui',
		'color': '#6b6868',
	},
	'width50': {
		'width': '50%'
	},
	'width100': {
		'width': '100%'
	},
	'progress': {
		'position': 'relative',
		'width': '180px',
		'height': '180px',
		'display': 'inline-block',
		'& > *': {
			position: 'absolute',
			left: '0',
			top: '0'
		}
	},
	'rateDataContainer': {
		display: 'inline-block',
		'margin': '0 20px',
		'text-align': 'left',
		'& > span': {
			'font-weight': 300
		}
	},
	'contentContainer': {
		'align-items': 'center',
		'display': 'inline-block',
		'vertical-align': 'top',
		'margin': '20px 0'

	},
	'bold': {
		'font-weight': 'bold'
	},
	rateResult: {
		position: 'absolute',
		left: '50%',
		'margin-left': '-44px',
		'margin-top': '-25px',
		top: '50%',
		'font-size': '44px',
		'font-weight': 'bold'
	},
	legend: {
		'width': '40px',
		height: '15px',
		display: 'inline-block',
		'vertical-align': 'top'
	},
	legendTotal: {
		background: '#f1e7e7',
		border: '1px solid #d3d3d3'
	},
	mergedLegend: {
		background: '#ff5700',
		border: '1px solid #e25004'
	},
	legendContainer: {
		width: '180px',
		'text-align': 'center',
		margin: '15px 0',
	},
	alignText: {
		'vertical-align': 'top',
		'margin': '0 0 0 7px'
	},
	itemMargin: {
		'margin': '5px 0'
	},
	leftContainer: {
		'display': 'inline-block',
		['@media (max-width: 550px)']: {
			'width': '100%',
			'text-align': 'center'
		}
	},
	mobileListContainer: {
		['@media (max-width: 550px)']: {
			'text-align': 'left'
		}
	}
});