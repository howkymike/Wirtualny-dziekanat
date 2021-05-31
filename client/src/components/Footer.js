import React from 'react';
import styled from 'styled-components';

const MainFooter = styled.footer`  
    text-align: center;
    grid-area: footer;
    line-height: 3em;
`;

const Footer = () => {
    return(
        <MainFooter>
            Wirtaulni dziekani &copy; Wirtualny Dziekanat
        </MainFooter>
    )
}

export default Footer;