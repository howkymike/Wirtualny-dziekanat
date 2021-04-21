import React, {useContext, useEffect} from 'react';
import {userContext} from "../context/userContext";
import { Container, Table} from 'reactstrap';
import {CanvasJSChart} from 'canvasjs-react-charts'

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
const genCommitedData = () => ({
    animationEnabled: true,
    exportEnabled: true,
    theme: "light2",
    title :{
        text: "Heap Memory commited"
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
    data: [
        {
            type: "spline",
            name: "2016",
            dataPoints : memoryCommittedData
        },
        {
            type: "spline",
            name: "2016",
            dataPoints : memoryUsageData
        }
    ]
});


const PlatformInfo = () => {
    let xVal = 1;
    const updateInterval = 3000;
    const {fetchApi} = useContext(userContext);

    const [fetchResponse, setFetchResponse] = React.useState({
        memoryUsedOptions: [],
        memoryCommitedOptions: [],
        os: "unknown",
        memoryInit: 0,
        memoryMax: 0,
        threadsData: []
    });

    const {memoryUsedOptions, memoryCommitedOptions, os, memoryInit, memoryMax, threadsData} = fetchResponse;

    const fetchNewData = async () => {
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
                memoryUsedOptions: genUsageData(),
                memoryCommitedOptions: genCommitedData(),
                os: result["os"],
                memoryInit: result["memoryMap"]["init"],
                memoryMax: result["memoryMap"]["max"],
                threadsData: result["threadList"]
            });
        }
    }


    useEffect(() => {
        const interval = setInterval(() => fetchNewData(), updateInterval)
        fetchNewData();
        return () => clearInterval(interval)
    }, [])




    return (
    <Container style={{color: "black",fontSize: 20}}>
        <div className='card'>
            <h3 className='m-2'>System: {os}</h3>
        </div>
        <div className='mt-5 card' style={{background: "#ECEFF1"}}>
            <div className='m-2'>
            <div className='s'>Pamięć</div>
            <div color="primary">Initial memory: {memoryInit} GB</div>
            <div>Max memory: {memoryMax} GB</div>
            </div>
            <div>
                <CanvasJSChart options = {memoryUsedOptions}/>
            </div>
        </div>
        <div className='mt-5 card' style={{background: "#B0BEC5"}}>
            <div style={{fontSize: 40, background: "#ECEFF1"}}>
                <p style={{margin: 8}}>Wątki</p>
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
                        <td>{thread.name}</td>
                        <td>{thread.state}</td>
                        <td>{thread.cpu_time}</td>
                    </tr>
                )) }
                </tbody>
            </Table>
        </div>
    </Container>
    );
}


export default PlatformInfo;