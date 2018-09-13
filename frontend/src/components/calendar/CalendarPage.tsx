import * as React from "react";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = {
  calendarContainer: {
    "margin-top": "20px",
    "border": "0",
    "width": "100%",
    "padding": "30px",
    "box-sizing": "border-box"
  },
  iframe: {
    "width": "100%"
  }
};

class CalendarPage extends React.Component<any, any> {
  render() {
    return (
      <div className={this.props.classes.calendarContainer}>
        <iframe
          className={this.props.classes.iframe}
          style={{border: '0'}}
          src="https://calendar.google.com/calendar/embed?src=sn3me3pduhd92hhk9s7frkn57o@group.calendar.google.com"
          width="800"
          height="600"
          scrolling="yes"/>
      </div>
    )
  }
}

export default withStyles(styles)(CalendarPage);
