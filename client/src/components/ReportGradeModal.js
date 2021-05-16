import React, { useContext, useEffect, useState } from 'react';

import { Alert, FormGroup, Input, Modal, ModalBody, ModalFooter, Button, ModalHeader, Label, FormFeedback } from 'reactstrap';

import { userContext } from '../context/userContext';

const ReportGradeModal = (props) => {

    const { fetchApi } = useContext(userContext);
    const { course, isOpen, toggle } = props;

    const [message, setMessage] = useState("");
    const [lecturer, setLecturer] = useState(0);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [invalidMessage, setInvalidMessage] = useState(false);
    const [invalidLecturer, setInvalidLecturer] = useState(false);

    useEffect(() => {
        setMessage("");
        setAlertMsg("");
        setAlertType("");
        setLecturer(0);
        setInvalidMessage(false);
        setInvalidLecturer(false);
    }, [course])

    const validate = () => {
        let isOk = true;

        const courseLecturer = course.courseLecturers[lecturer];
        if (courseLecturer === undefined) {
            setInvalidLecturer(true);
            isOk = false;
        }

        if (message.length === 0) {
            setInvalidMessage(true);
            isOk = false;
        }

        return isOk;
    }

    const sendReport = () => {
        if(!validate()){
            return;
        }

        console.log({
            message: message,
            sendToId: course.courseLecturers[lecturer].id
        })

        fetchApi(`/gradeReports/${course.id}`, {
            method: 'POST',
            body: JSON.stringify({
                message: message,
                lecturerId: course.courseLecturers[lecturer].id
            })
        }).then(res => {
            if (res[1] && toggle) {
                toggle();
            } else {
                setAlertType("danger");
                setAlertMsg(res[0].msg);
            }
        });
    }

    if (!isOpen) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                {course.name}
            </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label>Wyslij do:</Label>
                    <Input invalid={invalidLecturer} type="select" onChange={e => { setLecturer(e.target.value); setInvalidLecturer(false) }}>
                        {course.courseLecturers.map((lecturer, key) => (
                            <option key={key} value={key}>{lecturer.title} {lecturer.user.name} {lecturer.user.surname}</option>
                        ))}
                    </Input>
                    <FormFeedback>Niepoprawny wybor!</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label>Wiadomosc:</Label>
                    <Input
                        invalid={invalidMessage}
                        type="textarea" rows={10}
                        placeholder="Wpisz wiadomosc tutaj."
                        onChange={e => { setMessage(e.target.value); setInvalidMessage(false) }}
                    />
                    <FormFeedback>To pole nie moze byc puste!</FormFeedback>
                </FormGroup>
                <Alert color={alertType} isOpen={alertMsg !== ""} toggle={() => setAlertMsg("")}>{alertMsg}</Alert>
            </ModalBody>
            <ModalFooter>
                <Button color="success" onClick={() => sendReport()}>Wyslij</Button>
                <Button color="danger" onClick={toggle}>Anuluj</Button>
            </ModalFooter>
        </Modal>
    );
};

export default ReportGradeModal;
