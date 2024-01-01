import { useSSRSafeId } from "@react-aria/ssr"
import React, { useContext, useState } from "react"
import { Button, Form, FormControl } from "react-bootstrap"
import UserContext from "../../context/UserContext"
import financeDataApi from "../../utils/finance-data-api"

const AIInvestments = () => {

    const userContext = useContext(UserContext)

    const [trainQuery, setTrainQuery] = useState({})
    const [resultQuery, setResultQuery] = useState({})

    const [result, setResult] = useState(null)

    function handleTrainQuery(event){
        let currQuery = trainQuery;
        currQuery[event.target.name] = event.target.value;
        setTrainQuery({...currQuery});
    }

    function handleResultQuery(event){
        let currQuery = resultQuery;
        currQuery[event.target.name] = event.target.value;
        setResultQuery({...currQuery});
    }

    function handleTrain(){
        financeDataApi.trainInvestmentAI(trainQuery, userContext.integrationToken).then((data) => {
            
        })   
    }

    function handleResult(){
        financeDataApi.getAIResultData(resultQuery, userContext.integrationToken).then((data) => {
            setResult(data.result)
        })
    }

    return (
        <div className='control'>
            <div className="card">
                <div className="title">
                    A.I. Investments
                </div>
            </div>
            <div className="card">
                <div className="me-2 title">
                    Result
                </div>
                <Form className="d-flex">
                    <div className='center'>
                        <div className='w-50'>
                            Symbol
                        </div>
                        <FormControl className="me-2" name="symbol" type="text" value={resultQuery.symbol} onChange={handleResultQuery} />
                    </div>
                </Form>
                <div className='center'>
                    <Button variant="outline-primary" onClick={handleResult}>
                        Result
                    </Button>
                </div>
                <div className="value-section me-2">
                    <div className="info-text">
                        Result
                    </div>
                    <div className="value-text">
                        {(result * 1.0)?.toFixed(2) }
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="me-2 title">
                    Training
                </div>
                <Form className="d-flex">
                    <div className='center'>
                        <div className='w-50'>
                            Symbol
                        </div>
                        <FormControl className="me-2" name="symbol" type="text" value={trainQuery.symbol} onChange={handleTrainQuery} />
                    </div>
                    <div className='center'>
                        <div className='w-50'>
                            Expected Result
                        </div>
                        <FormControl className="me-2" name="is_good_investment" type="text" value={trainQuery.is_good_investment} onChange={handleTrainQuery} />
                    </div>
                </Form>
                <div className='center'>
                    <Button variant="outline-primary" onClick={handleTrain}>
                        Train
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AIInvestments