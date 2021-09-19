import React from 'react';
import { BrComponent } from '@bloomreach/react-sdk';

export const Footer = () => {
    return(
        <footer className="bg-dark text-light py-3">
            <div className="container clearfix">
                <div className="float-left pr-3">&copy;{new Date().getFullYear()} Bloomreach</div>
                <div className="overflow-hidden">
                    <BrComponent path="footer" />
                </div>
            </div>
        </footer>
    );
}

