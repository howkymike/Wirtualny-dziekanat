import React, {useCallback, useContext, useEffect, useState } from 'react';
import {userContext} from "../context/userContext";
import ErrorBox from '../components/Error';
import { Container, Table} from 'reactstrap';
import {CanvasJSChart} from 'canvasjs-react-charts';
import Wrapper, { Header } from '../components/Wrapper';

let memoryUsageData = []; // memory usage data points
let memoryCommittedData = []; // memory committed data points

const genUsageData = () => ({
    animationEnabled: true,
    exportEnabled: true,
    theme: "light1",
    title :{
        text: "Heap Memory"
    },
    axisY: {
        title: "Memory",
        includeZero: false,
        suffix: "GB"
    },
    axisX: {
        title: "Time",
        suffix: "s"
    },
    toolTip: {
        shared: true
    },
    data: [
        {
            type: "line",
            name: "Memory usage",
            showInLegend: true,
            dataPoints : memoryUsageData
        },
        {
            type: "spline",
            name: "Memory committed",
            showInLegend: true,
            dataPoints : memoryCommittedData
        }]
});


const PlatformInfo = () => {
    let xVal = 1;
    const UPDATE_INTERVAL = 3000;
    const {fetchApi, setHeader} = useContext(userContext);
    const [error, setError] = useState([false, ""]);

    const [fetchResponse, setFetchResponse] = React.useState({
        memoryOptions: {},
        os: "unknown",
        memoryInit: 0,
        memoryMax: 0,
        threadsData: []
    });

    const {memoryOptions, os, memoryInit, memoryMax, threadsData} = fetchResponse;

    const fetchNewData = useCallback(async () => {
        try {
            setHeader("Platforma");

            const [result, isOk] = await fetchApi("/admin/platforminfo", {
                method: 'GET'
            })
            if(isOk) {
                memoryUsageData.push({x: xVal,y:result["memoryMap"]["used"]});
                memoryCommittedData.push({x: xVal,y:result["memoryMap"]["committed"]});
                xVal++;
                if (memoryUsageData.length >  10 ) {
                    memoryUsageData.shift();
                    memoryCommittedData.shift();
                }
                setFetchResponse({
                    memoryOptions: genUsageData(),
                    os: result["os"],
                    memoryInit: result["memoryMap"]["init"],
                    memoryMax: result["memoryMap"]["max"],
                    threadsData: result["threadList"]
                });
            }
        } catch(e) {
            setError([true, "Wyst??pi?? problem"]);
        }
    }, [fetchApi, xVal, setHeader]);


    useEffect(() => {
        fetchNewData().then();
        const interval = setInterval(() => fetchNewData(), UPDATE_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchNewData]);




    return (
        <Wrapper>
            <Header>System: {os}</Header>
            <Container style={{color: "black",fontSize: 20}}>
                <ErrorBox error={error} />
                <div className='mt-5 card' style={{background: "#ECEFF1"}}>
                    <div className='m-2'>
                    <div className='s'>Pami????</div>
                    <div color="primary">Initial memory: {memoryInit} GB</div>
                    <div>Max memory: {memoryMax} GB</div>
                    </div>
                    <div className='mt-2'>
                        <CanvasJSChart options = {memoryOptions}/>
                    </div>
                </div>
                <div className='mt-5 card' style={{background: "#B0BEC5"}}>
                    <div style={{fontSize: 30, background: "#ECEFF1"}}>
                        <p style={{margin: 8}}>W??tki</p>
                    </div>
                    <Table>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>State</th>
                            <th>CPU time</th>
                        </tr>
                        </thead>
                        <tbody>
                        { threadsData.map((thread,index) => (
                            <tr key={ index }>
                                <td>{index}</td>
                                <td>{thread['name']}</td>
                                <td>{thread['state']}</td>
                                <td>{thread['cpu_time']}</td>
                            </tr>
                        )) }
                        </tbody>
                    </Table>
                </div>

            </Container>
        </Wrapper>
    );
}


export default PlatformInfo;