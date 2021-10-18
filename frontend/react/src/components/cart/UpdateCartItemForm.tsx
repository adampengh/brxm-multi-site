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
import { AttributeInput, CartFragment_entries, useUpdateCartItem } from '@bloomreach/connector-components-react';
import { BrPageContext } from '@bloomreach/react-sdk';
import { getDefaultConnector } from '../../utils';

interface UpdateCartItemProps {
  cartId: string;
  entry: CartFragment_entries;
}

export function UpdateCartItemForm({ cartId, entry }: UpdateCartItemProps) {
  const [quantity, setQuantity] = useState(entry.quantity);
  const [customAttrs, setCustomAttrs] = useState<AttributeInput[]>((entry.customAttrs ?? []).map((attr) => {
    const values = attr.values?.map((value) => value ?? '');
    return { name: attr.name, values };
  }));
  const [updateCart, result, loading, error] = useUpdateCartItem({ cartId });
  const page = useContext(BrPageContext);
  const connector = getDefaultConnector(page!);

  useEffect(() => {
    setQuantity(entry.quantity);
  }, [entry.quantity]);

  const handleOnClick = async () => {
    await updateCart({
      quantity,
      customAttrs,
      entryId: entry.id,
    });
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

  return (
    <>
      <form>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Quantity</span>
          </div>
          <input type="number" className="form-control qa-update-quantity" min="1" aria-label="quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.currentTarget.value))}/>
          <div className="input-group-btn">
            {loading ?
              <Spinner animation="border" />
              :
              <button className="btn btn-primary qa-refresh-quantity-cart" type="button" onClick={handleOnClick}>
                <i className="fas fa-sync-alt" />
              </button>
            }
          </div>
        </div>
        {connector === 'shopify' &&
          <div className="mb-3">
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
      </form>
      {result?.success &&
        <div className="small alert alert-success" role="alert">
          {result.message}
        </div>
      }
      {error && <p className="small alert alert-danger" role="alert">{error.message}</p>}
    </>
  );
}
