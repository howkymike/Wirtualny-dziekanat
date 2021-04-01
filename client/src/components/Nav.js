// @ts-nocheck
import React, { useContext } from 'react';
import PropsTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from "react-router-dom";

import { userContext } from '../context/userContext';

const NavPanel = styled.nav` 
    background: #1D4350; 
    background: -webkit-linear-gradient(to bottom, #A43931, #1D4350);  
    background: linear-gradient(to bottom, #A43931, #1D4350); 


    color: #fff;

    box-shadow: 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12), 0 5px 5px -3px rgba(0, 0, 0, .20);

    width: 20em;
    height: 100vh;
    padding: 1em;
    text-align: center;
`;

const Menu = styled.ul` 
    margin: 0;
    padding: 2em 0;
    list-style-type: none;

    a {
        color: #fff;

        &:hover {
            text-decoration: none;
        }
    }
`;

const MenuOption = styled.li`
    display: block;
    padding: 0.5em 0;
    border-bottom: 1px solid #fff;

    background-color: ${props => props.selected ? "#fff" : ""};
    color: ${props => props.selected ? "#000" : "#fff"};

    &:hover {
        background-color: #d9d9d9;
        color: #000;
    }
`;

MenuOption.propTypes = {
    selected: PropsTypes.bool
}

const Nav = props => {

    const { username, logout } = useContext(userContext);

    return(
        <NavPanel>
            <h3>Witaj, {username }</h3>
            <Menu>
                <Link to="/student">
                    <MenuOption selected>
                        Strona główna
                    </MenuOption>
                </Link>
                <Link to="/student">
                    <MenuOption>
                        Strona główna
                    </MenuOption>
                </Link>
                <Link to="/student">
                    <MenuOption>
                        Strona główna
                    </MenuOption>
                </Link>
                <Link to="/student">
                    <MenuOption>
                        Strona główna
                    </MenuOption>
                </Link>
                <Link to="/" onClick={ () => logout() }>
                    <MenuOption>
                        Wyloguj
                    </MenuOption>
                </Link>
            </Menu>
        </NavPanel>
    )
}

export default Nav;