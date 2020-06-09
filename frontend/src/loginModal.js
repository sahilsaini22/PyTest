import React, { Component } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

class LoginModal extends Component {
    render() {
        return (
            <div className="modal fade" id="loginModal" tabIndex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="loginModalLabel">Login to the MusicDB</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <Formik
                            initialValues={{
                                username: '',
                                password: ''
                            }}
                            validate={values => {
                                const errors = {};
                                if (!values.username) {
                                    errors.username = 'Required';
                                }
                                if (!values.password) {
                                    errors.password = 'Required';
                                }
                                return errors;
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                this.props.handleLogin(values);
                                setSubmitting(false);
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="form-group">
                                        <label htmlFor="username">Username</label>
                                        <Field type="text" name="username" className="form-control" />
                                        <ErrorMessage name="username" component="div" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <Field type="password" name="password" className="form-control" />
                                        <ErrorMessage name="password" component="div" />
                                    </div>
                                    <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                        Login
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                    {/* <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div> */}
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginModal;