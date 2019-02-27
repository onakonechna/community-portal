import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

const  styles = (theme:any) => ({
  list: {
    'display': 'flex',
    'width': '90%',
    'box-sizing': 'border-box',
    'margin': '0 auto',
    'flex-wrap': 'wrap',
    'justify-content': 'space-around'

  },
  listItem: {
    'padding': '20px',
    'min-width': '320px',
    'max-width': '320px',
    'text-align': 'center',
    'box-sizing': 'border-box'
  }
});


const prepareList = (list:any) => {
    let count = list.length,
        max = count + 5;

    for (count; count < max; count++) {
        list.push(null);
    }

    return list;
};

const List = (props:any) => {
    return (
        <div className={props.classes.list}>
            {prepareList(props.children).map(((child:any, i:any) =>
                    <div key={i} className={props.classes.listItem}>{child}</div>
            ))}
        </div>
    )
};

export default withStyles(styles)(List);