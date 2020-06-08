import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form, 
    FormGroup, 
    Label, 
    Input, 
    NavLink,
    Alert
} from 'reactstrap';
import{ connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';

class LoginModal extends Component {
    state = {
        modal: false,
        username: '',
        password: '',
        role: '',
        country: '',
        assigned: '',        
        value: '',
        msg: null
    };

    static propTypes = {  
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        login: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired 
    }

    componentDidUpdate(prevProps) {
        const { error, isAuthenticated } = this.props;
        if(error !== prevProps.error){
            if(error.id === 'LOGIN_FAIL'){
                this.setState({ msg: error.msg.msg})
            } else{
                this.setState( { msg: null})
            }
        }
        
        if (this.state.modal) {
            if (isAuthenticated) {
                this.toggle();
            }
        }

    }

    constructor(props) {
        super(props);
    
        this.toggledd = this.toggledd.bind(this);
        this.state = {
            dropdownOpen: true          
        };
    }
    
    toggledd() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    toggle = () => {
        this.props.clearErrors();
        this.setState({
            modal: !this.state.modal
        });
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })    
    }


    select = e => {
        this.setState({
            //dropdownOpen: !this.state.dropdownOpen,
            value: e.target.innerText
        });
    }


    onSubmit = e => {
        e.preventDefault();
       
        const { username, password } = this.state;
        const user = {
            username,
            password
        }

        //attempt login
        this.props.login(user);

        // close modal
        // this.toggle();
    }

    render() {
        return(
          <div>
              <NavLink onClick={this.toggle} href="#">
                  Login
              </NavLink>
              <Modal
              isOpen = {this.state.modal}
              toggle = {this.toggle}

              > 
                <ModalHeader toggle= {this.toggle}>
                    Login
                </ModalHeader>
                <ModalBody>
                    {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null }
                    <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input
                             type = "text"
                             name="username"
                             id="username"
                             placeholder="username"
                             onChange={this.onChange}
                            />

                            <br/>
                            <Label for="password">Password</Label>
                            <Input
                             type = "password"
                             name="password"
                             id="password"
                             placeholder="password"
                             onChange={this.onChange}
                            />

                            
                            <Button 
                            color="primary"
                            style={{marginTop: '2rem'}}
                            block
                            >
                                Login
                            </Button>
                        </FormGroup>
                    </Form>
                </ModalBody>
              </Modal>
          </div>      
        );
    }
}


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
});

export default connect(mapStateToProps, { login , clearErrors })(LoginModal);