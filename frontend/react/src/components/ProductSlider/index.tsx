import React from "react";
import Slider from "react-slick";
import { Link } from 'react-router-dom';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrManageContentButton, BrProps } from "@bloomreach/react-sdk";
import './ProductSlider.scss';
import { useProductDetail } from "@bloomreach/connector-components-react";

interface SlideProps {
    slide: any;
};

interface SliderParameters {
    arrows?: boolean;
    autoplay?: boolean;
    autoplaySpeed?: number;
    dots?: boolean;
    dotsStyle?: string;
    fade?: boolean;
    infinite?: boolean;
    pauseOnDotsHover?: boolean;
    pauseOnFocus?: boolean;
    pauseOnHover?: boolean;
    rows?: number;
    slidesPerRow?: number;
    slidesToScroll?: number;
    slidesToShow?: number;
    vertical?: boolean;
}

export const ProductSlider = ({ component, page }: BrProps) => {
    // Get Component Parameters
    const {
        arrows,
        autoplay,
        autoplaySpeed,
        dots,
        dotsStyle,
        fade,
        infinite,
        pauseOnDotsHover,
        pauseOnFocus,
        pauseOnHover,
        rows,
        slidesPerRow,
        slidesToScroll,
        slidesToShow,
        vertical,
    } = component.getParameters<SliderParameters>();

    // Get Slides Document
    const { document: documentRef } = component.getModels();
    const document = documentRef && page.getContent(documentRef);

    if (!document && page.isPreview()) {
        return <div style={{position: 'relative'}}>
            <h3>No Document</h3>
            <BrManageContentButton
                documentTemplateQuery="new-slider-document"
                folderTemplateQuery="new-slider-folder"
                parameter="document"
                relative
            />
        </div>;
    } else if (!document) {
        return null;
    }

    const { products } = document?.getData();
    const settings = {
        arrows,
        autoplay,
        autoplaySpeed,
        dots,
        fade,
        infinite,
        pauseOnDotsHover,
        pauseOnFocus,
        pauseOnHover,
        rows,
        slidesPerRow,
        slidesToScroll,
        slidesToShow,
        speed: 1000,
        vertical,
    };

    return (
        <section className={`container product-slider ${page.isPreview() ? 'has-edit-button' : ''}`}>
            <BrManageContentButton
                content={document}
                documentTemplateQuery="new-slider-document"
                folderTemplateQuery="new-slider-folder"
                parameter="document"
                relative
            />
            <h2>Feature Products</h2>
            <Slider className={`dots-${dotsStyle}`} {...settings}>
                {products.map((product: SlideProps, key: number) => (
                    <Slide slide={product} key={key} />
                ))}
            </Slider>
        </section>
    );
}


const Slide = ({slide}: SlideProps) => {
    const {
        productPicker
    } = slide;

    const itemId = productPicker.split(';')[0].split('id=')[1];

    const [item, loading, error] = useProductDetail({
        itemId,
        connector: 'brsm',
    });

    if (!item) {
        return null;
    }

    return (
        <div className='slide'>
            <Link to={`/p/${itemId}`}>
                {item?.imageSet?.original?.link?.href && <img src={item?.imageSet?.original?.link?.href} alt='product' /> }
            </Link>
        </div>
    );
}
