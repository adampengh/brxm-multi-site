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

import React, { Dispatch, FormEvent, SetStateAction, useContext, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { BrPageContext, BrProps } from '@bloomreach/react-sdk';
import {
  ItemLikeFragment,
  ProductSearchSuggestionInputProps,
  useProductSearchSuggestion
} from '@bloomreach/connector-components-react';
import { useHistory } from 'react-router-dom';
import { ProductLink } from './ProductLink';
import { getConnector } from '../../utils';

export function ProductSearch({ page }: BrProps){
  const history = useHistory();
  const connector = getConnector(page);
  const[keyword, setKeyword] = useState<string>('');
  const[hideSuggestions, setHideSuggestions] = useState<boolean>(false);

  const handleInputChange = (value: string) => {
    setKeyword(value);
  }

  const handleOnSubmit = (event : FormEvent) => {
    event.preventDefault();
    if(keyword) {
      history.push(page!.getUrl(`/search?_sq=${keyword}`))
    }
    setKeyword('');
  }

  if (hideSuggestions) {
    setKeyword('');
    setHideSuggestions(false);
  }
  return (
      <form onSubmit={handleOnSubmit} autoComplete="off">
        <div className="collapse navbar-collapse autocomplete">
          <input type="text" className="form-control" id="productSearch" placeholder="Search products" value={keyword} onChange={(event) => handleInputChange(event.target.value)}/>
          {keyword &&
            <ProductSuggestion connector={connector} text={keyword} setHideSuggestions={setHideSuggestions} />
          }
        </div>
      </form>
  );
}

interface SuggestionsProps extends ProductSearchSuggestionInputProps {
  setHideSuggestions: Dispatch<SetStateAction<boolean>>;
}

function ProductSuggestion({ text, connector, setHideSuggestions }: SuggestionsProps){
  const page = useContext(BrPageContext);
  const history = useHistory();
  const [result, loading, error] = useProductSearchSuggestion({ text, connector });

  const hideSuggestion = () => {
    setHideSuggestions(true);
  }

  const handleClick = (term : string | null) => {
    history.push(page!.getUrl(`/search?_sq=${term}`))
    hideSuggestion();
  }

  const { terms, items } = result ?? {};

  return (
    <div className="autocomplete-items">
      {loading && <Spinner animation="border" />}
      {error && <p className="text-danger small">{error.message}</p>}
      {terms?.filter(Boolean).map((term, index) => (
        <div key={index} onClick={() => handleClick(term)}>{term}</div>
      ))}
      {items?.filter(Boolean).map((item, index) => (
        <div key={index} onClick={() => hideSuggestion()}>
          <ProductLink item={item as ItemLikeFragment}>
            {item?.displayName}
          </ProductLink>
        </div>
      ))}
    </div>
  );
}