import React, { Component } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

class RegisterModal extends Component {
    render() {
        return (
            <div className="modal fade" id="registerModal" tabIndex="-1" role="dialog" aria-labelledby="registerModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="registerModalLabel">Register for the MusicDB</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <Formik
                            initialValues={{
                                username: '',
                                password: '',
                                role: 'user',
                                country: ''
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
                                this.props.handleRegister(values);
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
                                    <div className="form-group">
                                        <label htmlFor="role">User Role</label>
                                        <Field as="select" name="role" className="form-control">
                                            <option value="user" defaultValue>User</option>
                                            <option value="admin">Admin</option>
                                        </Field>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="country">Country</label>
                                        <Field as="select" name="country" className="form-control">
                                            <option value="" defaultValue disabled>Select your country</option>
                                            <option value="Germany">Germany</option>
                                            <option value="India">India</option>
                                            <option value="Philippines">Philippines</option>
                                        </Field>
                                    </div>
                                    <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                        Register
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

export default RegisterModal;