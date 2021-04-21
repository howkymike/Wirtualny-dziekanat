// @ts-nocheck
import React, { useContext } from 'react';
import styled from 'styled-components';

import { userContext } from '../context/userContext';
import AdminNav from './AdminNav';
import StudentNav from './StudentNav';
import Link from './Link';

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

const Nav = props => {

    const { username, logout, roles } = useContext(userContext);
    
    return(
        <NavPanel>
            <h3>Witaj, {username }</h3>
            <Menu>
                {   
                    roles[0] && roles[0] === "ROLE_ADMIN" && <AdminNav />
                }
                {   
                    roles[0] && roles[0] === "ROLE_STUDENT" && <StudentNav />
                }
                <Link to="/changeactualpassword">Zmien haslo</Link>
                <Link to="/" onClick={ () => logout() }>
                    Wyloguj
                </Link>
            </Menu>
        </NavPanel>
    )
}

export default Nav;