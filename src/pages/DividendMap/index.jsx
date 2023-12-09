import React, { useState } from 'react';
import { useContext } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { MessageHolder } from '../../components';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';
import './styles.css';


const DividendMap = () => {

    const userContext = useContext(UserContext);

    const API_KEY = userContext.integrationToken;

    const [dividendList, setDividendList] = useState([]);
    const [filledDividendMonths, setFilledDividendMonths] = useState([]);

    const [queryValues, setQueryValues] = useState({
        symbol: ""
    });

    const [screenData, setScreenData] = useState({
        dividendMoney: 0.0
    })

    function handleGetDividends() {
        financeDataApi.getDividendsData(queryValues, API_KEY).then((data) => {
            let dividendArray = [...dividendList,...data]
            dividendArray = dividendArray.sort((a,b) => {
                let firstDate = new Date(a?.comDate.split("/").reverse().join("/"))
                let secondDate = new Date(b?.comDate.split("/").reverse().join("/"))
                return firstDate > secondDate ? -1 : 1
            })
            setDividendList([...dividendArray])
            let lastYearDividends = dividendArray.filter((value) => value?.comDate?.split("/")[2] == '2022')
            let newDividendMonths = lastYearDividends.map((value) => value?.comDate?.split("/")[1])
            setFilledDividendMonths([...newDividendMonths.filter((value, index,array) => array.indexOf(value) === index)])
            setScreenData({
                dividendMoney: lastYearDividends.reduce(((prevValue, nextValue) => prevValue += nextValue?.value * 1),0.0)
            })
        });
    }

    function handleImportDividends() {
        financeDataApi.importDividends(queryValues, API_KEY).then((data) => {
            userContext.setMessages([
                ...userContext.messages,
                {
                    type: 'success',
                    value: "Dividends for " + queryValues.symbol + " imported succesfully!"
                }
            ]);
        }).catch((err) => {userContext.handleError(err)});
    }

    return (
        <div className="control">
            <MessageHolder/>
            <div className={"card dividend-form " + ( userContext.mobileSize() && "value-header" )}>
                <div className="title">Dividends Map</div>
                <Form className="d-flex">
                    <FormControl
                    type="text"
                    placeholder="Symbol"
                    className="me-2"
                    aria-label="Symbol"
                    onChange={(event) => { setQueryValues({...queryValues, symbol: event.target.value}) }}
                    />
                    <Button variant="outline-success" onClick={handleGetDividends}>Get Dividends</Button>
                    <Button variant="outline-success" onClick={handleImportDividends}>Import Dividends</Button>
                </Form>
            </div>
            <div className="card">
                Total Dividends: {screenData?.dividendMoney}
            </div>
            <div className="card">
                Filled Months: {filledDividendMonths.map((value, index) => (<div class="card">{value}</div>))}
            </div>
            <div className="card">
                <table className={ userContext.mobileSize() && "small" }>
                    <thead>
                        <td>Date</td>
                        <td>Asset</td>
                        <td>COM Date</td>
                        <td>Payment Date</td>
                        <td>Value</td>
                    </thead>
                    <tbody>
                        {dividendList.map((item, index) => {
                            return(
                                <tr key={index}>
                                    <td>{item?.assetName}</td>
                                    <td>{item?.type}</td>
                                    <td>{item.comDate}</td>
                                    <td>{item.paymentDate}</td>
                                    <td>{item.value}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DividendMap;