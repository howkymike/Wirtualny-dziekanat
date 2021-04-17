import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { Button } from "reactstrap";
import styled, { keyframes } from "styled-components";


const showAnimation = keyframes`
    from{
        opacity: 0;
    }

    to{
        opacity: 1;
    }
`

const MessageBoxContainer = styled.div`
    position: absolute;
    left:0;
    top:0;
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    background: rgba(12,12,12,0.5);
    animation: ${showAnimation} 300ms ease;
`

const MessageBoxWindow = styled.div`
    position: relative;
    padding: 10px 15px 10px 15px;
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 400px;
    border-radius: 10px;

    background-color: #F5F3F5;
    color: #303030;
`

const ButtonContainer = styled.div`
    width: 100%;
    display: flex;
`

const StyledButton = styled(Button)`
    margin: 10px 20px 5px 20px;
`

const Message = styled.p`
    padding: 1em;
`

const MessageBoxHeader = styled.div`
    display: flex;
    flex-direction: row-reverse;
    width: 100%;
`

const MessageBox = props => {
    const cancelBtnText = props.cancelBtnText ?? "Cancel";
    const okBtnText = props.okBtnText ?? "Ok";

    return (
        <MessageBoxContainer onClick={props.onReject}>
            <MessageBoxWindow onClick={e => e.stopPropagation()}>
                <MessageBoxHeader>
                    <Button close onClick={props.onReject}>
                        <span aria-hidden>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </Button>
                </MessageBoxHeader>

                <Message>{props.children}</Message>

                <ButtonContainer>
                    <StyledButton block color="primary" onClick={props.onAccept}>
                        {okBtnText}
                    </StyledButton>
                    <StyledButton block color="danger" onClick={props.onReject}>
                        {cancelBtnText}
                    </StyledButton>
                </ButtonContainer>
            </MessageBoxWindow>
        </MessageBoxContainer>
    );
}

export default MessageBox;
