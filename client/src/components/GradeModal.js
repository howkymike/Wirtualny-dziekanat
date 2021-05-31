import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { ModalBody, ModalHeader, ModalFooter, Container, Row, Col, Button, Table, Input, Alert } from 'reactstrap';
import { userContext } from '../context/userContext';
import { Modal } from './Wrapper';
import ErrorBox from '../components/Error';

const BiggerModal = styled(Modal)` 
    max-width: 40em;
`;

const GradeModal = props => {
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [gradeList, setGradeList] = useState(props.courseStudents);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { fetchApi } = useContext(userContext);

    useEffect(() => {
        try {
            const getStudentList = async () => {
                const [res, isOk] = await fetchApi(`/users/student`, {
                    method: "GET"
                });
    
                if(!isOk)
                    throw new Error();

                setList(res.list);
                setLoading(false);
            }
            
            getStudentList();
        } catch(e) {
            //console.log(e);
            setError("Nie udało się pobrać listy studentów");
        }
    }, [fetchApi]);

    useEffect(() => {
        setGradeList(props.courseStudents);
    }, [props.courseStudents]);

    const getStudentName = (id) => {
        const student = list.find(value => value.id === id);
        
        if(student)
            return student.user.name + " " + student.user.surname;
        return "";
    }

    useEffect(() => {
        setSuccess("");
    }, [props.isOpen]);

    const sendGrades = async () => {
        if(error !== "")
            return;
        try {
            const request = {
                grades: gradeList.map(val => { return { 
                    studentId: val.id.studentId, laboratoryGrade: val.laboratoryGrade,
                    examGrade: val.examGrade, finalGrade: val.finalGrade
                } }),
                id: props.id
            };

            const [, isOk] = await fetchApi("/courses/grade", {
                method: "PUT", body: JSON.stringify(request)
            });

            if(!isOk)
                throw new Error();

            setSuccess("Udało się zapisać oceny");
        } catch(e) {
            //console.log(e);
            setError("Nie udało się zapisać ocen");
        }
    }

    const changeGrade = (key, type, value) => {
        setError("");
        setSuccess("");
        const newList = [...gradeList];

        newList[key][type] = value;

        if((Number(value) < 2 || Number(value) > 5 || Number(value) % 0.5) && value !== "")
            setError("Nieprawidłowa ocena");

        setGradeList(newList);
    }

    return(
        <BiggerModal isOpen={ props.isOpen && !loading } toggle={ props.toggle }>
            <ModalHeader>
                Wpisz oceny
            </ModalHeader>
            <ModalBody>
                <Table>
                    <thead>
                        <tr>
                            <th>Imię i nazwisko</th>
                            <th>Ćwiczenia</th>
                            <th>Egzamin</th>
                            <th>Końcowa</th>
                        </tr>
                    </thead>
                    <tbody>
                    { gradeList.map((value, key) => (
                        <tr key={key}>
                            <td>
                                { getStudentName(value.id.studentId) }
                            </td>
                            <td>
                                <Input type="text" 
                                    value={ value.laboratoryGrade }
                                    onChange={ e => changeGrade(key, "laboratoryGrade", e.target.value ) }
                                />
                            </td>
                            <td>
                                <Input type="text" 
                                    value={ value.examGrade }
                                    onChange={ e => changeGrade(key, "examGrade", e.target.value ) }
                                />
                            </td>
                            <td>
                                <Input type="text" 
                                    value={ value.finalGrade }
                                    onChange={ e => changeGrade(key, "finalGrade", e.target.value ) }
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <ErrorBox error={ [error !== "", error]} />
                { success !== "" &&
                    <Alert color="success">{ success }</Alert>
                }
            </ModalBody>
            <ModalFooter>
                <Container>
                    <Row>
                        <Col sm="12" md={{ size: 3, offset: 3 }}>
                            <Button block color="primary" onClick={ () => sendGrades() }>Zapisz</Button>
                        </Col>
                        <Col sm="12" md={{ size: 3 }}>
                            <Button block color="danger" onClick={props.toggle}>Wyjdź</Button>
                        </Col>
                    </Row>
                </Container>
            </ModalFooter>
        </BiggerModal>
    )
}

export default GradeModal;