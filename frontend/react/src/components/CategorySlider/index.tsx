import React from "react";
import Slider from "react-slick";
import { Link } from 'react-router-dom';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrManageContentButton, BrPageContext, BrProps } from "@bloomreach/react-sdk";
import './CategorySlider.scss';

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

export const CategorySlider = ({ component, page }: BrProps) => {
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
    console.log('document', document?.getData());

    if (!document) {
        return <div style={{position: 'relative'}}>
            <h2>No Document</h2>
            <BrManageContentButton
                documentTemplateQuery="new-slider-document"
                folderTemplateQuery="new-slider-folder"
                parameter="document"
                relative
            />
        </div>;
    }

    const { categories } = document?.getData();
    console.log('categories', categories);
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
        <section className={`category-slider ${page.isPreview() ? 'has-edit-button' : ''}`}>
            <BrManageContentButton
                content={document}
                documentTemplateQuery="new-slider-document"
                folderTemplateQuery="new-slider-folder"
                parameter="document"
                relative
            />
            <Slider className={`dots-${dotsStyle}`} {...settings}>
                {categories.map((category: SlideProps, key: number) => (
                    <Slide slide={category} key={key} />
                ))}
            </Slider>
        </section>
    );
}


const Slide = ({slide}: SlideProps) => {
    console.log('slide', slide);
    const {
        connectorid,
        imageUrl,
        text,
    } = slide;

    if (!imageUrl) {
        return null;
    }

    return (
        <div className='slide'>
            <Link to={`/c/${connectorid}`}>
                <div className='slide__img'>
                    <img className='desktop-image' src={imageUrl} alt={text} />
                </div>
                {text && <p className='slide__text'>{ text }</p> }
            </Link>
        </div>
    );
}
