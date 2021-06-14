import React, {useContext, useEffect, useReducer, useState} from 'react';
import { Table } from 'reactstrap';
import styled from 'styled-components';

import { userContext } from '../context/userContext';
import Wrapper from '../components/Wrapper';
import ErrorBox from '../components/Error';

const initialState = {
    user: {}, loading: true, error: [false, ""], name: "",
    surname: "", index: "", levelOfStudies: "", commencmentOfStudies: "", fieldsOfStudies: [{faculty: "", fieldOfStudy: ""}]
}

const reducer = (state, {type, payload}) => {
    switch(type) {
        case "course-of-studies":
            return {
                ...state,
                user: payload, loading: false, name: payload.name,
                surname: payload.surname, index: payload.index, levelOfStudies: payload.levelOfStudies,
                commencmentOfStudies: payload.commencmentOfStudies, fieldsOfStudies: payload.fieldsOfStudies
            }
        case "error":
            if(typeof payload == "object")
                return { ...state, error: [true, payload.error] }
            else
                return { ...state, error: [true, payload] }
        default:
            return state;
    }
}

const Td = styled.td` 
    height: 3em;
    line-height: 3em;
    width: 50%;
`;

const Th = styled.th` 
    height: 3rem;
    line-height: 3rem;
    width: 50%;
`;

const Thead = styled.th` 
    position: relative;
    background-color: #2c3e50;
    color: #fff;
`;

const CourseOfStudies = ({ type }) => {

    const { fetchApi, setHeader } = useContext(userContext);
    const [state, dispatch] = useReducer(reducer, initialState);

    let [list, setList] = useState([]);

    useEffect(() => {
        setHeader("Przebieg studiów");

        const getCourseOfStudies = async () => {
            try {
                const [result, isOk] = await fetchApi(`/student/course-of-studies`);

                if(isOk) {
                    dispatch({ type: "course-of-studies", payload: result });
                    setList(result.fieldsOfStudies);
                    console.log(result);
                } else
                    throw new Error();
            } catch(e) {
                dispatch({ type: "error", payload: "Wystąpił błąd przy pobieraniu przebiegu studiów" });
            }
        }

        getCourseOfStudies();

    }, [fetchApi, type, setHeader]);

    return(
        <Wrapper>
            <Table hover striped>
                <thead>
                <tr>
                    <Thead colSpan="2">
                        <span>Dane studenta</span>
                    </Thead>
                </tr>
                </thead>
                <tbody>
                {   state.loading ?
                    <tr><td colSpan="2">Ładowanie</td></tr>
                    :
                    <>
                        <tr>
                            <Th scope="row">Imię</Th>
                            <Td>{ state.user.name }</Td>
                        </tr>
                        <tr>
                            <Th scope="row">Nazwisko</Th>
                            <Td>{ state.user.surname }</Td>
                        </tr>
                        <tr>
                            <Th scope="row">Index</Th>
                            <Td>{ state.user.index }</Td>
                        </tr>
                        <tr>
                            <Th scope="row">Poziom studiów</Th>
                            <Td>{ state.user.levelOfStudies }</Td>
                        </tr>
                        <tr>
                            <Th scope="row">Semestr</Th>
                            <Td>{ state.user.semester }</Td>
                        </tr>
                        <tr>
                            <Th scope="row">Data rozpoczęcia studiów</Th>
                            <Td>{ state.user.commencmentOfStudies }</Td>
                        </tr>
                    </>
                }
                </tbody>
                <thead>

                <tr>
                    <Thead colSpan="1">
                        <span>Kierunek</span>
                    </Thead>
                    <Thead colSpan="1">
                        <span>Wydział</span>
                    </Thead>
                </tr>
                </thead>
                <tbody>
                {list.length ?
                    (list.map((field, key) => (
                    <tr key={key}>
                        <td>{field.fieldOfStudy}</td>
                        <td>{field.faculty}</td>
                    </tr>
                ))) :
                    (
                        <tr>
                            <td colSpan="2">Brak kierunków do wyświetlenia</td>
                        </tr>
                    )
                }
                </tbody>
            </Table>
            <ErrorBox error={state.error} />
        </Wrapper>
    );
}

export default CourseOfStudies;