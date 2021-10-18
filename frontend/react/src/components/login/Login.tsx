/*
 * Copyright 2020 Bloomreach (http://www.bloomreach.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { FormEvent, useContext, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import { BrPageContext } from '@bloomreach/react-sdk';
import { useForgotPassword, useLogin } from '@bloomreach/connector-components-react';
import LoginContext from './LoginContext';

export function Login() {
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  return (
    <>
      {error &&
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      }
      {showForgotPassword ? 
        <ForgotPasswordForm setError={setError} setShowForgotPassword={setShowForgotPassword} />
        : 
        <LoginForm setError={setError} setShowForgotPassword={setShowForgotPassword} />
      }
    </>
  );
}

interface LoginPageProps {
  setError: React.Dispatch<React.SetStateAction<string>>;
  setShowForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

function LoginForm(props: LoginPageProps) {
  const { setError, setShowForgotPassword } = props;
  const [login, { customer, cart }, loading, error] = useLogin();
  const page = useContext(BrPageContext);
  const { cartId, setCartId } = useContext(LoginContext);
  const usernameInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search);
  const state = location.state as { mergeWithExistingCustomerCart?: boolean };
  
  const handleOnSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const username = usernameInput.current?.value;
    const password = passwordInput.current?.value;
    if (username && password) {
      const { customer, cart } = (await login({
        username,
        password,
        oldCartId: cartId,
        mergeWithExistingCustomerCart: state?.mergeWithExistingCustomerCart ?? true,
      })) ?? {};
      if (customer) {
        setCartId?.(cart?.id);
        history.push(page!.getUrl(query.get('returnURL') ?? '/'));
      }
    } else {
      setError("Credentials can't be empty.");
    }
  };

  return (
    <div className="row justify-content-center text-center mb-5">
      {error && <div className="alert alert-danger" role="alert">{error.message}</div>}
      <div className="col-12 mb-3">
        <h3>LOGIN</h3>
      </div>
      <form onSubmit={handleOnSubmit} className="mb-3">
        <div className="form-group">
          <label>Username</label>
          <input type='text' className="form-control" name="username" ref={usernameInput} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type='password' className="form-control" name="password" ref={passwordInput} />
        </div>
        {loading ?
          <Spinner animation="border" />
          :
          <button type="submit" className="btn btn-primary qa-login">Submit</button>
        }
      </form>
      <div className="col-12 mb-3">
        <a href="#" onClick={() => setShowForgotPassword(true)}>Forgot your password?</a>
      </div>      
    </div>
  )
}

function ForgotPasswordForm(props: LoginPageProps) {
  const { setError, setShowForgotPassword } = props;
  const [forgotPassword, _, loading, error] = useForgotPassword();
  const emailInput = useRef<HTMLInputElement>(null);

  async function handleFormSubmit(event: FormEvent) {
    event.preventDefault();
    const email = emailInput.current?.value;
    if (!email) {
      return;
    }
    const result = await forgotPassword({ email });
    if (result?.success) {
      setError(result.message);
      setShowForgotPassword(false);
    }
  }

  return (
    <div className="row justify-content-center text-center mb-5">
      {error && <div className="alert alert-danger" role="alert">{error.message}</div>}
      <div className="col-12 mb-3">
        <h3>RESET YOUR PASSWORD</h3>
        <h5>We will send you an email to reset your password.</h5>
      </div>
      <form onSubmit={handleFormSubmit} className="mb-3">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="text" id="email" className="form-control" name="email" ref={emailInput} required />
        </div>
        {loading ?
          <Spinner animation="border" />
          :
          <button type="submit" className="btn btn-primary qa-change-password">Submit</button>
        }
      </form>
      <div className="col-12 mb-3">
        <a href="#" onClick={() => setShowForgotPassword(false)}>Cancel</a>
      </div>
    </div>
  );
}