import { useRouteMatch } from "react-router";
import styled from "styled-components"

const Wrapper = styled.div`
    width: 30em;
    padding: 1em;
    border-radius: 10px;
    background-color: #F5F3F5;
    color: #303030;
    margin: auto;
    text-align: center;
`

const PageNotFound = props => {

    const {path, url} = useRouteMatch();

    return(
        <Wrapper>
            <h3>404 not found</h3>
        </Wrapper>
    );
}



export default PageNotFound;




