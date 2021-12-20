import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import "./Widget.css"
import {Box} from "@mui/material";

export default function Widget() {
    const { jobUuid } = useParams();
    console.log(jobUuid);
    const [runnerIps, setRunnerIps] = useState([]);
    const [testsData, setTestsData] = useState({
        failures: 0,
        tests: 0,
        time: 0,
    });

    useEffect(() => {
        fetch(`/api/runners/${jobUuid}`)
            .then(response => response.json())
            .then(data => setRunnerIps(() => {
                console.log(data)
                return data;
            }))
    }, [jobUuid]);

    useEffect(() => {
        console.log("hit!!!")
        Promise.all(
            runnerIps.map(ip =>
                fetch(`/api/all-tests/${ip}`)
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        }
                    })
                    .then(data => setTestsData(prevState => {
                        console.log(prevState);
                        prevState.failures += data[0].failures;
                        prevState.tests += data[0].tests;
                        prevState.time += data[0].time;
                        console.log(prevState);
                        return prevState;
                    }))
                    .catch(err => console.error(err))
            )
        ).then(() => console.log('done'))
    }, [runnerIps])

    const passed = testsData.tests - testsData.failures;
    const failures = testsData.failures;
    const duration = testsData.time;

    const status = <span className={failures > 0 ? "status-failure" : "status-success"}>
        <i className="feather icon-check-circle"/>&nbsp;{failures > 0 ? failures +" Failures" : "Success"}
    </span>

    const sections = [];
    if(failures > 0) {
        sections.push(<div className="section failed-tests">
            <h5>Failed</h5>
            <hr />
            <h3 className="status-subtext">{failures}</h3>
        </div>)
    }
    if(passed > 0) {
        sections.push(<div className="section passed-tests">
            <h5>Passed</h5>
            <hr />
            <h3 className="status-subtext">{passed}</h3>
        </div>)
    }
    if(duration > 0) {
        sections.push(<div className="section duration">
            <h5>Duration</h5>
            <hr />
            <h3 className="status-subtext">{duration.toFixed(1)}s</h3>
        </div>)
    }

    if(sections.length === 0) {
        sections.push(<div className="section stopped-containers">
            <h5>No test results found</h5>
        </div>)
    }

    return <Box display="flex" flexDirection="column" padding="30px">
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
            <h5 className="topbar-text">JUnit Test Results</h5>
            {status}
        </Box>
        <Box display="flex" className="main-container">
            {sections}
        </Box>
    </Box>
}