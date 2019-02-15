import {
	widgetCard, widgetCardTitle, widgetCardPeriod, widgetCardRange, textField, date, header, redBox, blueBox, inlineBlock,
	underline, secondLine, widgetRepositoryContainer, widgetRepositoryItem
} from './Widget.style';

export default theme => ({
	widgetCard, widgetCardTitle, widgetCardPeriod, textField, widgetCardRange, date, header, redBox, blueBox, inlineBlock,
	underline, secondLine, widgetRepositoryContainer, widgetRepositoryItem,
	marginRight15: {
		'margin-right': '15px'
	},
	repositorySelectWidth: {
		'min-width': '150px'
	},
	mobileButtonContainer: {
		['@media (max-width: 620px)']: {
			'min-width': '100%'
		}
	},
	mobileSelectsContainer: {
		['@media (max-width: 620px)']: {
			'min-width': '100%',
			'& > div': {
				width: '50%',
				'& > div': {
					width: '98%'
				}
			}
		}
	}
});
