import React, { useEffect, useState } from 'react';
import { 
    FormGroup, Label, Input,
    Row, Col, TabPane
} from 'reactstrap';

const CourseDetailsFacultyPanel = props => {

    const { state, dispatch, faculties, fields } = props;
    const [faculty, setFaculty] = useState("");
    const [field, setField] = useState("");

    useEffect(() => {
        if(!state.fieldOfStudy && faculties[0]) {
            setFaculty(faculties[0].name);
            setField(fields[0].name);
        }
            
        const fos = fields.find( value => value.id === state.fieldOfStudy);

        if(fos) {
            setFaculty(fos.faculty.name);
            setField(fos.name);
        }
    }, [faculties, fields, state.fieldOfStudy]);

    useEffect(() => {
        const fos = fields.filter(value => value.faculty.id === faculty);

        if(fos.length) {
            dispatch({ type: "fieldOfStudy", payload: fos[0].id });
        }
    }, [faculty, fields, dispatch]);

    return(
        <TabPane tabId={ 1 }>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label for="facultySelect">Wydział</Label>
                        <Input placeholder="Wydział" value={ faculty } readOnly/>
                    </FormGroup>
                </Col>
            </Row>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label for="facultySelect">Kierunek</Label>
                        <Input placeholder="Kierunek" value={ field } readOnly/>
                    </FormGroup>
                </Col>
            </Row>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label for="semester">Semestr</Label>
                        <Input placeholder="Semestr" value={ state.semester } readOnly />
                    </FormGroup>
                </Col>
            </Row>
        </TabPane>
    );
}

export default CourseDetailsFacultyPanel;