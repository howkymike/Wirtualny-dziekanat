import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Table, Collapse, Button, Alert } from 'reactstrap';

import MessageBox from '../components/MessageBox';

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
    margin: 1em;
`;

const GradeContainer = styled.div`   
    width: 100%;
    display: flex;
    flex-direction: row;

    justify-content: center;

`
const Grade = styled.div`
    padding: 1em 2.5em 1em 2.5em;
    margin: 1em 0 1em 0;
    
    border-right: 1px solid #ccc; 

    &:last-child{
        border: none;
    }
`
const Tr = styled.tr`
&:hover{
    cursor: pointer;
}
`

const StudentCourse = () => {
    let [loading, setLoading] = useState(true);
    let [list, setList] = useState([]);

    const [selectedCourse, setSelectedCourse] = useState(-1);
    const [showMessage, toggleMessage] = useState(-1);
    const [alert, showAlert] = useState(-1);
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const { fetchApi, userId } = useContext(userContext);

    useEffect(() => {

        fetchApi("/courses/my").then(res => {
            if (res[1]) {
                setList(res[0]);
                setLoading(false);
            }
        });

    }, [fetchApi]);

    const confirmGrades = (courseKey) => {
        let course = list[courseKey];

        fetchApi(`/courses/${course.id}/${userId}/confirmGrade`, {
            method: 'POST',
        }).then(res => {
            if (res[0].ok) {
                setAlertType("success");

                let newList = list.splice(0);
                course.courseStudents.find(c => parseInt(userId, 10) === c.id.studentId).gradeAccepted = true;
                newList[courseKey] = course;
                setList(newList);
            } else {
                setAlertType("danger");
            }
            console.log(res);
            setAlertMessage(res[0].msg);
            showAlert(courseKey);
            toggleMessage(-1);
        });
    };

    const getGrade = (courseKey, type) => {
        const course = list[courseKey].courseStudents.find(c => parseInt(userId, 10) === c.id.studentId);
        let grade = 0;

        switch (type) {
            case 'final':
                grade = course.finalGrade;
                break;
            case 'exam':
                grade = course.examGrade;
                break;
            case 'lab':
                grade = course.laboratoryGrade;
                break;
            default:
                return "-";
        }

        return (grade > 0) ? grade : '-';
    };

    return (
        <Wrapper>
            <h4>Moje Kursy</h4>
            <hr />
            <Table striped borderless>
                <thead>
                    <tr>
                        <th>Lp.</th>
                        <th>Nazwa</th>
                        <th>ECTS</th>
                        <th>Egzamin</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ?
                        <tr>
                            <td colSpan="3">Ładowanie</td>
                        </tr>
                        :
                        list.map((course, key) => ([
                            <Tr key={key} onClick={() => setSelectedCourse((selectedCourse === key) ? -1 : key)}>
                                <td>{key + 1}</td>
                                <td>{course.name}</td>
                                <td>{course.ects}</td>
                                <td>{course.exam ? ("Tak") : ("Nie")}</td>
                            </Tr>,
                            <tr key={`${key}_grades`}>
                                <td colSpan={4}>
                                    <Collapse
                                        isOpen={key === selectedCourse}
                                    >
                                        <GradeContainer>
                                            <Grade>
                                                <h6>Cwiczenia: </h6>
                                                {getGrade(key, 'lab')}
                                            </Grade>
                                            <Grade>
                                                <h6>Egzamin: </h6>
                                                {getGrade(key, 'exam')}
                                            </Grade>
                                            <Grade>
                                                <h6>Koncowa: </h6>
                                                {getGrade(key, 'final')}
                                            </Grade>
                                        </GradeContainer>

                                        {course.courseStudents.find((c => parseInt(userId, 10) === c.id.studentId)).gradeAccepted ?
                                            <h6>Oceny zostaly zatwierdzone.</h6>
                                            :
                                            <StyledButton
                                                color="primary"
                                                disabled={getGrade(key, 'final') === '-'}
                                                onClick={() => { toggleMessage(key) }}
                                            >
                                                Potwierdz oceny
                                        </StyledButton>
                                        }

                                        <Alert
                                            color={alertType}
                                            isOpen={alert === key}
                                            toggle={()=>showAlert(-1)}
                                        >
                                            {alertMessage}
                                        </Alert>
                                    </Collapse>

                                    {showMessage === key &&
                                        <MessageBox
                                            onAccept={() => { confirmGrades(key) }}
                                            onReject={() => { toggleMessage(-1) }}
                                            cancelBtnText="Nie"
                                            okBtnText="Tak"
                                        >
                                            Czy jestes pewien ze oceny sa poprawne?
                                        </MessageBox>
                                    }

                                </td>
                            </tr>
                        ]))}
                </tbody>
            </Table>
        </Wrapper>
    );
}

export default StudentCourse;