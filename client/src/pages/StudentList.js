import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input, Table, Button, Badge, Alert } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTimes, faUserEdit } from '@fortawesome/free-solid-svg-icons'
import MessageBox from '../components/MessageBox'
import EditUserModal from '../components/EditUserComponent/EditUserModal'

import { userContext } from '../context/userContext';

export const Wrapper = styled.div` 
    margin: 2em;
    background-color: #fff;
    border-radius: 10px;
    color: #000;
    padding: 1em;
    text-align: center;
`;

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

const StudentList =  ({ semesterFilter = false }) => {

    let [semesterPicked, setSemesterPicked] = useState("-1");
    let [listType, setListType] = useState("student");
    let [loading, setLoading] = useState(true);
    let [list, setList] = useState([]);
    const [deleteMsg, setDeleteMsg] = useState(false);
    const [editUserId, setEditUserId] = useState(-1);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isOpenEditModal, toggleEditModal] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [error, setError] = useState([false, ""]);

    const { fetchApi } = useContext(userContext);

    useEffect(() => {
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
    }, [refresh, listType, fetchApi]);

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

    const getRoleName = (role) => {
        if (role.startsWith("ROLE_")) {
            return role[5].toUpperCase() + role.substring(6).toLowerCase();
        } else {
            return "";
        }
    }

    return (
        <Wrapper>
            <h4>Lista użytkowników</h4>
            <hr />
            {   semesterFilter &&
                <div>
                <h6>Wybierz semestr</h6>
                <Input type="select" value={semesterPicked} onChange={e => setSemesterPicked(e.target.value)}>
                    <option value="-1">Wszystkie</option>
                    <option value="1">Pierwszy</option>
                    <option value="2">Drugi</option>
                    <option value="3">Trzeci</option>
                    <option value="4">Czwarty</option>
                    <option value="5">Piąty</option>
                    <option value="6">Szósty</option>
                    <option value="7">Siódmy</option>
                </Input>
                </div>
            }
            {   !semesterFilter &&
                <Input type="select" value={listType} onChange={e => setListType(e.target.value)}>
                    <option value="student">Studenci</option>
                    <option value="clerk">Pracownicy</option>
                    <option value="lecturer">Wykładowcy</option>
                </Input>
            }
            <hr />
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

            {
                error[0] && <Alert color={"danger"}>{ error[1] }</Alert>
            }

            {   deleteMsg &&
                <MessageBox
                    onAccept={() => onAcceptUserDelete()}
                    onReject={() => setDeleteMsg(false)}
                    cancelBtnText={"Nie"}
                    okBtnText={"Tak"}
                >
                    {"Czy napewno chcesz usunąć tego użytkownika?"}
                </MessageBox>
            }

            <EditUserModal
                isOpen={isOpenEditModal}
                userId={editUserId}
                onClose={() => {
                    setEditUserId(-1);
                    toggleEditModal(false);
                }}
                onUserSave={() => {setRefresh(!refresh)}}
            />
        </Wrapper>
    );
}

export default StudentList;