import React, { useContext } from 'react';
import styled from 'styled-components';
import { userContext } from '../context/userContext';

const MainHeader = styled.header` 
    grid-area: header;
    background-color: #fff;
    color: #000;
    text-align: center;
    line-height: 4rem;
    font-size: 1.5em;
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0 rgba(0, 0, 0, .12), 0 3px 5px -1px rgba(0, 0, 0, .20);
    position: relative;
`;


const Header = () => {
    const { header } = useContext(userContext);

    return(
        <MainHeader>
            { header }
        </MainHeader>
    )
}

export default Header;