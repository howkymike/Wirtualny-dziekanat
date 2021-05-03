import { useState, useEffect, useContext } from 'react'

import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import { userContext } from '../../context/userContext'

import UserTab from './UserTab'
import StudentTab from './StudentTab';
import LecturerTab from './LecturerTab';
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

const EditUserModal = props => {

    const { userId } = props;
    const { fetchApi } = useContext(userContext);

    const [roles, setRoles] = useState([]);
    const [newUserData, setNewUserData] = useState({ roles: [] });

    const [activeTab, setActiveTab] = useState("User");
    const [roleTabs, setRoleTabs] = useState(["User"]);
    const [addRoleDropdownOpen, setAddRoleDropdownOpen] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");


    useEffect(() => {
        fetchApi("/roles")
            .then(res => {
                if (res[0].roles) {
                    setRoles(res[0].roles);
                }
            });

        fetchApi(`/users/user/${userId}`)
            .then((res) => {
                if (res[1]) {
                    setNewUserData(res[0]);
                }
            });
    }, [userId, fetchApi]);

    useEffect(() => {
        let tabs = roleTabs.slice();

        newUserData.roles.forEach((role) => {
            let newTab = role[5].toUpperCase() + role.substring(6).toLowerCase();

            if (!tabs.find(tab => tab === newTab)) {
                tabs.push(newTab);
            }
        });
        setRoleTabs(tabs);
    }, [newUserData, roles]);


    const onUserUpdate = async () => {

        const [res, isOk] = await fetchApi(`/users/${newUserData.id}`, {
            method: "PUT",
            body: JSON.stringify(newUserData)
        })

        if (isOk) {
            setMessageType("success");
        } else {
            setMessageType("danger");
        }

        setMessage(res.message);

        console.log(res);
    };

    const addNewRole = (role) => {
        let roles = newUserData.roles.slice();
        roles.push(role);

        let newRole;

        switch (role) {
            case "ROLE_ADMIN":  break;
            case "ROLE_STUDENT": newRole = { student: {} }; break;
            case "ROLE_LECTURER": newRole = { lecturer: {} }; break;
            case "ROLE_CLERK": newRole = { clerk: {} }; break;
            default: return;
        }

        setNewUserData({ ...newUserData, ...newRole, roles: roles });
    }

    const renderTab = tab => {
        switch (tab) {
            case "User":
                return <UserTab user={newUserData} onUserChange={user => setNewUserData(user)} />
            case "Student":
                return <StudentTab user={newUserData} onUserChange={user => setNewUserData(user)} />
            case "Lecturer":
                return <LecturerTab user={newUserData} onUserChange={user => setNewUserData(user)} />
            case "Clerk":
                return "Not implemented"
            case "Admin":
                return "Not implemented"
            default: return "";
        }
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
                    {roleTabs.map((tab, key) =>
                    (<NavItem key={key}>
                        <NavLink
                            className={classnames({ active: activeTab === tab })}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </NavLink>
                    </NavItem>)
                    )}

                    {/* Add role button */}
                    {(newUserData.roles.length < roles.length) &&
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
                                    {roles.map((role, key) => (
                                        !newUserData.roles.includes(role) &&
                                        <DropdownItem key={key} onClick={() => addNewRole(role)}>
                                            {role[5] + role.substring(6).toLowerCase()}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </ButtonDropdown>
                        </NavItem>}
                </Nav>

                {/* Tabs contents */}
                <StyledTabContent activeTab={activeTab}>
                    {roleTabs.map((tab, key) => (
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
                            <StyledButton color="danger" onClick={() => props.onClose()}>Cancel</StyledButton>
                            <StyledButton color="primary" onClick={() => onUserUpdate()}>Save</StyledButton>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Alert isOpen={message !== ""} color={messageType} toggle={() => setMessage("")}>{message}</Alert>
                        </Col>
                    </Row>
                </Container>
            </ModalFooter>
        </Modal>
    );

};

export default EditUserModal;
