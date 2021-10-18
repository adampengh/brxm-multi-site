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

import React, { useContext, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { AddToCartInputProps, AddToCartParams, AttributeInput, useAddToCart } from '@bloomreach/connector-components-react';
import { BrPageContext } from '@bloomreach/react-sdk';
import LoginContext from '../login/LoginContext';
import { getDefaultConnector } from '../../utils';

export function AddToCartButton({ itemId, cartId, quantity }: AddToCartParams & AddToCartInputProps) {
  const { setCartId } = useContext(LoginContext);
  const [customAttrs, setCustomAttrs] = useState<AttributeInput[]>([]);
  const [addToCart, result, loading, error] = useAddToCart({ cartId });
  const page = useContext(BrPageContext);
  const connector = getDefaultConnector(page!);

  const handleOnClick = async () => {
    await addToCart({ itemId, quantity, customAttrs });
  };

  const handleAddCustomAttr = () => {
    const attrs = [...customAttrs];
    attrs.push({ name: '', values: [] });
    setCustomAttrs(attrs);
  };

  const handleDeleteCustomAttr = (index: number) => {
    const attrs = [...customAttrs];
    attrs.splice(index, 1);
    setCustomAttrs(attrs);
  };

  const handleCustomAttrNameChange = (name: string, index: number) => {
    const attrs = [...customAttrs];
    attrs[index].name = name;
    setCustomAttrs(attrs);
  };

  const handleCustomAttrValueChange = (value: string, index: number) => {
    const attrs = [...customAttrs];
    attrs[index].values = [value];
    setCustomAttrs(attrs);
  };

  useEffect(() => {
    if (result?.cart && setCartId) {
      setCartId(result.cart.id);
    }
  }, [result, setCartId]);

  return (
    <div>
      {loading ?
        <Spinner animation="border" />
        :
        <button type="button" className="btn btn-primary text-capitalize qa-add-to-cart mt-5" onClick={handleOnClick}>
          Add to cart
        </button>
      }
      {connector === 'shopify' &&
        <div>
          <label className="form-label">Custom Attributes</label>
          {customAttrs.map((attr, index) => (
            <div key={index} className="input-group mb-3">
              <input type="text" className="form-control mr-3" placeholder="Name" aria-label="Name" value={attr.name ?? ''} onChange={(e) => handleCustomAttrNameChange(e.target.value, index)} />
              <input type="text" className="form-control mr-3" placeholder="Value" aria-label="Value" value={attr.values?.[0] ?? ''} onChange={(e) => handleCustomAttrValueChange(e.target.value, index)} />
              <button type="button" className="btn btn-danger" onClick={() => handleDeleteCustomAttr(index)}>
                <i className="fa fa-times" aria-hidden="true" />
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={handleAddCustomAttr}>Add</button>
        </div>
      }
      {result?.success && <p className="small text-success">{result.message}</p>}
      {error && <p className="small text-danger">{error.message}</p>}
    </div>
  );
}
