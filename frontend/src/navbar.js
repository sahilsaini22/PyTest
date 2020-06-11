import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';

class Navbar extends Component {
    render() {
        const userDetails = this.props.userDetails;
        let navLinks = userDetails ? (
            <>
                <div className="navbar-text">Hello {userDetails.username}</div>
                <li className="nav-item">
                    <a className="nav-link" onClick={this.props.handleLogout} href="#">Logout</a>
                </li>
            </>
        ) : ( 
            <>
                <li className="nav-item">
                    <a className="nav-link" data-toggle="modal" data-target="#registerModal" href="#">Register</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-toggle="modal" data-target="#loginModal" href="#">Login</a>
                </li>
            </>
        )

        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <a className="navbar-brand" href="#">MusicDB</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            {navLinks}
                        </ul>

                        <Formik
                            initialValues={{
                                query: '',
                            }}
                            validate={values => {
                                const errors = {};
                                if (!values.query) {
                                    errors.query = 'Required';
                                }
                                return errors;
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                this.props.handleSearch(values.query);
                                setSubmitting(false);
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form className="form-inline my-2 my-lg-0">
                                    <div className="form-group">
                                        <Field type="search" name="query" placeholder="Search songs" className="form-control mr-sm-2" />
                                    </div>
                                    <button type="submit" disabled={isSubmitting} className="btn btn-outline-success my-2 my-sm-0">
                                        Search
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;