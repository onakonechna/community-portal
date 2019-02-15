import {
	widgetCard, widgetCardTitle, widgetCardPeriod, widgetCardRange, textField, date, header, redBox, blueBox, inlineBlock,
	underline, secondLine, widgetRepositoryContainer, widgetRepositoryItem
} from './Widget.style';

export default theme => ({
	widgetCard, widgetCardTitle, widgetCardPeriod, widgetCardRange, textField, date, header, redBox, blueBox, inlineBlock,
	underline, secondLine, widgetRepositoryContainer, widgetRepositoryItem,
	rangeContainer: {
		'width': '280px',
		['@media (max-width: 686px)']: {
			'width': '266px'
		},
		['@media (max-width: 661px)']: {
			'margin-top': '10px',
			'width': '100%',
			'& > div': {
				'width': '100%',
				'& > div': {
					'width': '100%'
				}
			}
		}

	},
	buttonsContainer: {
			'min-width': '266px',
			['@media (max-width: 661px)']: {
				'justify-content': 'center',
				'min-width': '100%',
				'& > div': {
					'width': '100%',
					'& > button': {
						'width': '25%'
					}
				}
			}
	},
});

