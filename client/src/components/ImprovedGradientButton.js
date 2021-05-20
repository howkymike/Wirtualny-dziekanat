import React from 'react'
import styled, { keyframes } from 'styled-components'

const fade = keyframes`
    0%{background-position:0% 100%}
    50%{background-position:93% 0%}
    100%{background-position:0% 100%}
`

const Button = styled.div`
    padding: 0.5em;
    text-align: center;
    color: #fff;

    border-radius: 5px;

    background: linear-gradient(229deg, #832ed9, #2a57e8, #7599f8, #2a57e8, #832ed9);
    background-size: 400% 400%;
    animation: ${fade} 15s ease infinite;
    
    transition: background 1s ease-in-out;

    &::selection{
        background:transparent;
    }

    &:hover{
        cursor: pointer;
        background: linear-gradient(229deg, #8822ff, #3b68f9, #86aaf9, #3b68f9, #8822ff);
        background-size: 400% 400%;
        animation: ${fade} 30s ease infinite;
    }
`

const ImprovedGradientButton = ({ children, ...props }) => {

    return (
        <Button {...props}>
            {children}
        </Button>
    );
};

export default ImprovedGradientButton;