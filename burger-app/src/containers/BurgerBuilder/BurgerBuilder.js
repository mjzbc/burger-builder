import React, {Component} from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

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
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    // initialize ingredients dynamically from database
    componentDidMount() {
        axios.get('https://react-burger-85591.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data});
            })
            .catch(error => {
                this.setState({error: true})
            });
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


    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {




        const queryParams = [];
        for (let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice);

        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });

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


        // temporary spinner while burger ingredients fetched from database
        // so first check for ingredients
        let orderSummary = null;
        let burger = this.state.error? <p>Ingredients can't be loaded!</p> : <Spinner />

        if(this.state.ingredients){
        burger = (
            <Aux>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls 
                ingredientAdded={this.addIngredientHandler}
                ingredientRemoved={this.removeIngredientHandler}
                disabled={disabledInfo}
                price={this.state.totalPrice}
                purchasable={this.state.purchasable}
                ordered={this.purchaseHandler}/>
            </Aux> );

        orderSummary = <OrderSummary 
                ingredients={this.state.ingredients}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} 
                price={this.state.totalPrice}/> ;
        }

        if(this.state.loading){
            orderSummary = <Spinner />;
        }

        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}

            </Aux>
        );
    }

}

export default withErrorHandler(BurgerBuilder, axios);