import React, { useState, useEffect, useContext } from 'react'

import { Table } from 'reactstrap';
import { Wrapper } from './StudentCourse';

import { userContext } from '../context/userContext'
import ImprovedGradientButton from '../components/ImprovedGradientButton';

import CourseDetailsModal from '../components/CourseDetailsComponent/CourseDetailsModal';

const LecturerCourse = props => {
    const { fetchApi } = useContext(userContext)

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [modal, setModal] = useState([false, 0, "details"]);

    useEffect(() => {
        fetchApi("/courses/my/lecturer").then(res => {
            setLoading(false);
            setList(res[0]);
        });
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
                                <td>
                                    <ImprovedGradientButton onClick={ () => setModal([!modal[0], course.id, "details"]) }>
                                        Szczegóły
                                    </ImprovedGradientButton>
                                </td>
                            </tr>
                        )}
                </tbody>
            </Table>

            {modal[0] &&
            <CourseDetailsModal
                isOpen={ modal[0] }
                id={ modal[1] }
                toggle={ () => setModal([!modal[0], modal[1], modal[2]]) }
                type={modal[2]}
            />
            }

        </Wrapper>

    )
};

export default LecturerCourse;