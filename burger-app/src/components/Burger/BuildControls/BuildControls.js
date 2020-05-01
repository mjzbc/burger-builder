import React from 'react';
import classes from './BuildControls.module.css';
import BuildControl from './BuildControl/BuildControl';

// Array of controls to be rendered
const controls = [
    {label: 'Salad', type: 'salad'},
    {label: 'Bacon', type: 'bacon'},
    {label: 'Cheese', type: 'cheese'},
    {label: 'Meat', type:'meat'}
]

const buildControls = (props) => {
    return (
        <div className={classes.BuildControls}>
            <p className={classes.Price}>Total: ${props.price.toFixed(2)}</p>
            { controls.map( (ctrl, index) => (
                <BuildControl 
                key={index} 
                ingredientLabel={ctrl.label}
                added={() => props.ingredientAdded(ctrl.type)}
                removed={() => props.ingredientRemoved(ctrl.type)}
                disable={props.disabled[ctrl.type]}/>
            ))}
            <button 
            className={classes.OrderButton}
            disabled={!props.purchasable}
            onClick={props.ordered}>ORDER NOW</button>
        </div>

    )
}

export default buildControls;