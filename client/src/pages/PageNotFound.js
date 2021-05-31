import styled from "styled-components"
import Wrapperd from '../components/Wrapper';
import { Link } from 'react-router-dom';

const Wrapper = styled(Wrapperd)`
    width: 30em;
    margin: auto;
    text-align: center;
    padding: 2em;
`;

const PageNotFound = () => {
    return(
        <Wrapper>
            <h3>404 Nie znaleziono</h3>
            <Link to="/">Powrót na stronę główną</Link>
        </Wrapper>
    );
}



export default PageNotFound;




