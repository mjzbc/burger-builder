import React from 'react';
import classes from './Backdrop.module.css';

const backdrop = (props) => {
    return (
        // Just check if 'to show' is true
        props.show ? <div className={classes.Backdrop} onClick={props.clicked}></div> : null
        );
}

export default backdrop;