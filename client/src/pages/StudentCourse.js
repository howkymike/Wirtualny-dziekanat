import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Table, Collapse, Button, Alert, Badge } from 'reactstrap';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import MessageBox from '../components/MessageBox';
import ReportGradeModal from '../components/ReportGradeModal'

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
`;

const Selector = styled.div` 
    & > * {
        display: inline-block;
        margin: 0 1em;
        user-select: none;
    }
`;

const FaArrow = styled(Fa)`
    color: ${props => props.active ? "#000" : "#e2e2e2" };
`;

const SelBadge = styled(Badge)`
    width: 10em;
`;

const StudentCourse = () => {
    let [loading, setLoading] = useState(true);
    let [list, setList] = useState([]);

    const [selectedCourse, setSelectedCourse] = useState(-1);
    const [showMessage, toggleMessage] = useState(-1);
    const [alert, showAlert] = useState(-1);
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [reportGrade, setReportGrade] = useState(-1);
    const [semester, setSemester] = useState(0);
    const [selectedSemester, setSelectedSemester] = useState(0);


    const { fetchApi, userId } = useContext(userContext);

    useEffect(() => {
        const getData = async () => {
            const data = await Promise.all([fetchApi(`/student/course-of-studies`), fetchApi("/courses/my/student")]);

            const [student, courses] = data;

            if(courses[1]) {
                setList(courses[0]);
                console.log(courses[0]);
            }

            if(student[1]) {
                setSemester(student[0].semester);
                setSelectedSemester(student[0].semester);
            }

            setLoading(false);
        }

        getData();

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

    const changeSemester = (dir) => {
        const newSemester = selectedSemester + dir;

        if(newSemester > 0 && newSemester <= semester) {
            setSelectedSemester(newSemester);
        }
    }

    return (
        <Wrapper>
            <h4>Moje Kursy</h4>
            <hr />
            <Selector>
                <FaArrow icon={faArrowLeft} 
                    active={ selectedSemester > 1 ? "true" : undefined }
                    onClick={ () => changeSemester(-1) }
                ></FaArrow>
                <SelBadge>
                    { semester === selectedSemester ?
                        "Obecny semestr" :
                        "Semestr " + selectedSemester
                    }
                </SelBadge>
                <FaArrow 
                    icon={faArrowRight} active={ selectedSemester < semester ? "true" : undefined }
                    onClick={ () => changeSemester(1) }
                ></FaArrow>
            </Selector>
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
                            <td colSpan="4">Ładowanie</td>
                        </tr>
                        :
                        list.filter( value => value.semester === selectedSemester ).map((course, key) => ([
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
                                                <h6>Ćwiczenia: </h6>
                                                { course.courseStudents[0].laboratoryGrade ? course.courseStudents[0].laboratoryGrade : "-" }
                                            </Grade>
                                            { course.exam &&
                                            <Grade>
                                                <h6>Egzamin: </h6>
                                                { course.courseStudents[0].examGrade ? course.courseStudents[0].examGrade : "-" }
                                            </Grade>
                                            }
                                            <Grade>
                                                <h6>Koncowa: </h6>
                                                { course.courseStudents[0].finalGrade ? course.courseStudents[0].finalGrade : "-" }
                                            </Grade>
                                        </GradeContainer>

                                        {course.courseStudents.find((c => parseInt(userId, 10) === c.id.studentId)).gradeAccepted ?
                                            <h6>Oceny zostaly zatwierdzone.</h6>
                                            :
                                            <>
                                                <StyledButton
                                                    color="primary"
                                                    disabled={!course.courseStudents[0].finalGrade}
                                                    onClick={() => { toggleMessage(key) }}
                                                >
                                                    Potwierdz oceny
                                                </StyledButton>
                                                <StyledButton
                                                    color="danger"
                                                    disabled={!course.courseStudents[0].finalGrade}
                                                    onClick={() => { setReportGrade(key) }}
                                                >
                                                    Zglos problem
                                                </StyledButton>
                                            </>
                                        }

                                        <Alert
                                            color={alertType}
                                            isOpen={alert === key}
                                            toggle={() => showAlert(-1)}
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

            <ReportGradeModal
                isOpen={reportGrade > -1}
                toggle={() => setReportGrade(-1)}
                course={list[reportGrade]} />
        </Wrapper>
    );
}

export default StudentCourse;