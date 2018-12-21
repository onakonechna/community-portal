import * as React from "react";
import Smile1 from '-!svg-react-loader!./../../../../static/images/Smile1.svg';
import Smile2 from '-!svg-react-loader!./../../../../static/images/Smile2.svg';
import Smile3 from '-!svg-react-loader!./../../../../static/images/Smile3.svg';
import Smile4 from '-!svg-react-loader!./../../../../static/images/Smile4.svg';
import Smile5 from '-!svg-react-loader!./../../../../static/images/Smile5.svg';
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from '@material-ui/core/IconButton';
import Typography from "@material-ui/core/Typography/Typography";

const styles: any = (theme: any) => ({
    smile: {
        "width": '100%',
        "height": '100%',
    },
    smallText: {
        fontSize: '0.9rem',
        marginBottom: '0.25rem',
        display: "inline",
        "margin-left": "5px",
    },
    smileBlock: {
        display: "inline-block",
        height: '7rem',
        width: '6rem',
        "margin-right": '4rem',
        "vertical-align": "top",
        "text-align": "center",
        "margin-top": "15px",
    },
    centerAlign: {
        textAlign: "center",
    }
});

const SmileIcon = ({value, index, props} : any) => {
    switch (parseInt(value)) {
        case 1:
            return (<Smile1 key={index} className={props.classes.smile}/>);

        case 2:
            return (<Smile2 key={index} className={props.classes.smile}/>);

        case 3:
            return (<Smile3 key={index} className={props.classes.smile}/>);

        case 4:
            return (<Smile4 key={index} className={props.classes.smile}/>);

        case 5:
            return (<Smile5 key={index} className={props.classes.smile}/>);

        default:
            return null;
    }
};

class Smile extends React.Component<any, any> {

    private input: any;

    onClickHandler() {
        this.input.click();
    }

    getLabelText(value: any) {
        switch (parseInt(value)) {
            case 1:
                return 'Not satisfied';

            case 2:
                return 'Bad';

            case 3:
                return 'Neutral';

            case 4:
                return 'Good';

            case 5:
                return 'Satisfied';

            default:
                return '';
        }
    }

    render() {
        let props = this.props;
        return (
            <div className={props.classes.smileBlock}>
                <div className={props.classes.centerAlign}>
                    <IconButton onClick={this.onClickHandler.bind(this)}>
                        <SmileIcon
                            value={props.option.data.text}
                            index={props.id}
                            props={props}
                        />
                    </IconButton>
                </div>
                <div className={props.classes.centerAlign}>
                    <input
                        onChange={props.onValueChange}
                        name={'radio_' + props.option.data.question_id}
                        type="radio"
                        id={props.id}
                        value={props.option.data.id}
                        ref={(ref) => this.input = ref}
                        // style={{display: "none"}}
                    />
                </div>
                <div className={props.classes.centerAlign}>
                    <label htmlFor={props.id}>
                        <Typography className={props.classes.smallText}>
                            {this.getLabelText(props.option.data.text)}
                        </Typography>
                    </label>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Smile);
