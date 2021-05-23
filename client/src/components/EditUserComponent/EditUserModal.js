import { useState, useEffect, useContext, useCallback, useReducer } from 'react'

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
    Button, Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavLink,
    NavItem, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    TabContent, TabPane, Alert, Row, Col, Container
} from "reactstrap";

const StyledTabContent = styled(TabContent)`
    margin: 20px 10px 20px 10px;
`

const StyledButton = styled(Button)`
    margin: 5px 10px 15px 10px;
`

const initialState = {
    user: {}, tabs: ["User"], activeTab: "User",
    allRoles: [], isLoading: true, message: []
};

const reducer = (state, { type, data }) => {
    switch (type) {
        case "user":
        case "allRoles":
        case "activeTab":
        case "isLoading":
            return { ...state, [type]: data };
        case "lecturer":
        case "student":
        case "clerk":
        case "roles":
            return { ...state, user: { ...state.user, [type]: data } };
        case "tabs":
            return { ...state, tabs: ["User", ...data] };
        case "message":
            return { ...state, message: data };
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

    }, [userId, fetchApi]);

    useEffect(() => {
        if (state.isLoading) return;

        let tabs = [];
        state.user.roles.forEach((role) => {
            if(role === "ROLE_ADMIN") 
                return;
            let newTab = role[5].toUpperCase() + role.substring(6).toLowerCase();
            tabs.push(newTab);
        });

        dispatch({ type: "tabs", data: tabs });
    }, [state.user, state.user.roles, state.isLoading]);


    const onUserUpdate = async () => {
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
            case "ROLE_STUDENT": dispatch({ type: 'student', data: {} }); break;
            case "ROLE_LECTURER": dispatch({ type: 'lecturer', data: {} }); break;
            case "ROLE_CLERK": dispatch({ type: 'clerk', data: {} }); break;
            default: return;
        }

        let tab = role[5].toUpperCase() + role.substring(6).toLowerCase()

        dispatch({ type: "roles", data: roles });

        if(role !== "ROLE_ADMIN")
            dispatch({ type: "activeTab", data: tab });
    }

    const updateUser = useCallback((user) => {
        dispatch({ type: "user", data: user });
    }, []);

    const updateLecturer = useCallback((lecturer) => {
        dispatch({ type: "lecturer", data: lecturer });
    }, []);

    const updateClerk = useCallback((clerk) => {
        dispatch({ type: "clerk", data: clerk });
    }, []);

    const updateStudent = useCallback((student) => {
        dispatch({ type: "student", data: student });
    }, []);

    const renderTab = tab => {
        switch (tab) {
            case "User":
                return <UserTab user={state.user} onUserChange={updateUser} />
            case "Student":
                return <StudentTab user={state.user} onUserChange={updateStudent} />
            case "Lecturer":
                return <LecturerTab user={state.user} onUserChange={updateLecturer} />
            case "Clerk":
                return <ClerkTab user={state.user} onUserChange={updateClerk} />
            default: return "";
        }
    }

    if (state.isLoading || !isOpen) {
        return null;
    }

    return (
        <Modal isOpen={props.isOpen}>
            <ModalHeader>
                Editing User
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
                                    <DropdownItem header>Add new role</DropdownItem>
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
                            <StyledButton color="danger" onClick={() => { dispatch({ type: "initial" }); onClose(); }}>Close</StyledButton>
                            <StyledButton color="primary" onClick={() => onUserUpdate()}>Save</StyledButton>
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
