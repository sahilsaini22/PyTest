import React,  { Component , Fragment } from 'react';
import {
    Collapse, 
    Navbar, 
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem, 
    Container
} from 'reactstrap';
import RegisterModal from './RegisterModal';
import Logout from './Logout';
import LoginModal from './LoginModal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


class AppNavbar extends Component{
    state = {
        isOpen: false
    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    toggle = () => {
        this.setState(
            {
                isOpen: !this.state.isOpen
            }
        )
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;

        const authLinks = (
            <Fragment>
                <NavItem>
                    <span className="navbar-text mr-3">
                        <strong>
                            { user ? `logged-in as:  ${user.user.username} (${user.user.role})` : '' }
                        </strong>
                    </span>    
                </NavItem>
                <NavItem>   
                    <Logout/>
                </NavItem>   
            </Fragment>
        );

        const guestLinks = (
            <Fragment>
                <NavItem>   
                    <RegisterModal />
                </NavItem> 
                <NavItem>   
                    <LoginModal />
                </NavItem>  
            </Fragment>
        );

        return(
            <div>
                <Navbar color="primary" dark expand="sm" className="mb-5" >                
                    <Container>
                        <NavbarBrand href="/">
                            MusicDB
                        </NavbarBrand>
                        <NavbarToggler onClick={this.toggle} /> 
                        <Collapse isOpen={this.state.isOpen} navbar>                        
                            <Nav className="ml-auto" navbar>
                                { isAuthenticated ? authLinks : guestLinks }
                            </Nav>
                            <form className="form-inline my-2 my-lg-0">
                                <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                <button className="btn btn-outline-warning my-2 my-sm-0" type="submit">Search</button>
                            </form>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
        );     
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, null)(AppNavbar);