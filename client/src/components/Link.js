import React from 'react';
import PropsTypes from 'prop-types';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom'

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

const LinkComponent = ({to, children, onClick}) => {

    const location = useLocation();

    return(
        <Link to={to} onClick={ onClick }>
            <MenuOption selected={ location.pathname === to }>
                {children}
            </MenuOption>
        </Link>
    );
}

LinkComponent.propTypes = {
    to: PropsTypes.string,
    children: PropsTypes.node,
    onClick: PropsTypes.func
}

export default LinkComponent;
