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
import { BrPageContext } from '@bloomreach/react-sdk';
import { useLogout } from '@bloomreach/connector-components-react';
import LoginContext from './LoginContext';

export function LoginIndicator() {
  const history = useHistory();
  const page = useContext(BrPageContext);
  const [logout, loading, error] = useLogout();
  const { user, setCartId } = useContext(LoginContext);
  
  const handleLogout = async () => {
    const success = await logout();
    if (!success) {
      return;
    }

    if (setCartId) {
      setCartId(undefined);
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
            <Dropdown.Item as="div"><Link className="btn" to={page!.getUrl("/account/profile")}>My profile</Link></Dropdown.Item>
            <Dropdown.Item as="div"><Link className="btn" to={page!.getUrl("/account/addresses")}>My addresses</Link></Dropdown.Item>
            <Dropdown.Item as="div"><Link className="btn" to={page!.getUrl("/orders")}>My orders</Link></Dropdown.Item>
            <Dropdown.Item as="div"><button className="btn qa-logout" onClick={handleLogout}>Log out</button></Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        :
        <Link to={page!.getUrl('/signin')} className="navbar-brand">Login</Link>
      }
    </>
  );
}
