import './App.css';
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Box from '@mui/material/Box';
import {Button, Typography} from "@mui/material";

function Tests() {
    const [failedTestData, setFailedTestData] = useState([]);
    const [testsData, setTestsData] = useState({})
    let { fileName } = useParams();

    useEffect(() => {
        (async function() {
            await fetch(`/api/tests/${fileName}`)
                .then(response => response.json())
                .then(data => setTestsData(data))
            await fetch(`/api/failed-tests/${fileName}`)
                .then(response => response.json())
                .then(data => setFailedTestData(data))
        })()
    }, [fileName])

    let passed = testsData.tests - testsData.failures

    return (
        <div className="Tests">
            <header className="App-header">
                <Box margin={3} maxWidth='100vw'>
                    {
                        testsData ? <>
                            <Box margin={3} display="flex" flexDirection="row">
                                <Box display="flex" width="25vw"/>
                                <Box
                                    display="flex"
                                    flexGrow={1}
                                    justifyContent="center"
                                    flexDirection="row"
                                >
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        sx={{
                                            width: 300,
                                            height: 150,
                                            backgroundColor: '#258271',
                                            borderRadius: 5
                                        }}
                                    >
                                        <Typography style={{color: "#FFFFFF"}} variant="h4">
                                            Passed: {passed}
                                        </Typography>
                                    </Box>
                                    <Box
                                        marginLeft={5}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        sx={{
                                            width: 300,
                                            height: 150,
                                            backgroundColor: '#C65858',
                                            borderRadius: 5
                                        }}
                                    >
                                        <Typography style={{color: "#FFFFFF"}} variant="h4">
                                            Failures: {testsData.failures}
                                        </Typography>
                                    </Box>
                                    <Box
                                        marginLeft={5}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        sx={{
                                            width: 300,
                                            height: 150,
                                            backgroundColor: '#9e9e9e',
                                            borderRadius: 5
                                        }}
                                    >
                                        <Typography style={{color: "#FFFFFF"}} variant="h4">
                                            Duration: {testsData.time}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" width="25vw"/>
                            </Box>
                            <Box display="flex" flexDirection="column" justifyContent="center" paddingX={3} >
                                {failedTestData.map(data => {
                                    return(
                                        <Box
                                            key={data.id}
                                            margin={2}
                                            display="flex"
                                            flexDirection="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            padding={3}
                                            sx={{
                                                border: 1,
                                                borderLeft: 10,
                                                borderColor: '#C65858'
                                            }}
                                        >
                                            <Box display="flex" width="25%">
                                                <Typography>
                                                    {data.text}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" width="25%" justifyContent="right">
                                                <Button
                                                    variant="outlined"
                                                    style={{
                                                        color: '#C65858',
                                                        borderColor: '#C65858',
                                                        textTransform: "none"
                                                    }}
                                                    href={`/stdout/${fileName}/${data.id}`}
                                                >
                                                    View stdout
                                                </Button>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </> : null
                    }
                </Box>
                <p>
                    Full JUnit XML report: <a href={`/xml/${fileName}`}>{fileName}</a>
                </p>
            </header>
        </div>
    );
}

export default Tests;
