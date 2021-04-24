import React from 'react';
import styled from 'styled-components';

const Input = styled.input` 
    height: 2em;
`;

const Editable = ({value, editable, onChange}) => {
    return(
        <>
            { editable ?
                <Input value={value} onChange={onChange}/> :
                <span>{value}</span>
            }
        </>
    )
}

export default Editable;