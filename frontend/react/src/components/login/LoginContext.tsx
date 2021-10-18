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

import React, { useState, useEffect, useContext } from 'react';
import { CommerceConnectorContext, CurrentCustomerResult, useCurrentCustomer } from '@bloomreach/connector-components-react';
import { getCartIdFromSession, setCartIdInSession } from '../../utils';

interface ContextProps {
  loading: boolean;
  user?: CurrentCustomerResult;
  cartId?: string;
  setCartId?: (cartId?: string) => void;
}

const LoginContext = React.createContext<ContextProps>({ loading: false });
export const LoginConsumer = LoginContext.Consumer;
export function LoginProvider(props: React.PropsWithChildren<unknown>) {
  const [user, loading, error] = useCurrentCustomer();
  const [cartId, setCartId] = useState(getCartIdFromSession());
  const { currentToken } = useContext(CommerceConnectorContext);
  useEffect(() => {
    setCartIdInSession(cartId);
  }, [cartId]);

  useEffect(() => {
    if (currentToken) {
      sessionStorage.setItem('token', currentToken);
    } else {
      sessionStorage.removeItem('token');
    }
  }, [currentToken]);

  if (error) {
    throw error;
  }
  
  return (
    <LoginContext.Provider
      value={{
        loading,
        user,
        cartId,
        setCartId,
      }}
    >
      {props.children}
    </LoginContext.Provider>
  );
}

export default LoginContext;
