import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

const CenterBox = styled.div` 
    width: 34em;
    margin: auto;
    padding: 1em;
    display: flex;

    a {
        color: #fff;
    }

    a:hover {
        text-decoration: none;
        color: #d9d9d9;
    }
`;

const Box = styled.div` 
    width: 15em;
    height: 15em;
    background: #1D4350; 
    background: -webkit-linear-gradient(to bottom, #A43931, #1D4350);  
    background: linear-gradient(to bottom, #A43931, #1D4350); 
    margin: 0.5em;
    text-align: center;
    padding: 1em;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12), 0 2px 4px -1px rgba(0, 0, 0, .20);
`;

const Home = props => {
    return(
        <div>
            <CenterBox>
                <Link to="/login">
                    <Box>
                        <Fa icon={faUserGraduate} size="4x" />
                        <p>Zaloguj jako student</p>
                    </Box>
                </Link>
                <Link to="login">
                    <Box>
                        <Fa icon={faChalkboardTeacher} size="4x" />
                        <p>Zaloguj jako wykładowca</p>
                    </Box>
                </Link>
            </CenterBox>
        </div>
    );
}

export default Home;