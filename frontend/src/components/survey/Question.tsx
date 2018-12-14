import * as React from "react";
import Radio from './option/renderers/Radio';
import Text from './option/renderers/Text';
import Smile from './option/renderers/Smile';
import Typography from "@material-ui/core/Typography/Typography";
import {withStyles} from "@material-ui/core";

const Option = ({type, values, index, onValueChange} : any) => {
    switch (type) {
        case 'radio':
            return (<Radio option={values} onValueChange={onValueChange} id={index} key={index}/>);

        case 'text':
            return (<Text option={values} onValueChange={onValueChange} id={index} key={index}/>);

        case 'smile':
            return (<Smile option={values} onValueChange={onValueChange} id={index} key={index}/>);

        default:
            return null;
    }
};

const styles: any = (theme: any) => ({
    smallText: {
        fontSize: '0.9rem',
        marginBottom: '0.25rem',
    },
    smallTextErrored: {
        fontSize: '0.9rem',
        marginBottom: '0.25rem',
        color: 'red'
    },
    question: {
        marginTop: '1.0rem',
    },
    centerAlign: {
        textAlign: "center"
    },
});

class Question extends React.Component<any, any> {

    constructor(props:any) {
        props.question.data.options.sort(function(a: any, b: any) {
            return a.data.order - b.data.order;
        });
        super(props);

        this.state = {
            result: null,
            error: false
        }
    }

    getData() {
        return this.state.result;
    }

    getId() {
        return this.props.question.data.id;
    }

    getIsRequired() {
        return this.props.question.data.is_required;
    }

    onValueChange(e: any) {
        this.setState({result: e.target.value});
    }

    setIsErrored(isError: boolean){
        this.setState({error: isError});
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.question}>
                <Typography className={this.state.error ? classes.smallTextErrored : classes.smallText}>
                    {this.props.question.data.text}
                    {this.props.question.data.is_required ? <span style={{color: 'red'}}> *</span> : ' (optional)'}
                </Typography>
                <div className={classes.centerAlign}>
                    {this.props.question.data.options.map((option:any, k:any) =>
                        <Option
                            type={this.props.question.data.type}
                            onValueChange={this.onValueChange.bind(this)}
                            key={k}
                            values={option}
                            index={k}
                        />)}
                </div>
            </div>
        )
    }
}
export default withStyles(styles, {name: 'Question'})(Question);
