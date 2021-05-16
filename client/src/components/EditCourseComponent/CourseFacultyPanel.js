import React, { useEffect, useState } from 'react';
import { 
    FormGroup, Label, Input,
    Row, Col, TabPane
} from 'reactstrap';

const CourseFacultyPanel = props => {

    const { state, dispatch, faculties, fields } = props;
    const [faculty, setFaculty] = useState(0);

    useEffect(() => {
        if(!state.fieldOfStudy && faculties[0]) {
            setFaculty(faculties[0].id);
        }
            
        const fos = fields.find( value => value.id === state.fieldOfStudy);

        if(fos)
            setFaculty(fos.faculty.id);
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
                        <Input 
                            type="select" name="select" id="facultySelect" 
                            onChange={ e => setFaculty(Number(e.target.value)) } value={ faculty }
                        >
                        { faculties.map( (value, key) => (
                            <option key={ key } value={ value.id }>{ value.name }</option>
                        )) }
                        </Input>
                    </FormGroup>
                </Col>
            </Row>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label for="facultySelect">Kierunek</Label>
                        <Input 
                            type="select" name="select" id="facultySelect"
                            value={ state.fieldOfStudy }
                            onChange={ e => dispatch({ type: "fieldOfStudy", payload: Number(e.target.value) })}
                        >
                            { fields.filter(value => value.faculty.id === faculty).map( (value, key) => (
                                <option key={ key } value={ value.id }>{ value.name }</option>
                            )) }
                        </Input>
                    </FormGroup>
                </Col>
            </Row>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label for="semester">Semestr</Label>
                        <Input 
                            type="number" id="semester"
                            value={ state.semester }
                            onChange={ e => dispatch({ type: "semester", payload: Number(e.target.value) })}
                        >
                        </Input>
                    </FormGroup>
                </Col>
            </Row>
        </TabPane>
    );
}

export default CourseFacultyPanel;