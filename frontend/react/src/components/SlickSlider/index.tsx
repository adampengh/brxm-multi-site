import React from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrManageContentButton, BrPageContext, BrProps } from "@bloomreach/react-sdk";
import { ImageSet } from '@bloomreach/spa-sdk';
import './SlickSlider.scss';

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

export const SlickSlider = ({ component, page }: BrProps) => {
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

    const { slide } = document?.getData();
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
        <section className={`${page.isPreview() ? 'has-edit-button' : ''}`}>
            <BrManageContentButton
                content={document}
                documentTemplateQuery="new-slider-document"
                folderTemplateQuery="new-slider-folder"
                parameter="document"
                relative
            />
            <Slider className={`dots-${dotsStyle}`} {...settings}>
                {slide.map((slide: SlideProps, key: number) => (
                    <Slide slide={slide} key={key} />
                ))}
            </Slider>
        </section>
    );
}


const Slide = ({slide}: SlideProps) => {
    const page = React.useContext(BrPageContext);
    const {
        image,
        text,
    } = slide;

    if (!image) {
        return null;
    }

    const {
        altText,
        desktopImage: desktopImageRef,
        mobileImage: mobileImageRef,
    } = image;

    const desktopImage = desktopImageRef && page?.getContent<ImageSet>(desktopImageRef);
    const mobileImage = mobileImageRef && page?.getContent<ImageSet>(mobileImageRef);

    return (
        <div className='slide'>
            <div className='slide__img'>
                { mobileImage && <img className='mobile-image' src={mobileImage.getOriginal()?.getUrl()} alt={altText} /> }
                { desktopImage && <img className='desktop-image' src={desktopImage.getOriginal()?.getUrl()} alt={altText} /> }
            </div>
            {text && <div className='slide__text' dangerouslySetInnerHTML={{__html: text.value}} /> }
        </div>
    );
}
