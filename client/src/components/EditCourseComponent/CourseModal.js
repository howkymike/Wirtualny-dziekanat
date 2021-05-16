import { useEffect, useContext, useReducer } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import {
    Modal, ModalBody, ModalFooter, ModalHeader, Nav, 
    NavItem, NavLink, TabContent, Row, Container, Col, Button
} from "reactstrap";

import { userContext } from '../../context/userContext';
import CourseStudentsPanel from './CourseStudentsPanel';
import CoursePanel from './CoursePanel';
import CourseFacultyPanel from './CourseFacultyPanel';
import CourseLecturersPanel from "./CourseLecturersPanel";

const Wrapper = styled.div`
    padding: 0.5em;
`;

const BiggerModal = styled(Modal)`
    max-width: 50em;
`;

const initialState = {
    name: "", lecture_time: 0, laboratory_time: 0, id: 0, exam: false, ects: 0, 
    courseLecturers: [], courseStudents: [], loading: true, semester: 0,
    studentList: [], activeTab: 0, fieldOfStudy: 0, faculties: [], fields: [], lecturerList: []
};

const reducer = (state, {type, payload}) => {
    switch(type) {
        case "course":
            return {
                ...state, ...payload, loading: false,
                courseLecturers: payload.courseLecturers.map(value => value.id),
                courseStudents: payload.courseStudents.map(value => value.id.studentId),
                fieldOfStudy: payload.fieldOfStudy.id, semester: payload.semester
            }
        case "name": case "lecture_time": case "laboratory_time": case "exam": 
        case "ects": case "fieldOfStudy": case "semester":
            return {
                ...state, [type]: payload
            }
        case "tab": 
            return {
                ...state, activeTab: payload
            }
        case "studentList":
            return {
                ...state, activeTab: 3, studentList: payload
            }
        case "lecturerList":
            return {
                ...state, activeTab: 2, lecturerList: payload
            }
        case "addStudent":
            return {
                ...state, courseStudents: [...state.courseStudents, payload]
            }
        case "deleteStudent":
            return {
                ...state, courseStudents: state.courseStudents.filter(value => value !== payload)
            }
        case "addLecturer":
            return {
                ...state, courseLecturers: [...state.courseLecturers, payload]
            }
        case "deleteLecturer":
            return {
                ...state, courseLecturers: state.courseLecturers.filter(value => value !== payload)
            }
        case "faculties":
            return {
                ...state, faculties: payload[1], fields: payload[0], activeTab: 1
            }
        default: 
            return state;
    }
};

const CourseModal = props => {
    const { isOpen, toggle, type, id } = props;
    const { fetchApi } = useContext(userContext);

    const [state, dispatch] = useReducer(reducer, initialState);

    const toggleTab = tab => {
        if(state.activeTab === tab) return;

        if(tab === 3) {
            const getStudentList = async () => {
                const [res, isOk] = await fetchApi(`/users/student`, {
                    method: "GET"
                });

                if(isOk)
                    dispatch({ type: "studentList", payload: res.list });
            }
            if(state.studentList.length)
                dispatch({ type: "tab", payload: tab });
            else
                getStudentList();
        } else if(tab === 1) {

            const getFieldsOfStudy = async () => {
                const [res, isOk] = await fetchApi(`/fieldofstudy`);

                if(isOk)
                    return res;
                return [];
            }

            const getFaculties = async () => {
                const [res, isOk] = await fetchApi(`/faculties`);

                if(isOk)
                    return res;
                return [];
            }

            if(!state.fields.length && !state.faculties.length)
                Promise.all([ getFieldsOfStudy(), getFaculties() ]).then(res => {
                    dispatch({ type: "faculties", payload: res});
                });
            else
                dispatch({ type: "tab", payload: tab });
        } else if ( tab === 2) {

            const getLecturerList = async () => {
                const [res, isOk] = await fetchApi(`/users/lecturer`, {
                    method: "GET"
                });
                if(isOk)
                    dispatch({ type: "lecturerList", payload: res.list });
            }
            if(state.lecturerList.length)
                dispatch({ type: "tab", payload: tab });
            else
                getLecturerList();

            dispatch({ type: "tab", payload: tab });
        } else {
            dispatch({ type: "tab", payload: tab });
        }
    }

    useEffect(() => {
        if(!isOpen) return;

        const getCourse = async () => {
            const [res, isOk] = await fetchApi(`/courses/${id}`, {
                method: "GET"
            });

            if(isOk) {
                dispatch({ type: "course", payload: res });
            }
        }

        if(type === "edit")
            getCourse();

    }, [fetchApi, isOpen, id, type]);

    useEffect( () => {

        if(state.lecture_time < 0)
            dispatch({type: "lecture_time", payload: 0});

        if(state.laboratory_time < 0)
            dispatch({type: "laboratory_time", payload: 0});

        if(state.ects < 0)
            dispatch({type: "ects", payload: 0});
    }, [state.lecture_time, state.laboratory_time, state.ects ] )

    const updateCourse = async () => {
        let path = `/courses/${id}/edit`;
        if(type === "create") path = `/courses`;
        const [res, isOk] = await fetchApi(path, {
            method: "POST",
            body: JSON.stringify({
                id, lecture_time: state.lecture_time, laboratory_time: state.laboratory_time,
                ects: state.ects, exam: state.exam, name: state.name, courseStudentIds: state.courseStudents,
                courseLecturerIds: state.courseLecturers, fieldOfStudyId: state.fieldOfStudy, semester: state.semester
            })
        });

        if(isOk)
            toggle();
        else    
            console.log(res);
    }

    return (
        <BiggerModal isOpen={ (type === "create" && isOpen) || (isOpen && !state.loading) } toggle={ toggle }>
            <ModalHeader>
                { type === "edit" ? "Edytowanie kursu" : "Tworzenie kursu" }
            </ModalHeader>
            <ModalBody>
                <Nav tabs>
                    { ["Kurs", "Wydział", "Prowadzący", "Uczestnicy"].map( (value, key) => (
                        <NavItem key={ key }>
                            <NavLink
                                className={ classnames({ active: state.activeTab === key }) }
                                onClick={ () => { toggleTab(key); } }
                            >
                                { value }
                            </NavLink>
                        </NavItem>
                    )) }
                </Nav>

                <Wrapper>
                    <TabContent activeTab={ state.activeTab }>
                        <CoursePanel state={ state } dispatch={ dispatch } edit={ type === "edit" } toggle={ toggle }/>
                        <CourseLecturersPanel state={ state } dispatch={ dispatch } lecturerList={ state.lecturerList } />
                        <CourseStudentsPanel state={ state } dispatch={ dispatch } list={ state.studentList } />
                        <CourseFacultyPanel
                            state={ state } dispatch={ dispatch }
                            faculties={ state.faculties } fields={ state.fields }
                        />
                    </TabContent>
                </Wrapper>
            </ModalBody>
            <ModalFooter>
                <Container>
                    <Row>
                        <Col sm="12" md={{ size: 3, offset: 3 }}>
                            <Button block color="primary" onClick={() => updateCourse() }>Zapisz</Button>
                        </Col>
                        <Col sm="12" md={{ size: 3 }}>
                            <Button block color="danger" onClick={toggle}>Wyjdź</Button>
                        </Col>
                    </Row>
                </Container>
            </ModalFooter>
        </BiggerModal>
    );
};

export default CourseModal;
