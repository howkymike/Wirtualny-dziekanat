import { useState, useEffect} from 'react';
import { Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';

const StudentTab = props => {
    const { state, dispatch } = props;

    const [invalidIndex, setInvalidIndex] = useState(false);
    
    useEffect(() => {
        const student = state.user.student;
        let error = false;

        if(student.index.toString().match(/^\d{6}$/)){
            setInvalidIndex(false);
        }else{
            setInvalidIndex(true);
            error = true;
        }

        dispatch({type: "error", data: {studentError: error}});
    }, [state.user.student ,dispatch]);

    const setIndex = (index) => {
        dispatch({type: "student", data: { ...state.user.student ,index}});
    };

    if(!state.user.student) return null;

    return (
        <Form>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label>Indeks:</Label>
                        <Input
                            type="text"
                            placeholder="Indeks"
                            value={state.user.student.index}
                            invalid={invalidIndex}
                            onChange={(e) => setIndex(e.target.value)}
                        />
                        <FormFeedback>Indeks powinien byc 6-cio cyfrowy.</FormFeedback>
                    </FormGroup>
                </Col>
            </Row>
        </Form>
    );
}

export default StudentTab;