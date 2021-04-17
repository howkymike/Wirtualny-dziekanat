import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input, Table } from 'reactstrap';

import { userContext } from '../context/userContext';

const Wrapper = styled.div` 
    margin: 2em;
    background-color: #fff;
    border-radius: 10px;
    color: #000;
    padding: 1em;
    text-align: center;
`;

const StudentList = props => {

    let [listType, setListType] = useState("student");
    let [loading, setLoading] = useState(true);
    let [list, setList] = useState([]);
    const { fetchApi } = useContext(userContext);

    useEffect(() => {

        fetchApi("/user/" + listType + "/").then(res => {
            if(res[1]) {
                setList(res[0].list);
                setLoading(false);
            }
        });

    }, [listType, fetchApi]);

    return(
        <Wrapper>
            <h4>Lista użytkowników</h4>
            <hr />
            <Input type="select" value={listType} onChange={ e => setListType(e.target.value) }>
                <option value="student">Studenci</option>
                <option value="clerk">Pracownicy</option>
                <option value="professor">Wykładowcy</option>
            </Input>
            <hr />
            <Table>
                <thead>
                    <tr>
                        <th>Lp.</th>
                        <th>Imię</th>
                        <th>Nazwisko</th>
                        <th>Email</th>
                        {   listType === "student" &&
                            <th>Indeks</th>
                        }
                        {   listType === "professor" &&
                            <th>Tytuł</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {   loading &&
                        <tr>
                            <td colSpan="3">Ładowanie</td>
                        </tr>
                    }
                    { list.map((user, key) => (
                        <tr key={ key }>
                            <td>{ key + 1 }</td>
                            <td>{ user.owner.name }</td>
                            <td>{ user.owner.surname }</td>
                            <td>{ user.owner.email }</td>
                            {   listType === "student" &&
                                <td>{ user.index }</td>
                            }
                            {   listType === "professor" &&
                                <td>{ user.title }</td>
                            }
                        </tr>
                    )) }
                </tbody>
            </Table>
        </Wrapper>
    );
}

export default StudentList;