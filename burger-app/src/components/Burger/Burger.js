import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {

    // Only ingredient names are extracted and passed, not values (ex: "cheese", not "2") and returns the array
    let transformedIngredients = Object.keys(props.ingredients)
    .map(ingKey => {
        return [...Array(props.ingredients[ingKey])].map((_, i) => {
            return <BurgerIngredient key={ingKey + i} type={ingKey} />;
        });
    })
    .reduce((prevValue, currentValue) => {
        // Use reduce to "flatten" the array to check if empty, no ingredients
        return prevValue.concat(currentValue);
    } , [] );

    console.log(transformedIngredients);

    if(transformedIngredients.length === 0) {
        transformedIngredients = <p>Please add ingredients</p>
    }


    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
}


export default burger;