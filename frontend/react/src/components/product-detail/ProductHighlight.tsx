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
import { Carousel, Spinner } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { BrProps } from '@bloomreach/react-sdk';
import { useProductDetail, ProductDetailInputProps, ItemIdModel } from '@bloomreach/connector-components-react';
import { ProductLink } from './ProductLink';
import { AddToCartButton } from '../cart/AddToCart';
import { getConnector, getSmViewId } from '../../utils';

import './ProductHighlight.css';
import LoginContext from '../login/LoginContext';

interface ProductModel {
  itemId: ItemIdModel;
}
interface ProductModels {
  products?: ProductModel[];
}

export function ProductHighlight(props: BrProps) {
  const { component, page } = props;

  const {
    interval,
    cycle,
    showNavigation,
    pause,
    carouselHeight,
    carouselWidth,
    carouselBackgroundColor,
  } = component.getParameters();

  const { products } = props.component.getModels<ProductModels>();
  const connector = getConnector(page);
  const smViewId = getSmViewId(page);
  const [cookies] = useCookies(['_br_uid_2']);

  if (!products || products.length <= 0) {
    return null;
  }

  return (
    <Carousel
      controls={!!showNavigation}
      interval={interval ? parseInt(interval, 10) : 5000}
      wrap={!!cycle}
      pause={pause ? 'hover' : false}
      className="mb-3 qa-product-carousel"
    >
      {products.map((product, index) => (
        <Carousel.Item
          key={index}
          style={{ height: `${carouselHeight}px`, backgroundColor: `${carouselBackgroundColor}` }}
        >
          <CarouselItem
            itemId={product.itemId}
            connector={connector}
            smViewId={smViewId}
            brUid2={cookies._br_uid_2}
            {...props}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

function CarouselItem({ itemId, brUid2, connector, smViewId }: ProductDetailInputProps) {
  const { cartId } = useContext(LoginContext);
  const [item, loading, error] = useProductDetail({ itemId, connector, brUid2, smViewId });

  if (loading) {
    return <Carousel.Caption><Spinner animation="border" /></Carousel.Caption>;
  }

  if (error) {
    return <Carousel.Caption><div className="alert alert-danger" role="alert">{error.message}</div></Carousel.Caption>;
  }

  if (!item) {
    return <Carousel.Caption>Product Not Found</Carousel.Caption>;
  }

  return (
    <>
      <img
        className="img-responsive image-detail"
        src={item.imageSet?.original?.link?.href ?? ''}
        alt={item.displayName ?? ''}
      />
      <Carousel.Caption>
        <ProductLink item={item}>
          <h3>{item.displayName}</h3>
        </ProductLink>

        <div className="h4 mb-none">
          {item.listPrice?.moneyAmounts?.[0]?.displayValue}
        </div>

        <AddToCartButton cartId={cartId} itemId={item.itemId} />
      </Carousel.Caption>
    </>
  )
}
