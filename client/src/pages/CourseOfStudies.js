import React, { useContext, useEffect, useReducer } from 'react';
import { Table, Alert } from 'reactstrap';
import styled from 'styled-components';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import { userContext } from '../context/userContext';
import { Wrapper } from './StudentList';

import GradientButton from '../components/GradientButton';
import Editable from '../components/Editable';

const initialState = {
    user: {}, loading: true, error: [false, ""], name: "",
    surname: "", index: "", levelOfStudies: "", commencmentOfStudies: "", fieldsOfStudies: ""
}

const reducer = (state, {type, payload}) => {
    switch(type) {
        case "course-of-studies":
            return {
                ...state,
                user: payload, loading: false, name: payload.name,
                surname: payload.surname, index: payload.index, levelOfStudies: payload.levelOfStudies,
                commencmentOfStudies: payload.commencmentOfStudies, fieldsOfStudies: ""//payload.telephone
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
`;

const FaEdit = styled(Fa)`
    position: absolute;
    right: 1em;
    top: 0.5em;
    cursor: pointer;
`;

const CourseOfStudies = ({ type }) => {

    const { fetchApi } = useContext(userContext);
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {

        const getCourseOfStudies = async () => {
            const [result, isOk] = await fetchApi(`/student/course-of-studies`);

            if(isOk) {
                dispatch({ type: "course-of-studies", payload: result });
            } else
                dispatch({ type: "error", payload: result });
        }

        getCourseOfStudies();

    }, [fetchApi, type]);

    return(
        <Wrapper>
            <h4>Przebieg Studiów</h4>
            <hr />
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
                            <Th scope="row">Data rozpoczęcia studiów</Th>
                            <Td>{ state.user.commencmentOfStudies }</Td>
                        </tr>
                    </>
                }
                </tbody>
                <thead>
                <tr>
                    <Thead colSpan="2">
                        <span>Kierunki studiów</span>
                    </Thead>
                </tr>
                </thead>
            </Table>
            {
                state.error[0] && <Alert color={"danger"}>{state.error[1]}</Alert>
            }

        </Wrapper>
    );
}

export default CourseOfStudies; // CourseOfStudies