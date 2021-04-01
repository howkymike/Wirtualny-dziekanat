import React from 'react';
import styled from 'styled-components';

const MainHeader = styled.header` 
    text-align: center;
    padding: 2em;
`;


const Header = props => {
    return(
        <MainHeader>
            <h2>
                WIRTUALNY DZIEKANAT
            </h2>
        </MainHeader>
    )
}

export default Header;