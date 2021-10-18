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

import React, { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { BrPageContext, BrProps } from '@bloomreach/react-sdk';
import { useLogout } from '@bloomreach/connector-components-react';
import LoginContext from './LoginContext';

export function FederatedLoginIndicator({ component }: BrProps) {
  const history = useHistory();
  const page = useContext(BrPageContext);
  const [logout, loading, error] = useLogout();
  const { signoutRedirectBaseUrl, changePasswordRedirectBaseUrl } = component.getModels();
  const { user, setCartId } = useContext(LoginContext);

  const handleChangePassword = async () => {
    const curUrl = encodeURIComponent(`${window.location.href}`);
    window.location.href = `${changePasswordRedirectBaseUrl}?redirectURL=${curUrl}`;
  }

  const handleLogout = async () => {
    const success = await logout();
    if (!success) {
      return;
    }

    sessionStorage.removeItem('token');
    if (setCartId) {
      setCartId(undefined);
    }
    if (signoutRedirectBaseUrl) {
      // just invoke the external commerce storefront logout URL as well to clear up the states there, too.
      try {
        await fetch(signoutRedirectBaseUrl, {
          method: 'GET',
          credentials: 'include',
        });
      } catch (e) {
        // ignore error such as CORS as there's no need to read the response.
      }
    }
    history.push(page!.getUrl('/'));
  }

  if (error) {
    throw error;
  }

  return (
    <>
      {user?.currentCustomer ?
        <Dropdown>
          <Dropdown.Toggle id="dropdownMenuLink" variant="secondary">
            Welcome {user.currentCustomer.firstName} {user.currentCustomer.lastName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href={page!.getUrl("/account/profile")}>My profile</Dropdown.Item>
            {changePasswordRedirectBaseUrl &&
            <Dropdown.Item as="button" onSelect={handleChangePassword}>Change password</Dropdown.Item>
            }
            <Dropdown.Item href={page!.getUrl("/account/addresses")}>My addresses</Dropdown.Item>
            <Dropdown.Item as="button" onSelect={handleLogout}>Log out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        :
        <Link to={page!.getUrl('/signin')} className="navbar-brand">Login</Link>
      }
    </>
  );
}
