import React from 'react';
import { BrProps } from '@bloomreach/react-sdk';
import { BrManageContentButton } from '@bloomreach/react-sdk';
import { Container, Tabs, Tab } from 'react-bootstrap';

export function ProductDetailCustomContent({ page, component }: BrProps) {
    const models = component.getModels();
    const productDetailCustomContentRef = models.ProductDetailCustomContent;
    const productDetailCustomContent = page.getContent(productDetailCustomContentRef);

    if (!productDetailCustomContent) {
        return null;
    }

    // Get the document data
    const {
        productDetailCustomContentCompounds
    } = productDetailCustomContent.getData();

    return(
        <Container>
            <BrManageContentButton content={productDetailCustomContent} />
            <Tabs defaultActiveKey={productDetailCustomContentCompounds[0].tabLabel} id="uncontrolled-tab-example" className="mb-3">
                {productDetailCustomContentCompounds.map((compound: any, index: number) => (
                    <Tab eventKey={compound.tabLabel} title={compound.tabLabel} key={index} className="p-3">
                        <h3>{compound.tabLabel}</h3>
                        <div dangerouslySetInnerHTML={{ __html: compound.tabContent.value }} />
                    </Tab>
                ))}
            </Tabs>
        </Container>
    )
}
