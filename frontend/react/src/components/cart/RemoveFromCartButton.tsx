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

import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useRemoveFromCart } from '@bloomreach/connector-components-react';

interface RemoveFromCartButtonProps {
  cartId: string;
  entryId: string;
}

export function RemoveFromCartButton({ cartId, entryId }: RemoveFromCartButtonProps) {
  const [removeFromCart, result, loading, error] = useRemoveFromCart({ cartId });

  const handleOnClick = async () => {
    await removeFromCart({ entryId });
  };

  return (
    <>
      {loading ?
        <Spinner animation="border" />
        :
        <button type="button" className="btn btn-danger qa-delete-product-cart" onClick={handleOnClick}>
          <i className="fa fa-trash" aria-hidden="true" />
        </button>
      }
      {error && <p className="small alert alert-danger" role="alert">{error.message}</p>}
    </>
  );
}
