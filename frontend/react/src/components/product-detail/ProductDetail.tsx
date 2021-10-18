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
import { useCookies } from 'react-cookie';
import { BrComponent, BrProps } from '@bloomreach/react-sdk';
import { ItemFragment, ItemVariantFragment, useProductDetail } from '@bloomreach/connector-components-react';
import { AddToCartButton } from '../cart/AddToCart';
import { getSmViewId, getConnector } from '../../utils';
import LoginContext from '../login/LoginContext';


export function ProductDetail({ page, component }: BrProps) {
    let { productCode, productVariantCode } = component.getParameters();
    if (!productCode) {
        productCode = 'RDB322';
    }

    const connector = getConnector(page);
    const smViewId = getSmViewId(page);
    const [cookies] = useCookies(['_br_uid_2']);
    const [selectedVariant, setSelectedVariant] = useState<ItemFragment | ItemVariantFragment | undefined>();
    const [variants, setVariants] = useState<ItemVariantFragment[] | undefined>();
    const { cartId } = useContext(LoginContext);
    // const history = useHistory();

    const customAttrFields = ['brand', 'thumb_image'];
    const customVariantAttrFields = ['sku_thumb_images', 'sku_swatch_images'];

    const [item, loading, error] = useProductDetail({
        connector,
        customAttrFields,
        customVariantAttrFields,
        smViewId,
        itemId: `${productCode}___${productCode}`,
        brUid2: cookies._br_uid_2,
    });

    useEffect(() => {
        function notEmpty<T>(value: T | null | undefined): value is T {
            return !!value;
        }

        if (!item) {
            return;
        }

        let variants: ItemVariantFragment[] | undefined = undefined;
        if (item.variants) {
            variants = item.variants.filter(notEmpty);
        }
        setVariants(variants);
        if (productVariantCode) {
            selectVariant(productVariantCode);
        } else {
            setSelectedVariant(variants?.[0] ?? item);
        }
    }, [item]); // eslint-disable-line react-hooks/exhaustive-deps

    const selectVariant = (variantId: string) => {
        const selectedVariant = item?.variants?.find((variant) => `${variant?.itemId.id}___${variant?.itemId.code}` === variantId);
        if (selectedVariant) {
            setSelectedVariant(selectedVariant);
        }
    }

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <div className="alert alert-danger" role="alert">{error.message}</div>;
    }

    if (!item) {
        return null;
    }

    if (!selectedVariant || !selectedVariant.itemId) {
        return null;
    }

    const image = { src: '', alt: '' };
    if (selectedVariant?.imageSet?.original?.link?.href) {
        image.src = selectedVariant?.imageSet.original.link.href.replace('?$Listing$', '');
        image.alt = selectedVariant?.displayName ?? item!.displayName ?? '';
    } else {
        image.src = item!.imageSet?.original?.link?.href ?? '';
        image.alt = item!.displayName ?? '';
    }

    return (
        <div className="product-detail container mt-5">
            <div className="product-detail__top row">
                <div className="product-detail__left col-md-6 p-4">
                    <img
                        className="img-responsive image-detail"
                        style={{ maxWidth: '100%' }}
                        src={image.src}
                        alt={image.alt}
                    />
                </div>

                <div className="product-detail__right col-md-6">
                    <span className="h4">{item?.displayName}</span>
                    <div className="mt-3" dangerouslySetInnerHTML={{ __html: (selectedVariant?.description || item!.description) ?? '' }} />

                    {variants && variants.length > 1 &&
                        <select
                            className="custom-select mb-3"
                            id="variantSelection"
                            value={`${selectedVariant?.itemId.id}___${selectedVariant?.itemId.id}`}
                            onChange={(event) => selectVariant(event.target.value)}
                        >
                        {variants.map((variant, index) => (
                            <option key={index} value={`${variant.itemId.id}___${variant.itemId.id}`}>{variant.displayName}</option>
                        ))}
                        </select>
                    }

                    {selectedVariant?.listPrice?.moneyAmounts &&
                        <div className="h4 mt-3">${selectedVariant?.listPrice?.moneyAmounts[0]?.displayValue}</div>
                    }

                    { selectedVariant?.itemId && <AddToCartButton cartId={cartId} itemId={selectedVariant?.itemId} /> }
                </div>
            </div>

        </div>
    );
}
