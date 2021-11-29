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

import React, { useContext, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet';
import { BrPageContext, BrProps } from '@bloomreach/react-sdk';
import {
  ProductGridCategoryInputProps,
  useProductGridCategory,
  useCategory,
  CategoryInputProps,
  FacetFieldFilterInput,
} from '@bloomreach/connector-components-react';
import { Link } from 'react-router-dom';
import { getConnector, getSmViewId } from '../../utils';
import FacetList from './FacetList';
import ProductCard from './ProductCard';
import './ProductListing.scss';

export function ProductGridCategory({ page, component }: BrProps) {
  let {
    pageSize,
    categoryId = ''
  } = component.getParameters();


  const connector = getConnector(page);
  const smViewId = getSmViewId(page);
  const [cookies] = useCookies(['_br_uid_2']);

  return (
    <div className="container">
      <CategoryDetail
        categoryId={categoryId}
        connector={connector}
        smViewId={smViewId}
        brUid2={cookies._br_uid_2}
      />
      <ProductGridCategoryHandler
        categoryId={categoryId}
        connector={connector}
        pageSize={(pageSize as unknown) as number || 9}
        smViewId={smViewId}
        brUid2={cookies._br_uid_2}
      />
    </div>
  )
}

interface FilteredCategoryInputProps extends CategoryInputProps {
  filteredCategoryContentRef?: any
}

function CategoryDetail({ categoryId, connector, smViewId, brUid2, filteredCategoryContentRef }: FilteredCategoryInputProps) {
  const page = useContext(BrPageContext);
  const [error, ] = useState<Error>();
  const [category, loading, catError] = useCategory({ categoryId, connector, smViewId, brUid2 });

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (!category) {
    return null;
  }

  if (catError) {
    return <div className="alert alert-danger" role="alert">{catError.message}</div>;
  }

  if (error) {
    return <div className="alert alert-danger" role="alert">{error.message}</div>;
  }

  const document = page?.getContent(filteredCategoryContentRef);

  const {
    canonicalUrl,
    h1,
    image,
    metaDescription,
    metaKeywords,
    pageTitle,
    robots,
    url
  } = document?.getData<any>() || {};



  return (
    <>
      <Helmet>
        { pageTitle && <title>{ pageTitle }</title> }
        { metaDescription && <meta name="description" content={ metaDescription } /> }
        { metaKeywords && <meta name="keywords" content={ metaKeywords } /> }
        { canonicalUrl && <link rel="canonical" href={ canonicalUrl } /> }
        { url && <link rel="og:url" href={ url } /> }
        { image && <meta name="og:image" content={ image } /> }
        { robots && <meta name="robots" content={ robots } /> }
      </Helmet>

      <div className="row qa-category-detail mt-2">
        <div className="col-md-12 mb-4">
          <p className="small">
            {/* <CategoryBreadCrumb
              categoryId={categoryId}
              connector={connector}
              smViewId={smViewId}
              brUid2={brUid2}
              setError={setError}
            /> */}
          </p>
        </div>
        <div className="col-md-12 mb-4">
          <h2>{h1 || category.displayName}</h2>
        </div>
      </div>
    </>
  );
}

interface CategoryBreadCrumbProps extends CategoryInputProps {
  setError: React.Dispatch<React.SetStateAction<Error | undefined>>;
}

function CategoryBreadCrumb({ categoryId, connector, smViewId, brUid2, setError }: CategoryBreadCrumbProps) {
  const page = useContext(BrPageContext);
  const [category, loading, error] = useCategory({
    categoryId,
    connector,
    smViewId,
    brUid2
  });

  useEffect(() => {
    setError(error);
  }, [error, setError]);

  if (loading) {
    return <>...</>;
  }

  if (!category) {
    return null;
  }

  return (
    <>
      {category.parentId &&
        <>
          <CategoryBreadCrumb
            categoryId={category.parentId}
            connector={connector}
            smViewId={smViewId}
            brUid2={brUid2}
            setError={setError}
          />
          &nbsp;/&nbsp;
        </>
      }
      <Link to={page!.getUrl(`/categories/${category.id}`)}>{category.displayName}</Link>
    </>
  );
}

interface FilteredProductGridCategoryInputProps extends ProductGridCategoryInputProps {
  filteredCategoryContentRef?: any;
}
function ProductGridCategoryHandler(props: FilteredProductGridCategoryInputProps) {
  const {
    categoryId,
    brUid2,
    connector,
    smViewId,
  } = props;
  const [sortFields, ] = useState('');
  const [facetFieldFilters, setFacetFieldFilters] = useState<FacetFieldFilterInput[]>();

  const pageSize = 30;
  const [, itemsPageResult, loading, error] = useProductGridCategory({
    categoryId,
    brUid2,
    connector,
    smViewId,
    pageSize,
    sortFields,
    facetFieldFilters,
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
    return <div className="alert alert-info" role="alert">No products found</div>;
  }

  return (
    <>
      <div className="row qa-product-grid-category">
        <div className="col-3">
          <FacetList
            facets={facetResult ?? undefined}
            facetFieldFilters={facetFieldFilters}
            setFacetFieldFilters={setFacetFieldFilters} />
        </div>

        <div className='col-9'>
          <div className='row'>
            <div className="product-grid">
              {items.filter(Boolean).map((item, index) => (
                <ProductCard item={item} key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
