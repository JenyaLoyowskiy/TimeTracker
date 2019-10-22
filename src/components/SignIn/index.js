import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignInPage = () => (
    <SignInForm />
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
        <div className={'login-page'}>
            <div className={'form'}>
                <form className={'login-form'} onSubmit={this.onSubmit}>
                    <input
                        name="email"
                        value={email}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Email Address"
                        className={'login-page'}
                    />
                    <input
                        name="password"
                        value={password}
                        onChange={this.onChange}
                        type="password"
                        placeholder="Password"
                    />
                    <button className={'login'} disabled={isInvalid} type="submit">
                        Sign In
                    </button>
                    <p className={"message"}>Not registered? <Link to={ROUTES.SIGN_UP}>Create an account</Link></p>
                    <p className={"message"}><PasswordForgetLink /></p>
                    {error && <p>{error.message}</p>}
                </form>
            </div>
        </div>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
