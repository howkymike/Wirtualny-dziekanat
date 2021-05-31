import React from 'react';
import styled from 'styled-components';

const LogoComponent = styled.div`
    grid-area: logo;
    background-color: #1f2124;
    color: #fff;

    div {
        text-align: center;
        height: 50%;
        line-height: 2em;
    }

    div:last-child {
        background: rgb(16,59,102);
        background: linear-gradient(90deg, rgba(16,59,102,1) 0%, rgba(16,59,102,1) 8%, rgba(35,132,230,1) 100%); 
    }
`;

const Logo = () => {
    return(
        <LogoComponent>
            <div>WIRTUALNY</div>
            <div>DZIEKANAT</div>
        </LogoComponent>
    );
}

export default Logo;