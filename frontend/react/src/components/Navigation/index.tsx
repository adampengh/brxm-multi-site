/*
 * Copyright 2019-2020 Hippo B.V. (http://www.onehippo.com)
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

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MenuItem, Menu, TYPE_LINK_EXTERNAL, isMenu, ImageSet, Document } from '@bloomreach/spa-sdk';
import { BrComponentContext, BrManageMenuButton, BrManageContentButton, BrPageContext } from '@bloomreach/react-sdk';
import { ReactComponent as MenuIcon } from '../../assets/icons/menu.svg';
import { ReactComponent as CloseIcon } from '../../assets/icons/close.svg';
import { ReactComponent as ArrowDownIcon } from '../../assets/icons/arrow-down.svg';

import './Navigation.scss';

interface MenuLinkProps {
  item: MenuItem;
}

export function Navigation() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        const header = document.getElementById('header');

        if (header) {
            setHeaderHeight(header?.offsetHeight || 0);
        }

        window.addEventListener('resize', () => setHeaderHeight(header?.offsetHeight || 0));
        return () => {
            window.addEventListener('resize', () => setHeaderHeight(header?.offsetHeight || 0));
        };
    }, [setHeaderHeight]);

    const component = React.useContext(BrComponentContext);
    const page = React.useContext(BrPageContext);
    const menuRef = component?.getModels<MenuModels>()?.menu;
    const menu = menuRef && page?.getContent<Menu>(menuRef);

    // Get the MenuItemBanners Model
    const menuItemBanners = component?.getModels<any>()?.MenuItemBanners;

    useEffect(() => {
        document.body.setAttribute('data-menu-open', String(menuOpen));
    });

    const setMenuStatus = (menuOpen: any) => {
        document.body.setAttribute('data-menu-open', String(menuOpen));
        setMenuOpen(menuOpen);
    }

    if (!menu) {
        return null;
    }

    if (!isMenu(menu)) {
        return null;
    }

    return (
        <nav className="header__nav" role="navigation" data-menu-open={menuOpen}>
            <div className='header__menu-toggle'>
                <button onClick={() => setMenuStatus(!menuOpen)}>
                    { menuOpen ? <CloseIcon /> : <MenuIcon /> }
                </button>
            </div>

            <ul className={`navigation ${page!.isPreview() ? 'has-edit-button' : ''}`} data-menu-open={menuOpen} style={{ 'top': headerHeight + 'px'}}>
                <BrManageMenuButton menu={menu} />
                { menu.getItems().map((item, index) => {
                    // Check if there is a corresponding MenuItemBanner for the top-level category
                    if (menuItemBanners[item.getName()]) {
                        return (
                            <MegaMenu item={item} key={index} category={item.getName()} bannerRef={menuItemBanners[item.getName()]} />
                        )
                    } else {
                        return(
                            <MegaMenu item={item} key={index} category={item.getName()} />
                        )
                    }
                })}
            </ul>
        </nav>
    );
}


const MegaMenu = ({ item, bannerRef }: any) => {
    const [showSecondLevel, setShowSecondLevel] = useState(false);
    return(
        <li
            className={`navigation__item ${item.isSelected() ? 'active' : ''}`}
            onClick={() => setShowSecondLevel(!showSecondLevel)}
            data-show-second-level={showSecondLevel}
        >
            <div className="navigation__link">
                <NavigationLink item={item} />
                <ArrowDownIcon />
            </div>
            { item.getChildren().length !== 0 &&
                <div className='mega-menu' data-show-menu={showSecondLevel}>
                    <button className='back-button' onClick={() => setShowSecondLevel(false)}>&lt;&nbsp;Back</button>
                    <ul className='columns'>
                        { item.getChildren().map((item: any, index: number) => (
                            <li className='column' key={index}>
                                <Column item={item} />
                            </li>
                        )) }
                        { bannerRef !== undefined && <NavigationBanner bannerRef={ bannerRef } /> }
                    </ul>
                </div>
            }
        </li>
    );
}


const Column = ({ item }: any) => {
  return (
    <>
      { item.getChildren().map((item: any, index: number) => (
        <SecondLevelMenu item={item} key={index} />
      ))}
    </>
  )
}


const SecondLevelMenu = ({ item }: any) => {
    const [accordionOpen, setAccordionOpen] = React.useState(false);

    const setAccordionStatus = (e: any) => {
        e.stopPropagation();
        setAccordionOpen(!accordionOpen);
    }

    const ColumnHeading = () => {
        if (item.getLink()) {
            return (
                <h2 data-accordion-open={accordionOpen}>
                    <Link to={item.getUrl()}>{item.getName()}</Link>
                </h2>
            );
        }

        return <h2 data-accordion-open={accordionOpen}>{ item.getName() }</h2>;
    }

    return (
        <div className="second-level">
            <div
                className='second-level__heading'
                data-accordion-open={accordionOpen}
                onClick={(e) => setAccordionStatus(e)}
            >
                <ColumnHeading />
                <span className="second-level__icon">
                    <ArrowDownIcon />
                </span>
            </div>

            <ul className='second-level__list' data-accordion-open={accordionOpen}>
                { item.getChildren().map((item: any, index: number) => (
                    <li className='second-level__item' key={index}>
                        <NavigationLink item={item} />
                    </li>
                ))}
            </ul>
        </div>
    )
}


const NavigationLink = ({ item }: MenuLinkProps) => {
    const url = item?.getUrl()?.replace('/index', '');

    if (!url) {
      return <span className="navigation-link disabled">{item.getName()}</span>;
    }

    if (item.getLink()?.type === TYPE_LINK_EXTERNAL) {
      return <Link to={url} className="navigation-link">{item.getName()}</Link>;
    }

    return <Link to={url} className="navigation-link">{item.getName()}</Link>;
}



const NavigationBanner = ({ bannerRef }: any) => {
    const page = useContext(BrPageContext);
    const banner = bannerRef && page?.getContent<Document>(bannerRef);

    if (!banner) {
        return null;
    }

    const {
        heading,
        imageCompound,
        link,
    } = banner.getData();

    const Image = ({ image }: any) => {
        const { altText, desktopImage } = image;
        const desktopImg = desktopImage && page?.getContent<ImageSet>(desktopImage);

        if (link) {
            return (
                <Link to={link}>
                    { desktopImg && <img src={desktopImg?.getOriginal()?.getUrl()} alt={altText} />}
                </Link>
            )
        }

        return (
            <span>
                { desktopImg && <img src={desktopImg?.getOriginal()?.getUrl()} alt={altText} />}
            </span>
        )
    }

    return (
        <li className='column navigation-banner'>
            <BrManageContentButton content={banner} />
            { heading && <h2>{ heading }</h2> }
            <div className={`navigation-banner__img ${imageCompound.length === 2 ? 'double' : ''}`}>
                { imageCompound && imageCompound.map((image: any, index: any) => <Image image={image} key={index} /> )}
            </div>
        </li>
    )
}
