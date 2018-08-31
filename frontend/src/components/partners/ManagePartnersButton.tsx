import * as React from 'react';
import { Link } from 'react-router-dom';

const ManagePartnersButton = (props: any) => (
    <Link to={props.url}>{props.label}</Link>
);

export default ManagePartnersButton;