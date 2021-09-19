import React from 'react';
import { Link } from 'react-router-dom';
import { BrComponent, BrPageContext } from '@bloomreach/react-sdk';
import { Menu } from '../Menu';

export const Header = () => {
    return (
        <header>
            <nav className="navbar navbar-expand-sm navbar-dark sticky-top bg-dark" role="navigation">
                <div className="container">
                    <BrPageContext.Consumer>
                        { page => (
                            <Link to={page!.getUrl('/')} className="navbar-brand">
                            { page!.getTitle() || 'brXM + React = ♥️'}
                            </Link>
                        ) }
                    </BrPageContext.Consumer>
                    <div className="collapse navbar-collapse">
                        <BrComponent path="menu">
                            <Menu />
                        </BrComponent>
                    </div>
                </div>
            </nav>
        </header>
    );
}
