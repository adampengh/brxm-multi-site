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

import React, { useContext, useEffect } from 'react';
import { BrPageContext } from '@bloomreach/react-sdk';
import { useCart } from '@bloomreach/connector-components-react';
import { Link } from 'react-router-dom';
import LoginContext from '../login/LoginContext';

export function CartIndicator() {
  const page = useContext(BrPageContext);
  const { cartId, setCartId } = useContext(LoginContext);
  const [cart] = useCart({ cartId });
  useEffect(() => {
    if (cart && setCartId) {
      setCartId(cart.id);
    }
  }, [cart]);

  return (
    <Link to={page!.getUrl('/cart')} className="btn btn-primary qa-product-cart">
      {' Cart '}
      {cart?.totalQuantity ? <span className="badge badge-light">{cart.totalQuantity}</span> : null}
    </Link>
  );
}
