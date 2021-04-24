import React from 'react';
import styled from 'styled-components';

const Button = styled.div`
    padding: 0.5em;
    text-align: center;
    background: #FF0099;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #493240, #FF0099);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #493240, #FF0099); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    color: #fff;
    cursor: pointer;
    margin: 1em;
`;

const GradientButton = ({children, ...props}) => {
    return(
        <Button {...props}>
            {children}
        </Button>
    );
}

export default GradientButton;
