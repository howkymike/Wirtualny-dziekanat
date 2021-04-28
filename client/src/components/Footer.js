import React from 'react';
import styled from 'styled-components';

const MainFooter = styled.footer`  
    padding: 2em;
    text-align: center;
`;

const Footer = () => {
    return(
        <MainFooter>
            Wirtaulni dziekani &copy; Wirtualny Dziekanat
        </MainFooter>
    )
}

export default Footer;