import React, { useContext } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';

import { userContext } from '../context/userContext';
import AdminNav from './Navs/AdminNav';
import StudentNav from './Navs/StudentNav';
import ClerkNav from './Navs/ClerkNav';
import LecturerNav from './Navs/LecturerNav';
import Link from './Link';


const NavPanel = styled.nav` 
    grid-area: nav;
    background-color: #1f2124;
    padding: 1em 0;
    font-size: 0.9em;
    box-shadow: 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12), 0 5px 5px -3px rgba(0, 0, 0, .20);
`;

const Menu = styled.ul` 
    list-style-type: none;
    margin: 0;
    padding: 0;
`;

export const Fa = styled(FontAwesomeIcon)` 
    margin: 0 0.5em;
`;

const User = styled.div` 
    color: #fff;
    text-align: center;
    padding: 1em;

    h6 {
        margin: 0.5em 0;
    }
`;

const Nav = () => {

    const { username, logout, roles } = useContext(userContext);
    
    return(
        <NavPanel>
            <User>
                <FontAwesomeIcon icon={faUser} size="7x"></FontAwesomeIcon>
                <h6>Witaj, {username }</h6>
            </User>
            
            <Menu>
                {   
                    roles[0] && roles[0] === "ROLE_ADMIN" && <AdminNav />
                }
                {   
                    roles[0] && roles[0] === "ROLE_STUDENT" && <StudentNav />
                }
                {   
                    roles[0] && roles[0] === "ROLE_CLERK" && <ClerkNav />
                }
                                {   
                    roles[0] && roles[0] === "ROLE_LECTURER" && <LecturerNav />
                }
                <Link to="/" onClick={ () => logout() }>
                    <Fa icon={faSignOutAlt} />Wyloguj
                </Link>
            </Menu>
        </NavPanel>
    )
}

export default Nav;