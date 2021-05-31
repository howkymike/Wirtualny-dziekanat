import { useState, useEffect, useContext, useReducer } from 'react'

import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import { userContext } from '../../context/userContext'

import UserTab from './UserTab'
import StudentTab from './StudentTab';
import LecturerTab from './LecturerTab';
import ClerkTab from './ClerkTab';
import styled from 'styled-components';

import {
    Button, ModalBody, ModalFooter, ModalHeader, Nav, NavLink,
    NavItem, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    TabContent, TabPane, Alert, Row, Col, Container
} from "reactstrap";

import { Modal } from '../Wrapper';

const StyledTabContent = styled(TabContent)`
    margin: 20px 10px 20px 10px;
`

const StyledButton = styled(Button)`
    margin: 5px 10px 15px 10px;
`

const initialState = {
    user: {
        name: "", surname: "", email: "", telephone: "",
        country: "", city: "", postalCode: "", address: "",
        roles: []
    }, tabs: ["User"], activeTab: "User",
    allRoles: [], isLoading: true, message: [],
    error: {}
};

const reducer = (state, { type, data }) => {
    switch (type) {
        case "user":
        case "allRoles":
        case "activeTab":
        case "isLoading":
        case "message":
            return { ...state, [type]: data };
        case "lecturer": case "student": case "clerk":
        case "name": case "surname": case "roles":
        case "email": case "telephone":
        case "country": case "city":
        case "address": case "postalCode":
            return { ...state, user: { ...state.user, [type]: data } };
        case "tabs":
            return { ...state, tabs: ["User", ...data] };
        case 'error':
            return { ...state, error: { ...state.error, ...data } };
        case "initial":
            return initialState;
        default:
            return state;
    }
}

const EditUserModal = props => {

    const { userId, isOpen, onClose, onUserSave } = props;
    const { fetchApi } = useContext(userContext);

    const [addRoleDropdownOpen, setAddRoleDropdownOpen] = useState(false);
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {

        if(!isOpen) return;

        fetchApi("/roles")
            .then(res => {
                if (res[0].roles) {
                    dispatch({ type: "allRoles", data: res[0].roles });
                }
            });

        fetchApi(`/users/user/${userId}`)
            .then((res) => {
                if (res[1]) {
                    dispatch({ type: 'user', data: res[0] });
                    dispatch({ type: 'isLoading', data: false });
                }
            });
    }, [isOpen, userId, fetchApi]);

    useEffect(() => {
        if (state.isLoading) return;

        let tabs = [];
        state.user.roles.forEach((role) => {
            if (role === "ROLE_ADMIN")
                return;
            let newTab = role[5].toUpperCase() + role.substring(6).toLowerCase();
            tabs.push(newTab);
        });

        dispatch({ type: "tabs", data: tabs });
    }, [state.user, state.user.roles, state.isLoading]);


    const onUserUpdate = async () => {
        for (const err in state.error) {
            if (state.error[err]) {
                dispatch({ type: "message", data: ["danger", "Niepopraeni wypełniony form"] });
                return;
            }
        }

        const [res, isOk] = await fetchApi(`/users/${state.user.id}`, {
            method: "PUT",
            body: JSON.stringify(state.user)
        })

        if (isOk) {
            dispatch({ type: "message", data: ["success", res.message] });
            onUserSave();
        } else {
            dispatch({ type: "message", data: ["danger", res.message] });
        }
    };

    const addNewRole = (role) => {
        let roles = state.user.roles.slice();
        roles.push(role);

        switch (role) {
            case "ROLE_ADMIN": break;
            case "ROLE_STUDENT": dispatch({ type: 'student', data: { index: "" } }); break;
            case "ROLE_LECTURER": dispatch({ type: 'lecturer', data: {} }); break;
            case "ROLE_CLERK": dispatch({ type: 'clerk', data: {} }); break;
            default: return;
        }

        let tab = role[5].toUpperCase() + role.substring(6).toLowerCase()

        dispatch({ type: "roles", data: roles });

        if (role !== "ROLE_ADMIN")
            dispatch({ type: "activeTab", data: tab });
    }

    const renderTab = tab => {
        switch (tab) {
            case "User":
                return <UserTab state={state} dispatch={dispatch} />
            case "Student":
                return state.user.student && <StudentTab state={state} dispatch={dispatch} />
            case "Lecturer":
                return state.user.lecturer && <LecturerTab state={state} dispatch={dispatch} />
            case "Clerk":
                return state.user.clerk && <ClerkTab state={state} dispatch={dispatch} />
            default: return "";
        }
    }

    if (state.isLoading || !isOpen) {
        return null;
    }

    return (
        <Modal isOpen={props.isOpen}>
            <ModalHeader>
                Edytowanie użytkownika
            </ModalHeader>
            <ModalBody>

                {/* Tab navigation */}
                <Nav tabs>
                    {/* Render tabs */}
                    {state.tabs.map((tab, key) =>
                    (<NavItem key={key}>
                        <NavLink
                            className={classnames({ active: state.activeTab === tab })}
                            onClick={() => dispatch({ type: "activeTab", data: tab })}
                        >
                            {tab}
                        </NavLink>

                    </NavItem>)
                    )}

                    {/* Add role button */}
                    {(state.user.roles.length < state.allRoles.length) &&
                        <NavItem>
                            <ButtonDropdown
                                isOpen={addRoleDropdownOpen}
                                toggle={() => setAddRoleDropdownOpen(!addRoleDropdownOpen)}
                            >
                                <DropdownToggle color={"link"} >
                                    <FontAwesomeIcon icon={faPlus} />
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem header>Dodaj nową rolę</DropdownItem>
                                    {state.allRoles.map((role, key) => (
                                        !state.user.roles.includes(role) &&
                                        <DropdownItem key={key} onClick={() => addNewRole(role)}>
                                            {role[5] + role.substring(6).toLowerCase()}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </ButtonDropdown>
                        </NavItem>}
                </Nav>

                {/* Tabs contents */}
                <StyledTabContent activeTab={state.activeTab}>
                    {state.tabs.map((tab, key) => (
                        <TabPane key={key} tabId={tab}>
                            {renderTab(tab)}
                        </TabPane>
                    ))}
                </StyledTabContent>

            </ModalBody>
            <ModalFooter>
                <Container>
                    <Row>
                        <Col sm="12" md={{ size: 6, offset: 3 }}>
                            <StyledButton color="danger" onClick={() => { dispatch({ type: "initial" }); onClose(); }}>Zamknij</StyledButton>
                            <StyledButton color="primary" onClick={() => onUserUpdate()}>Zapisz</StyledButton>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Alert
                                isOpen={state.message[1] !== undefined}
                                color={state.message[0]}
                                toggle={() => dispatch({ type: "message", data: [] })}
                            >
                                {state.message[1]}
                            </Alert>
                        </Col>
                    </Row>
                </Container>
            </ModalFooter>
        </Modal>
    );

};

export default EditUserModal;
