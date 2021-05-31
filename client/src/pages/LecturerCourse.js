import React, { useState, useEffect, useContext } from 'react'

import { Table } from 'reactstrap';
import Wrapper, { Header } from '../components/Wrapper';

import { userContext } from '../context/userContext'
import ImprovedGradientButton from '../components/ImprovedGradientButton';
import ErrorBox from '../components/Error';
import GradeModal from '../components/GradeModal';

import CourseDetailsModal from '../components/CourseDetailsComponent/CourseDetailsModal';

const LecturerCourse = props => {
    const { fetchApi, setHeader } = useContext(userContext)
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [modal, setModal] = useState([false, 0, "details"]);
    const [error, setError] = useState([false, ""]);
    const [gradeModal, setGradeModal] = useState([false, []]);
    const [refresh, toggleRefresh] = useState(false);

    useEffect(() => {
        setHeader("Twoje kursy")
        fetchApi("/courses/my/lecturer").then(res => {
            setLoading(false);
            setList(res[0]);
        }).catch(e => {
            setError(true, "Wystąpił błąd przy pobieraniu listy kursów");
        })
    }, [fetchApi, refresh, setHeader]);

    return (
        <Wrapper>
            <Header>Kursy</Header>
            <Table striped borderless hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nazwa</th>
                        <th>Wydział</th>
                        <th>Kierunek</th>
                        <th>Zapisanych</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ?
                        <tr><td>Loading...</td></tr>
                        :
                        list.map((course, key) =>
                            <tr key={key}>
                                <td>{course.id}</td>
                                <td>{course.name}</td>
                                <td>{course.fieldOfStudy.name}</td>
                                <td>{course.fieldOfStudy.faculty.name}</td>
                                <td>{course.courseStudents.length}</td>
                                <td>
                                    <ImprovedGradientButton onClick={() => setModal([!modal[0], course.id, "details"])}>
                                        Szczegóły
                                    </ImprovedGradientButton>
                                    <div className='mt-1' />
                                    <ImprovedGradientButton onClick={() => setGradeModal([!gradeModal[0], course.courseStudents, course.id])}>Wpisz oceny</ImprovedGradientButton>
                                </td>
                            </tr>
                        )}
                </tbody>
            </Table>

            {modal[0] &&
                <CourseDetailsModal
                    isOpen={modal[0]}
                    id={modal[1]}
                    toggle={() => setModal([!modal[0], modal[1], modal[2]])}
                    onSave={() => toggleRefresh(!refresh)}
                    type={modal[2]}
                />
            }

            <GradeModal isOpen={gradeModal[0]} courseStudents={gradeModal[1]} id={gradeModal[2]} toggle={() => setGradeModal([!gradeModal[0], []])} />
            <ErrorBox error={error} />
        </Wrapper>

    )
};

export default LecturerCourse;