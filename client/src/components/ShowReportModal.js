import React from 'react'

import {
    ModalBody, ModalFooter, ModalHeader,
    Button, FormGroup, Input, Row, Col
} from 'reactstrap'
import { Modal } from './Wrapper';

const ShowReportModal = (props) => {
    const { report, isOpen, toggle } = props;

    if (!isOpen || !report) return null;

    return (
        <Modal isOpen={isOpen}>
            <ModalHeader toggle={toggle}>
                {report.courseName}
            </ModalHeader>
            <ModalBody>
                <h5>Osoba zgłaszająca:</h5>
                <Row>
                    <Col><h6>Imię i nazwisko:</h6></Col>
                    <Col>{`${report.student.user.name}  ${report.student.user.surname}`}</Col>
                </Row>
                <Row>
                    <Col><h6>Indeks:</h6></Col>
                    <Col>{report.student.index}</Col>
                </Row>
                <Row>
                    <Col><h6>Email:</h6></Col>
                    <Col>{report.student.user.email}</Col>
                </Row>
                <hr/>
                <FormGroup>
                    <Input disabled type="textarea" rows={10} value={report.report.message} />
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button color={"danger"} onClick={toggle}>Zamknij</Button>
            </ModalFooter>
        </Modal>
    );
}

export default ShowReportModal;
