import React, { useState, useEffect, useContext } from 'react'

import { Table } from 'reactstrap';
import { Wrapper } from './StudentCourse';

import { userContext } from '../context/userContext'
import ImprovedGradientButton from '../components/ImprovedGradientButton';
import CourseModal from "../components/EditCourseComponent/CourseModal";
import ErrorBox from '../components/Error';

const LecturerCourse = props => {
    const { fetchApi } = useContext(userContext)
    const [modal, setModal] = useState([false, 0, "edit"]);
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [error, setError] = useState([false, ""]);

    useEffect(() => {
        fetchApi("/courses/my/lecturer").then(res => {
            setLoading(false);
            setList(res[0]);
        }).catch(e => {
            setError(true, "Wystąpił błąd przy pobieraniu listy kursów");
        })
    }, [fetchApi]);

    return (
        <Wrapper>
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
                                <td><ImprovedGradientButton>Szczegóły</ImprovedGradientButton><div className='mt-1' />
                                    <ImprovedGradientButton onClick={ () => setModal([!modal[0], course.id, "edit"]) }>Dodaj studenta</ImprovedGradientButton>
                                </td>
                            </tr>
                        )}
                </tbody>
            </Table>
            { modal[0] &&
            <CourseModal
                isOpen={ modal[0] }
                id={ modal[1] }
                toggle={ () => setModal([!modal[0], modal[1], modal[2]]) }
                type={modal[2]}
            />
            }
            <ErrorBox error={ error } />
        </Wrapper>

    )
};

export default LecturerCourse;