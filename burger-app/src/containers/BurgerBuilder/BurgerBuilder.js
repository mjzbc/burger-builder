import React, {Component} from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions';


class BurgerBuilder extends Component {

    // constructor(props){
    //     super(props);
    //     this.state =
    // }

    // Manage state
    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    // initialize ingredients dynamically from database
    componentDidMount() {
        // axios.get('https://react-burger-85591.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         this.setState({ingredients: response.data});
        //     })
        //     .catch(error => {
        //         this.setState({error: true})
        //     });
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
        
        return sum > 0;

    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
    }

    render() {
        // Disable button if no ingredients
        const disabledInfo = {
            ...this.props.ings
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

        if(this.props.ings){
        burger = (
            <Aux>
                <Burger ingredients={this.props.ings} />
                <BuildControls 
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved={this.props.onIngredientRemoved}
                    disabled={disabledInfo}
                    price={this.props.price}
                    purchasable={this.updatePurchaseState(this.props.ings)}
                    ordered={this.purchaseHandler}/>
            </Aux> );

        orderSummary = <OrderSummary 
                ingredients={this.props.ings}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} 
                price={this.props.price}/> ;
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

const mapStateToProps = (state) => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));