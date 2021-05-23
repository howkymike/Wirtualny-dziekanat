import React from 'react';
import styled from 'styled-components';

const ErrorDiv = styled.div` 
    background: linear-gradient(108deg, #e82941, #e89029, #852a2a);
    background-size: 600% 600%;
    padding: 1em;
    border-radius: 5px;

    animation: AnimationName 9s ease infinite;

    @keyframes AnimationName {
        0%{background-position:0% 50%}
        50%{background-position:100% 50%}
        100%{background-position:0% 50%}
    }
`;


const Error = props => {
    const [isError, message] = props.error;

    return(
        <>
        { isError &&
            <ErrorDiv>{ message }</ErrorDiv>
        }
        </>
    );
}

export default Error;