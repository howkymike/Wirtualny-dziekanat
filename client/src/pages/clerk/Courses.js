import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Table, Alert, Button } from 'reactstrap';

import CourseModal from '../../components/EditCourseComponent/CourseModal';
import { userContext } from '../../context/userContext';
import { Wrapper } from '../StudentList';

const Courses = () => {
    const { fetchApi } = useContext(userContext);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [modal, setModal] = useState([false, 0, "edit"]);
    const [error, setError] = useState([false, ""]);


    useEffect(() => {
        const getCourses = async () => {
            const [result, isOk] = await fetchApi(`/courses`);

            if(isOk) {
                setCourses(result);
                setLoading(false);
            } else {
                setError([true, result]);
            }       
        }

        if(!modal[0])
            getCourses();
    },[fetchApi, modal]);
    return(
        <Wrapper>
            <h4>Kursy</h4>
            <hr />
            <Table hover striped>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Kurs</th><th>Prowadzący</th><th>Kierunek</th>
                        <th>Wydział</th><th>Uczestnicy</th><th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {   loading ?
                        <tr><td colSpan="6">Ładowanie</td></tr>
                        :
                        <>
                        { courses.map( (value, key) => (
                            <tr key={ key }>
                                <td>{ value.id }</td>
                                <td>{ value.name }</td>
                                { value.courseLecturers[0] ?
                                    <td>
                                        { value.courseLecturers[0].title } { value.courseLecturers[0].user.name } {value.courseLecturers[0].user.surname }
                                    </td> :
                                    <td> </td>
                                }
                                { value.fieldOfStudy ?
                                    <> 
                                        <td>{ value.fieldOfStudy.name }</td>
                                        <td>{ value.fieldOfStudy.faculty.name }</td>
                                    </> :
                                    <>
                                        <td></td><td></td>
                                    </>
                                }
                                <td>{ value.courseStudents.length }</td>
                                <td>
                                    <Button color="primary" onClick={ () => setModal([!modal[0], value.id, "edit"]) }>
                                        <FontAwesomeIcon icon={ faEdit } />
                                    </Button>
                                </td>
                            </tr>
                        )) }
                        </>
                    }
                </tbody>

            </Table>
            <Button color="success" size="lg" onClick={ () => setModal([!modal[0], null, "create"]) }> New course </Button>

            { modal[0] &&
                <CourseModal
                    isOpen={ modal[0] }
                    id={ modal[1] }
                    toggle={ () => setModal([!modal[0], modal[1], modal[2]]) }
                    type={modal[2]}
                />
            }
            { error[0] &&
                <Alert color="danger">{ error[1] }</Alert>
            }
        </Wrapper>
    )
}

export default Courses;