import React from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";

const H = styled.h1` 
    text-align: center;
    color: #fff;
`;

const P = styled.p` 
    text-align: center;

    a {
        box-shadow:0px 5px 20px #607382;
        min-width:170px;
        padding:17px 20px;
        border-radius:30px;
        background-color:#878dde;
        border:0;
        margin:5px 5px 0 5px;
        display:inline-block;
        font-weight:300;
        color: #fff;
        margin: 1em;
    }

    a:hover {
        text-decoration: none;
        color: #fff;
    }
`;

const Home = () => {
    return(
        <>
            <H>WIRTUALNY DZIEKANAT</H>
            <P>
                <Link to="/login"><i className="fas fa-sign-in-alt"></i> Zaloguj</Link>
            </P>
        </>
    );
}

export default Home;