import React, {Component} from 'react';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {

    // constructor(props){
    //     super(props);
    //     this.state =
    // }

    // Manage state
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4,
        purchasable: false
    }

    updatePurchaseState (ingredients) {
        // Create array of values of ingredients.
        const sum = Object.keys(ingredients)
        .map(ingredientKey => {
            return ingredients[ingredientKey];
        })
        .reduce( (sum, el) => {
            return sum + el;
        },0);
        
        this.setState({purchasable: sum > 0});

    }

    addIngredientHandler = (type) => {
        const prevCount = this.state.ingredients[type];
        const updateCount = prevCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updateCount;
        
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});

        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        // Get original # of specific item type
        const prevCount = this.state.ingredients[type];
        // If there was none, return
        if(prevCount < 1){
            return;
        }
        // Update the # of items by removing 1
        const updatedCount = prevCount - 1;
        // Get the list of ingredients to update
        const updatedIngredients = {
            ...this.state.ingredients
        };

        // Update the specific ingredient with new lower value
        updatedIngredients[type] = updatedCount;

        /* PRICE UPDATE */
        const oldPrice = this.state.totalPrice;

        const newPrice = oldPrice - INGREDIENT_PRICES[type];

        this.setState({ingredients: updatedIngredients, totalPrice: newPrice});

        this.updatePurchaseState(updatedIngredients);
    }

    render() {
        // Disable button if no ingredients
        const disabledInfo = {
            ...this.state.ingredients
        };

        // Create the restructured object of ingredients
        // Check if the key has 0 value and set it to true or false
        // ex: {salad: false, bacon: true, cheese: true, meat: false}
        for (let ingredientKey in disabledInfo) {
            disabledInfo[ingredientKey] = disabledInfo[ingredientKey] <= 0;
        }

        return(
            <Aux>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls 
                ingredientAdded={this.addIngredientHandler}
                ingredientRemoved={this.removeIngredientHandler}
                disabled={disabledInfo}
                price={this.state.totalPrice}
                purchasable={this.state.purchasable}/>
            </Aux>
        );
    }

}

export default BurgerBuilder;