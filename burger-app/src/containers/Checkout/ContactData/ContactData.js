import React, {Component}  from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';


class ContactData extends Component {

    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode:''
        },
        loading: false
    }

    orderHandler = (evt) => {
        evt.preventDefault();
        
        this.setState({loading: true});

        // alert("You will continue...");
        // need to calculate price server side! prevent clientside manipulation
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'Bob builder',
                address: {
                    street: '123 Fake st',
                    zipCode: '10016',
                    country: 'USA'
                },
                email: 'bob@bobtest.com'
            },
            deliveryMethod: 'fastest'
        };

        // choose a node name and add .json as required by firebase 'order' in this example
        axios.post('/orders.json', order)
            .then(response => {
                // stop loading regardless of response and also close modal
                this.setState({loading: false});
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({loading: false});
            });
    }

    render() {

        let form = (
        <form>
            <input className={classes.Input} type="text" name="name" placeholder="Enter name" />
            <input className={classes.Input} type="email" name="email" placeholder = "Enter email" />
            <input className={classes.Input} type="text" name="street" placeholder="Enter street" />
            <input className={classes.Input} type="text" name="postal" placeholder="Enter postal code" />
            <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
        </form>);
        if(this.state.loading){
            form = <Spinner />;
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData;