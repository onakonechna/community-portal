import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

const  styles = (theme:any) => ({
  list: {
    'display': 'flex',
    'flex-wrap': 'wrap',
    'justify-content': 'space-between',
    'box-sizing': 'border-box'
  },
  listItem: {
    'flex': '1 0 37%',
    'max-width': '33%',
    'min-width': '200px',
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