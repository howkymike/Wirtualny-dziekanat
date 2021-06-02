import React, { useEffect, useState, useContext } from 'react'

import { Input, InputGroup, InputGroupAddon, InputGroupText, Row, Table, Col } from 'reactstrap'
import styled from 'styled-components'

import { userContext } from '../context/userContext'

import Wrapper, { Header } from '../components/Wrapper'
import ShowReportModal from '../components/ShowReportModal'

const StyledTr = styled.tr`
    &:hover{
        cursor: pointer;
    }
`

const FiltersContainer = styled.div`
    padding: 1em;
`

const Reports = (props) => {

    const { fetchApi, setHeader } = useContext(userContext);

    const [isLoading, setIsLoading] = useState(true);
    const [reports, setReports] = useState([]);
    const [showReports, setShowReports] = useState([]);
    const [report, showReport] = useState(null);
    const [filter, setFilter] = useState(false);

    useEffect(() => {
        fetchApi("/gradeReports").then(res => {
            if (res[1]) {
                setReports(res[0].sort((a, b) => new Date(b.report.sendDate) - new Date(a.report.sendDate)));
                setIsLoading(false)
                console.log(res[0]);
            }
        });

        setHeader("Zgłoszenia")
    }, [fetchApi, setHeader])

    useEffect(() => {
        if (filter) {
            setShowReports(reports.filter(value => !value.report.read));
        } else {
            setShowReports(reports);
        }
    }, [reports, filter])

    const onReportOpen = (key) => {
        // mark report as read
        const report = reports[key].report;
        if (!report.isRead) {
            fetchApi(`/gradeReports/${report.id}/read`, {
                method: 'PUT'
            }).then(res => {
                if (res[1]) {
                    if (res[0].ok) {
                        let newReports = reports.slice();
                        newReports[key].report.read = true;
                        setReports(newReports);
                    }
                }
            });
        }

        showReport(reports[key]);
    }

    return (
        <Wrapper>
            <Header>Lista zgłoszeń</Header>
            <FiltersContainer>
                <Row>
                    <Col sm={{ size: 'auto', offset: 0 }}>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <Input addon type="checkbox" onClick={(e) => setFilter(!filter)} />
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="Pokaż nie odebrane" disabled />
                        </InputGroup>
                    </Col>
                </Row>
            </FiltersContainer>
            <Table striped hover responsive>
                <thead>
                    <tr>
                        <td>#</td>
                        <td>Nadawca:</td>
                        <td>Index:</td>
                        <td>Kurs:</td>
                        <td>Otrzymano:</td>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? "loading" :
                        showReports.map((report, key) => (
                            <StyledTr key={key} onClick={() => onReportOpen(key)} style={report.report.read ? {} : { fontWeight: 'bold' }}>
                                <td>{key + 1}</td>
                                <td>{`${report.student.user.name}  ${report.student.user.surname}`}</td>
                                <td>{report.student.index}</td>
                                <td>{report.courseName}</td>
                                <td>{(() => {
                                    const date = new Date(report.report.sendDate);
                                    return `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}`;
                                })()}</td>
                            </StyledTr>
                        ))
                    }
                </tbody>
            </Table>

            <ShowReportModal
                isOpen={report !== null}
                toggle={() => showReport(null)}
                report={report}
            />
        </Wrapper>
    )
}

export default Reports;
