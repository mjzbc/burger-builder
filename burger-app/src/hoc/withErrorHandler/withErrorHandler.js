import React, {Component} from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';


const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {

        state = {
            error:null
        }

        componentWillMount () {
            // create property requestInterceptor to store interceptor setup
            // and for the response 
            this.requestInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null});
                return req;
            });
            this.responseInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({error: error});
            });
        }

        // to clear up the instance interceptors, prevent memory leak
        // use the property to eject reference to it
        componentWillUnmount() {
            axios.interceptors.request.eject(this.requestInterceptor);
            axios.interceptors.response.eject(this.responseInterceptor);
        }

        errorConfirmedHander = () => {
            this.setState({error:null});
        }

        render() {
            return (
                <Aux>
                    <Modal 
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHander}>
                        
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>                
            );
        }
    }
}

export default withErrorHandler;