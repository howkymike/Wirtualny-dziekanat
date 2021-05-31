import React from 'react';
import PropsTypes from 'prop-types';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom'

const MenuOption = styled.li`
    a {
        color: #fff;
        padding: 2em 0.5em;
        display: block;
        border-left:  ${props => props.selected ? "0.5em solid rgba(35,132,230,1)" : "0 solid transparent"};
        transition: 0.3s border-left-width ease-in-out;
    }

    a:hover {
        background-color: #18191b;
        color: #fff;
        text-decoration: none;
        border-left: 0.5em solid  ${props => props.selected ? "rgba(35,132,230,1)" : "transparent"};
    }
`;

MenuOption.propTypes = {
    selected: PropsTypes.bool
}

const LinkComponent = ({to, children, onClick}) => {

    const location = useLocation();

    return(
        <MenuOption selected={ location.pathname === to }>
            <Link to={to} onClick={ onClick }>
                {children}
            </Link>
        </MenuOption>
    );
}

LinkComponent.propTypes = {
    to: PropsTypes.string,
    children: PropsTypes.node,
    onClick: PropsTypes.func
}

export default LinkComponent;
