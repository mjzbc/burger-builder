import React, {Component} from 'react';
import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
   
    componentDidUpdate(){
        console.log("[OrderSummary} WillUpdate")
    }

    render () {
        
        const ingredientSummary = Object.keys(this.props.ingredients)
        .map(ingredientKey => {
            return (
            <li key={ingredientKey}>
                <span style={{textTransform: 'capitalize'}}>{ingredientKey}</span>: { this.props.ingredients[ingredientKey]}
            </li>);
        });
        return (
            <Aux>
                <h3>Your Order: ${this.props.price.toFixed(2)}</h3>
                <p>Your burger has the following awesomeness:</p>
                <ul>
                    {ingredientSummary}
                </ul>
                <p>Continue to checkout?</p>
                <Button btnType="Danger" clicked={this.props.purchaseCancelled}>CANCEL</Button>
                <Button btnType="Success" clicked={this.props.purchaseContinued}>CONTINUE</Button>
            </Aux>
        )
    }
}

export default OrderSummary;