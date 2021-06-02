import styled from 'styled-components';
import { Modal as ModalBS } from 'reactstrap';

const Wrapper = styled.div`
    margin: 2em;
    background-color: #fff;
    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12), 0 2px 4px -1px rgba(0, 0, 0, .20);
    border-bottom: 0.5em solid #2c3e50;
`;

export const Header = styled.div` 
    background-color: #2c3e50;
    color: #fff;
    padding: 0.5em;
    text-align: left;
`;

export const Padding = styled.div` 
    padding: 1em;
`;

export const Input = styled.input` 
    width: 100%;
    margin-bottom: 1em;
    height: 2.5em;
    border-radius: 0;
    border: 0;
    border-bottom: 0.25em solid #bdc3c7;
    outline: 0;
    background-color: #fff;
    padding: 0 1em;

    &:focus {
        border: 0;
        border-bottom: 0.25em solid #2384e6;
    }
`;

export const Submit = styled.input`
    width: 100%;
    margin-bottom: 1em;
    height: 2.5em;
    border-radius: 0;
    border: 0;
    outline: 0;
    background-color: #fff;
    padding: 0 1em; 
    background-color: #bdc3c7;
    margin: 1em 0;
`;

export const Button = styled.button` 
    width: 90%;
    height: 2.5em;
    border-radius: 0;
    border: 0;
    outline: 0;
    background-color: #fff;
    padding: 0 1em; 
    background-color: #bdc3c7;
    margin: 1em auto;
    display: block;
`;

export const Modal = styled(ModalBS)` 
    border-bottom: 0.5em solid #2c3e50;

    .modal-content {
        border-radius: 0;
    }
`;

export  const InputGroup = styled.div` 
    position: relative;

    .append {
        position: absolute;
        top: 0;
        right: 0;
    }
`;

export default Wrapper;