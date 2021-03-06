import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Table, Button, Badge, Alert, ModalBody, ModalFooter, ModalHeader, Container, Row, Col } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTimes, faUserEdit, faUserGraduate } from '@fortawesome/free-solid-svg-icons'
import EditUserModal from '../components/EditUserComponent/EditUserModal';
import Wrapperd from '../components/Wrapper';
import { Modal, Button as ButtonA } from '../components/Wrapper';

import { userContext } from '../context/userContext';

const StyledButton = styled(Button)`
    margin: 5px;
`
const RoleContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const Role = styled(Badge)`
    margin: 2px 0 2px 0;
`

const Select = styled.select` 
    background-color: #2c3e50;
    width: 100%;
    padding: 0.5em;
    border: none;
    color: #fff;
`;

export const Wrapper = Wrapperd;

const StudentList =  ({ semesterFilter = false }) => {

    let [semesterPicked, setSemesterPicked] = useState("-1");
    let [listType, setListType] = useState("student");
    let [loading, setLoading] = useState(true);
    let [list, setList] = useState([]);
    const [deleteMsg, setDeleteMsg] = useState(false);
    const [promoteMsg, setPromoteMsg] = useState(false);
    const [userToPromote, setUserToPromote] = useState(null);
    const [editUserId, setEditUserId] = useState(-1);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isOpenEditModal, toggleEditModal] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [error, setError] = useState([false, ""]);
    const [type, setType] = useState("edit");

    const { fetchApi, setHeader } = useContext(userContext);

    useEffect(() => {
        setHeader("Lista użytkowników");

        const fetchUsers = async () => {
            try {
                const [result, isOk] = await fetchApi("/users/" + listType + "/");

                if(isOk) {
                    setList(result.list);
                    setLoading(false);
                } else
                    setError([true, "Wystąpił błąd przy pobieraniu listy"]);
            } catch(e) {
                //console.log(e);
                setError([true, "Wystąpił błąd przy pobieraniu listy"]);
            }
        } 

        fetchUsers();
    }, [refresh, listType, fetchApi, setHeader]);

    const onUserDelete = (key) => {
        setUserToDelete(key);
        setDeleteMsg(true);
    };

    const onAcceptUserDelete = async () => {
        try {
            const user = list[userToDelete].user;

            const [, isOk] = await fetchApi("/users/" + user.id, {
                method: "DELETE",
            });
    
            if (isOk) {
                setList(list.filter(usr => usr.user.id !== user.id));
            } else {
                setError([true, "Wystapił błąd przy usuwaniu użytkownika"]);
            }
    
            setDeleteMsg(false)
        } catch(e) {
            setError([true, "Wystapił błąd przy usuwaniu użytkownika"]);
        }
    };

    const onUserPromote = (key) => {
        setError([false, ""]);
        setUserToPromote(key);
        setPromoteMsg(true);
    };

    const onAcceptUserPromote = async () => {
        try {
            const user = list[userToPromote].user;

            const [result, isOk] = await fetchApi("/student/" + user.id + "/promote", {
                method: "POST",
            });

            if (isOk) {
                setRefresh(!refresh);
            } else {
                setError([true, result.msg]);
            }

            setPromoteMsg(false)
        } catch(e) {
            setError([true, "Wystapił błąd przy promowaniu użytkownika na następny semestr"]);
        }
    };

    const getRoleName = (role) => {
        if (role.startsWith("ROLE_")) {
            return role[5].toUpperCase() + role.substring(6).toLowerCase();
        } else {
            return "";
        }
    }

    return (
        <Wrapper>
            {   semesterFilter &&
                <div>
                <Select value={semesterPicked} onChange={e => setSemesterPicked(e.target.value)}>
                    <option value="-1">Wszystkie semestry</option>
                    <option value="1">Pierwszy</option>
                    <option value="2">Drugi</option>
                    <option value="3">Trzeci</option>
                    <option value="4">Czwarty</option>
                    <option value="5">Piąty</option>
                    <option value="6">Szósty</option>
                    <option value="7">Siódmy</option>
                </Select>
                </div>
            }
            {   !semesterFilter &&
                <Select value={listType} onChange={e => setListType(e.target.value)}>
                    <option value="student">Studenci</option>
                    <option value="clerk">Pracownicy</option>
                    <option value="lecturer">Wykładowcy</option>
                </Select>
            }
            <Table striped borderless hover responsive>
                <thead>
                    <tr>
                        <th>Lp.</th>
                        <th>Imię</th>
                        <th>Nazwisko</th>
                        <th>Email</th>
                        <th>Role</th>
                        {listType === "student" &&
                            <th>Indeks</th> &&
                            <th>Semestr</th>
                        }
                        {listType === "lecturer" &&
                            <th>Tytuł</th>
                        }
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {loading &&
                        <tr>
                            <td colSpan="7">Ładowanie</td>
                        </tr>
                    }
                    {list.map((user, key) => (
                        (!semesterFilter || semesterPicked === "-1" || Number(semesterPicked) === user.semester) &&
                        <tr key={key}>
                            <td>{key + 1}</td>
                            <td>{user.user.name}</td>
                            <td>{user.user.surname}</td>
                            <td>{user.user.email}</td>
                            <td>
                                <RoleContainer>
                                    {user.user.roles.map((role, key) => (
                                        <Role key={key} color="primary">{getRoleName(role.name).toUpperCase()}</Role>
                                    ))}
                                </RoleContainer>
                            </td>
                            {   listType === "student" &&
                                <td>{user.index}</td> &&
                                <td>{user.semester}</td>
                            }
                            {   listType === "lecturer" &&
                                <td>{user.title}</td>
                            }
                            <td>
                                {listType === "student" && <StyledButton color="success"
                                              onClick={() => {onUserPromote(key)}}>
                                    <FontAwesomeIcon icon={faUserGraduate} />
                                </StyledButton> }
                                <StyledButton color="primary"
                                    onClick={() => {
                                        setEditUserId(user.id);
                                        toggleEditModal(true);
                                    }}>
                                    <FontAwesomeIcon icon={faUserEdit} />
                                </StyledButton>
                                <StyledButton color="danger" onClick={() => onUserDelete(key)}>
                                    <FontAwesomeIcon icon={faUserTimes} />
                                </StyledButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            
            <ButtonA onClick={ () => { setType("create"); toggleEditModal(true) } }>Nowy użytkownik</ButtonA>

            {
                error[0] && <Alert color={"danger"}>{ error[1] }</Alert>
            }

            {   deleteMsg &&
                <Modal isOpen={ deleteMsg }>
                    <ModalHeader>Usuwanie użytkownika</ModalHeader>
                    <ModalBody>
                        Czy napewno chcesz usunąć tego użytkownika?
                    </ModalBody>
                    <ModalFooter>
                        <Container>
                            <Row>
                                <Col sm="12" md={{ size: 3, offset: 3 }}>
                                    <Button block color="primary" onClick={() => onAcceptUserDelete() }>Tak</Button>
                                </Col>
                                <Col sm="12" md={{ size: 3 }}>
                                    <Button block color="danger" onClick={ () => setDeleteMsg(false) }>Nie</Button>
                                </Col>
                            </Row>
                        </Container>
                    </ModalFooter>
                </Modal>
            }

            {   promoteMsg &&
                <Modal isOpen={ promoteMsg }>
                    <ModalHeader>Promowanie studenta</ModalHeader>
                    <ModalBody>
                        Czy napewno chcesz promować tego użytkownika na następny semestr?
                    </ModalBody>
                    <ModalFooter>
                        <Container>
                            <Row>
                                <Col sm="12" md={{ size: 3, offset: 3 }}>
                                    <Button block color="primary" onClick={() => onAcceptUserPromote() }>Tak</Button>
                                </Col>
                                <Col sm="12" md={{ size: 3 }}>
                                    <Button block color="danger" onClick={ () => setPromoteMsg(false) }>Nie</Button>
                                </Col>
                            </Row>
                        </Container>
                    </ModalFooter>
                </Modal>
            }

            <EditUserModal
                isOpen={isOpenEditModal}
                userId={editUserId}
                onClose={() => {
                    setEditUserId(-1);
                    toggleEditModal(false);
                    setType("edit");
                }}
                onUserSave={() => {setRefresh(!refresh)}}
                type={ type }
            />
        </Wrapper>
    );
};

export default StudentList;