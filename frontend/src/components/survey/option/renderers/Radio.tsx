import * as React from "react";

class Radio extends React.Component<any, any> {
    render() {
        return (
            <div>
                <input
                    onChange={this.props.onValueChange}
                    name={'radio_' + this.props.option.data.question_id}
                    type="radio"
                    id={this.props.id}
                    value={this.props.option.data.id}
                />
                <label htmlFor={this.props.id}>{this.props.option.data.text}</label>
            </div>
        )
    }
}

export default (Radio)
