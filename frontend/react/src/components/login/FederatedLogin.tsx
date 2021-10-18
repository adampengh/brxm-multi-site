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

import React, { FormEvent, useContext, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { BrProps } from '@bloomreach/react-sdk';
import { useFederatedLogin } from '@bloomreach/connector-components-react';
import LoginContext from './LoginContext';

// If DEBUG_MODE is set to true, the redirections are to be done manually, not automatically,
// with showing the form data in UI for debugging purpose.
const DEBUG_MODE = false;

export function FederatedLogin({ page, component }: BrProps) {
  const { redirectBaseUrl, userId = '', token = '', smViewId } = component.getModels();
  const [federatedLogin, { customer, cart }, loading, error] = useFederatedLogin();
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search);
  const { setCartId } = useContext(LoginContext);
  
  useEffect(() => {
    if (!DEBUG_MODE && token) {
      handleLogin(token, userId);
    }
  }, [token]);

  const handleLogin = async (token: string, userId: string) => {
    if (!token) {
      return;
    }
    const { customer, cart } = (await federatedLogin({
      token,
      userId,
    })) ?? {};

    if (customer) {
      setCartId?.(cart?.id);
      let pathname = page!.getUrl(query.get('destination') ?? '/');
      const offset = pathname.indexOf('?');
      pathname = offset < 0 ? pathname : pathname.substring(0, offset);
      history.push(page!.getUrl(pathname));
    }
  };

  const redirectToFederatedLogin = () => {
    const curUrl = encodeURIComponent(`${window.location.href}?destination=/`);
    window.location.href = `${redirectBaseUrl}?redirectURL=${curUrl}`; // Redirect to EXTERNAL login URL
  }

  if (!DEBUG_MODE && !token) {
    redirectToFederatedLogin();
    return null;
  }

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!token) {
      redirectToFederatedLogin();
      return;
    }
    handleLogin(token, userId);
  };

  if (loading) {
    return (
      <div className="row justify-content-center text-center mb-5">Logging in, please wait...</div>
    );
  }

  if (error) {
    return <div className="alert alert-danger" role="alert">{error.message}</div>;
  }

  return (
    <div className="row justify-content-center text-center mb-5">
      <form onSubmit={handleOnSubmit}>
        <div className="form-group">
          <label>Redirect URL</label>
          <input type='text' className="form-control" name="redirectUrl" value={redirectBaseUrl} readOnly />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input type='text' className="form-control" name="username" value={userId} readOnly />
        </div>
        <div className="form-group">
          <label>Token</label>
          <input type='token' className="form-control" name="token" value={token} readOnly />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
