import React, {useContext} from 'react';
import CanvasJSReact from "../lib/canvasjs.react";
import {userContext} from "../context/userContext";
import {Container, Table} from 'reactstrap';



const PlatformInfo = props => {
    let CanvasJSChart = CanvasJSReact.CanvasJSChart;
    let usageChart, committedChart;

    let xVal = 1;
    const updateInterval = 5000;
    const {fetchApi} = useContext(userContext);

    let memoryUsageData = []; // memory usage data points
    let memoryCommittedData = []; // memory committed data points

    const updateChart = async () => {
        const [result, isOk] = await fetchApi("/admin/platforminfo", {
            method: 'GET'
        })
        if(isOk) {
            setOS(result["os"]);
            setMemoryInit(result["memoryMap"]["init"]);
            setMemoryMax(result["memoryMap"]["max"]);

            memoryUsageData.push({x: xVal,y:result["memoryMap"]["used"]});
            memoryCommittedData.push({x: xVal,y:result["memoryMap"]["committed"]});
            xVal++;
            if (memoryUsageData.length >  10 ) {
                memoryUsageData.shift();
                memoryCommittedData.shift();
            }

            setThreadsData(result["threadList"].map((thread, idx) => {
                const {name, state, cpu_time} = thread;
                return (
                    <tr key={idx}>
                        <td>{name}</td>
                        <td>{state}</td>
                        <td>{cpu_time}</td>
                    </tr>
                )
            }));
        }
        if(usageChart !== undefined)
            usageChart.render();
        if(committedChart !== undefined)
            committedChart.render();

    }
    setInterval(updateChart, updateInterval);


    const chartOptionsUsage = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light1",
        title :{
            text: "Heap Memory used"
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
        data: [{
            type: "line",
            dataPoints : memoryUsageData
        }]
    }

    const chartOptionsCommited = {
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
        data: [{
            type: "line",
            dataPoints : memoryCommittedData
        }]
    }

    const [os, setOS] = React.useState("Unknown");
    const [memoryInit, setMemoryInit] = React.useState(0);
    const [memoryMax, setMemoryMax] = React.useState(0);
    const [threadsData, setThreadsData] = React.useState(0);

    return (
        <Container>
            <div>
                <h1>Informacje o platformie</h1>
            </div>
            <div>
                <h3>System: {os}</h3>
            </div>
            <div className='mt-5'>
                <h3>Pamięć</h3>
                <h4>Initial memory: {memoryInit}</h4>
                <h4>Max memory: {memoryMax}</h4>
                <CanvasJSChart options = {chartOptionsUsage}
                        onRef={ref => usageChart = ref}
                />
                <CanvasJSChart options = {chartOptionsCommited}
                               onRef={ref => committedChart = ref}
                />
            </div>
            <div className='mt-5'>
                <h3>Wątki</h3>
                <Table dark>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>State</th>
                        <th>CPU time</th>
                    </tr>
                    </thead>
                    <tbody>
                        {threadsData}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
}


export default PlatformInfo;