import React from "react";
import { BrManageContentButton, BrProps } from "@bloomreach/react-sdk";

import './FlexibleGrid.scss';


export const FlexibleGrid = ({ component, page }: BrProps) => {
    const { document: documentRef } = component.getModels();
    const document = documentRef && page.getContent(documentRef);

    if (!document) {
        return null;
    }

    console.log(document.getData());

    const {
        flexibleGridItem
    } = document.getData();

    return (
        <section className={`container flexible-grid`}>
            <BrManageContentButton
                content={document}
                relative
            />
            { flexibleGridItem.map((item: any, index: number) => (
               <FlexibleGridItem item={item} key={index} />
            ))}
        </section>
    );
}


const FlexibleGridItem = ({ item }: any) => {
    console.log('item', item);
    return (
        <a className='flexible-grid__item' href={item.link}>
            <div className='flexible-grid__item-img'>
                <img src={item.imageUrl} alt="placeholder" />
            </div>
            <p className='flexible-grid__item-link'>{ item.linkText }</p>
        </a>
    )
}
