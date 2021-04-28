import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input, Table, Button, Badge } from 'reactstrap';

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

const StudentList = () => {

    let [listType, setListType] = useState("student");
    let [loading, setLoading] = useState(true);
    let [list, setList] = useState([]);
    const [deleteMsg, setDeleteMsg] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

    const { fetchApi } = useContext(userContext);

    useEffect(() => {

        fetchApi("/users/" + listType + "/").then(res => {
            if (res[1]) {
                setList(res[0].list);
                setLoading(false);
            }
        });

    }, [listType, fetchApi]);

    const onUserDelete = (key) => {
        setUserToDelete(key);
        setDeleteMsg(true);
    };

    const onAcceptUserDelete = async () => {
        const user = list[userToDelete].user;

        const [, isOk] = await fetchApi("/users/" + user.id, {
            method: "DELETE",
        });

        if (isOk) {
            setList(list.filter(usr => usr.user.id !== user.id));
        }

        setDeleteMsg(false)
    };


    return (
        <Wrapper>
            <h4>Lista użytkowników</h4>
            <hr />
            <Input type="select" value={listType} onChange={e => setListType(e.target.value)}>
                <option value="student">Studenci</option>
                <option value="staff">Pracownicy</option>
                <option value="lecturer">Wykładowcy</option>
            </Input>
            <hr />
            <Table>
                <thead>
                    <tr>
                        <th>Lp.</th>
                        <th>Imię</th>
                        <th>Nazwisko</th>
                        <th>Email</th>
                        <th>Role</th>

                        {listType === "student" &&
                            <th>Indeks</th>
                        }
                        {listType === "lecturer" &&
                            <th>Tytuł</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {loading &&
                        <tr>
                            <td colSpan="3">Ładowanie</td>
                        </tr>
                    }
                    {list.map((user, key) => (
                        <tr key={key}>
                            <td>{key + 1}</td>
                            <td>{user.user.name}</td>
                            <td>{user.user.surname}</td>
                            <td>{user.user.email}</td>
                            <td>
                                <RoleContainer>
                                    {user.user.roles.map((role, key) => (
                                        <Role key={key} color="primary">{role.name}</Role>
                                    ))}
                                </RoleContainer>
                            </td>
                            {   listType === "student" &&
                                <td>{user.index}</td>
                            }
                            {   listType === "lecturer" &&
                                <td>{user.title}</td>
                            }
                            <td>
                                <StyledButton color="primary" onClick={() => setEditUser(user)}>
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
            {
                editUser ?
                    <EditUserModal userId={editUser.user.id} isOpen={true} onClose={() => setEditUser(null)} /> : ""
            }



        </Wrapper>
    );
}

export default StudentList;