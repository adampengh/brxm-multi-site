import React from 'react';
import { ProductLink } from '../product-detail/ProductLink';
import { ItemFragment } from '@bloomreach/connector-components-react';
const CurrencyFormat = require('react-currency-format');

const ProductCard = ({item}: any) => {

    const displayPrice = (item: ItemFragment) => {
        const listPrice = item.listPrice?.moneyAmounts?.[0];
        if (listPrice) {
            return (
                <div className="mb-2 d-block">
                    <CurrencyFormat
                        value={listPrice.amount}
                        displayType={'text'}
                        thousandSeparator={true}
                        decimalSeparator={'.'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        prefix={'$'} />
                </div>
            );
        }
        return null;
    };

    return(
        <div className="product-grid__item">
            <ProductLink item={item!}>
                {item?.imageSet?.original?.link?.href && (
                    <img className="img-thumbnail mb-3" src={`${item?.imageSet?.original?.link?.href}?$Collection$`} alt={item?.displayName ?? ''} />
                )}
            </ProductLink>
            <div className="mb-2">
                <ProductLink item={item!}>
                    <span className="product-title">{item?.displayName}</span>
                </ProductLink>
            </div>
            {displayPrice(item!)}
            {/* {item?.description && <p className="mb-3" dangerouslySetInnerHTML={{ __html: item.description }} />} */}
            <a href="/quickview" className="product-quickview">Quick View</a>
        </div>
    );
}

export default ProductCard;
