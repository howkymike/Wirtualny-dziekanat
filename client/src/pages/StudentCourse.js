import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import {Table} from 'reactstrap';


import { userContext } from '../context/userContext';

export const Wrapper = styled.div` 
    margin: 2em;
    background-color: #fff;
    border-radius: 10px;
    color: #000;
    padding: 1em;
    text-align: center;
`;

const StudentCourse = () => {

    let [loading, setLoading] = useState(true);
    let [list, setList] = useState([]);

    const { fetchApi } = useContext(userContext);

    useEffect(() => {

        fetchApi("/courses/my").then(res => {
            if (res[1]) {
                setList(res[0]);
                setLoading(false);
            }
        });

    }, [fetchApi]);


    return (
        <Wrapper>
            <h4>Moje Kursy</h4>
            <hr />
            <Table>
                <thead>
                <tr>
                    <th>Lp.</th>
                    <th>Nazwa</th>
                    <th>ECTS</th>
                    <th>Egzamin</th>
                </tr>
                </thead>
                <tbody>
                {loading &&
                <tr>
                    <td colSpan="3">Ładowanie</td>
                </tr>
                }
                {list.map((course, key) => (
                    <tr key={key}>
                        <td>{key + 1}</td>
                        <td>{course.name}</td>
                        <td>{course.ects}</td>
                        <td>{course.exam ? ("Tak") : ("Nie")}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Wrapper>
    );
}

export default StudentCourse;