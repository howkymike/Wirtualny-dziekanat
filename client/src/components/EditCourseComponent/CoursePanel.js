import React from 'react';
import { 
    FormGroup, Label, Input, InputGroupText, InputGroupAddon, 
    InputGroup, Row, Col, TabPane
} from 'reactstrap';

const CoursePanel = props => {

    const { state, dispatch } = props;

    return(
        <TabPane tabId={ 0 }>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label>Nazwa:</Label>
                        <Input
                            type="text"
                            placeholder="Nazwa"
                            value={ state.name }
                            onChange={ e => dispatch({ type: "name", payload: e.target.value })}
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label>Wykłady (h):</Label>
                        <InputGroup>
                            <Input
                                type="number"
                                placeholder="Wykłady (h)"
                                value={ state.lecture_time }
                                onChange={ e => dispatch({ type: "lecture_time", payload: e.target.value })}
                            />
                            <InputGroupAddon addonType="append">h</InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label>Laboratoria (h):</Label>
                        <InputGroup>
                            <Input
                                type="number"
                                placeholder="Laboratoria (h)"
                                value={ state.laboratory_time }
                                onChange={ e => dispatch({ type: "laboratory_time", payload: e.target.value })}
                            />
                            <InputGroupAddon addonType="append">h</InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                </Col>
            </Row>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label>ECTS:</Label>
                        <InputGroup>
                            <Input
                                type="number"
                                placeholder="Laboratoria (h)"
                                value={ state.ects }
                                onChange={ e => dispatch({ type: "ects", payload: e.target.value })}
                            />
                        </InputGroup>
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label>Egzamin:</Label>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                                <Input addon type="checkbox" checked={ state.exam } onChange={ e => dispatch({ type: "exam", payload: e.target.checked }) }/>
                            </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="Egzamin" value={ state.exam ? "TAK" : "NIE" } readOnly />
                        </InputGroup>
                    </FormGroup>
                </Col>
            </Row>
        </TabPane>
    );
}

export default CoursePanel;