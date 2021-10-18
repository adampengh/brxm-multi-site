/*
 * Copyright 2019 Hippo B.V. (http://www.onehippo.com)
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

import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { BrComponent, BrProps } from '@bloomreach/react-sdk';
import { FacetFieldFilterInput, useProductGridSearch } from '@bloomreach/connector-components-react';
import ProductCard from './ProductCard';
import { getConnector, getSmViewId } from '../../utils';
import FacetList from './FacetList';
import * as queryString from 'query-string';

export function ProductGridSearch(props: BrProps) {
  const { page, component } = props;
  let { pageSize } = component.getParameters();
  const showFacets = true;
  const connector = getConnector(page);
  const smViewId = getSmViewId(page);
  const [sortFields, ] = useState('');
  const [facetFieldFilters, setFacetFieldFilters] = useState<FacetFieldFilterInput[]>();
  const [cookies] = useCookies(['_br_uid_2']);
  const customAttrFields = ['brand', 'thumb_image'];
  const customVariantAttrFields = ['sku_thumb_images', 'sku_swatch_images'];

  const queryParams = queryString.parse(window.location.search);
  const query = queryParams['q'] as string || '';

  pageSize = pageSize || 30;

  const [, itemsPageResult, loading, error ] = useProductGridSearch({
    connector,
    customAttrFields,
    customVariantAttrFields,
    facetFieldFilters,
    pageSize,
    sortFields,
    smViewId,
    searchText: query,
    brUid2: cookies._br_uid_2,
  });

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div className="alert alert-danger" role="alert">{error.message}</div>;
  }

  if (!itemsPageResult) {
    return null;
  }

  const { items, facetResult } = itemsPageResult;

  if (!items || !items.length) {
    return (
      <>
        <div className="container mt-4">
          <h1 className="h2">We couldn't find any results for "{query}"</h1>
          <BrComponent path="BrNoSearchResults" />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="container mt-4">
          <h1 className="h2">Search Results for <span style={{ textTransform: 'capitalize' }}>"{query}"</span></h1>
          <div className="row qa-product-grid-search mt-4">
            {showFacets && (
              <div className="col-3">
                <FacetList
                  facets={facetResult ?? undefined}
                  facetFieldFilters={facetFieldFilters}
                  setFacetFieldFilters={setFacetFieldFilters} />
              </div>
            )}
            <div className='col-9'>
              <div className="row">

                <div className="product-grid">
                    {items.filter(Boolean).map((item, index) => (
                      <ProductCard item={item} key={index} />
                    ))}
                </div>
                {/* <div className="col-sm-12 mb-3 text-center">
                  {offset + limit < total ? (
                    <button className="btn btn-primary text-capitalize" onClick={onLoadMore}>
                      Load More
                    </button>
                  ) : null}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }


}
