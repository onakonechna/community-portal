import * as React from "react";
import compose from "recompose/compose";
import withStyles from '@material-ui/core/styles/withStyles';

const styles: any = (theme: any) => ({
    textArea: {
        'width': '80%',
        'border-radius': '0',
        'box-shadow': 'none',
        'height': '5.0rem',
        'margin-top': '1.0rem',
    },
});

class Text extends React.Component<any, any> {

    render() {
        const { classes } = this.props;
        return (
            <div>
                <textarea
                    className={classes.textArea}
                    onChange={this.props.onValueChange}
                    name={'text_' + this.props.option.data.question_id}
                />
            </div>
        )
    }
}

export default compose<{}, any>(withStyles(styles, {name: 'Text'}))(Text);
