import React, { useContext } from 'react';
import { Navbar, Nav, NavDropdown, Container, Button, Form, FormControl } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import logo from "../finance_logo.png";
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router';
import InputText from './InputText';

const Header = () => {

    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    function logout() {
        userContext.setUser("");
        userContext.setToken("");
        userContext.removeCookies("token");
        userContext.removeCookies("user");
        navigate("/login");
    }

    function goToLogin() {
        navigate("/login");
    }

    function handleDate(event) {
        userContext.switchDate(event.target.value);
    }



    return userContext.showHeader ? (
            <Navbar className={ (userContext.mobileSize() && "value-header") + " navbar-custom"} variant='dark'>
                <Container>
                    <LinkContainer to="#/home">
                        <Navbar.Brand>
                                <img
                                alt=""
                                src={logo}
                                width="124"
                                height="48"
                                className="d-inline-block align-top"
                                />{' '}
                        </Navbar.Brand> 
                    </LinkContainer>
                    {
                        userContext.token !== "" ? (
                            <>
                                <Nav className="me-auto">
                                    {
                                        userContext.mobileSize() ? (
                                            <NavDropdown title="Items" menuVariant="dark">
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/portfolio">
                                                            <Nav.Link>
                                                            Portfolio
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/portfolio/realtime-portfolio">
                                                            <Nav.Link>
                                                            Real-time
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/portfolio/investment-division">
                                                            <Nav.Link>
                                                            Investment Division
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>

                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/analysis/asset-risk">
                                                            <Nav.Link>
                                                                Asset Risk
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/analysis/portfolio-risk">
                                                            <Nav.Link>
                                                                Portfolio Risk
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/analysis/fundamentalist-data">
                                                            <Nav.Link>
                                                                Fundamentalist Data
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/analysis/imobiliary-funds-oportunities">
                                                            <Nav.Link>
                                                                Imobiliary Fund Oportunities
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/analysis/stocks-oportunities">
                                                            <Nav.Link>
                                                                Stocks Oportunities
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/analysis/dividend-map">
                                                            <Nav.Link>
                                                                Dividend Map
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/analysis/dividends-received">
                                                            <Nav.Link>
                                                                Dividends Received
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/analysis/income-tax-report">
                                                            <Nav.Link>
                                                                Income Tax
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/analysis/exchange-rates">
                                                            <Nav.Link>
                                                                Exchange Rates
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>

                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/management/asset-selection">
                                                            <Nav.Link>
                                                                Asset Selection
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/management/orders">
                                                            <Nav.Link>
                                                                Orders
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/projection/dividends">
                                                            <Nav.Link>
                                                                Dividends
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/projection/asset-composition">
                                                            <Nav.Link>
                                                                Asset Composition
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/projection/prices">
                                                            <Nav.Link>
                                                                Prices
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/maintainance/asset">
                                                            <Nav.Link>
                                                                Asset
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/maintainance/economic-index">
                                                            <Nav.Link>
                                                                Economic Indexes
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/maintainance/asset-prices">
                                                            <Nav.Link>
                                                                Asset Prices
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/maintainance/asset-types">
                                                            <Nav.Link>
                                                                Asset Types
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/maintainance/sectors">
                                                            <Nav.Link>
                                                                Sectors
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/maintainance/receivables">
                                                            <Nav.Link>
                                                                Receivables
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/maintainance/receivable-types">
                                                            <Nav.Link>
                                                                Receivable Types
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/maintainance/currencies">
                                                            <Nav.Link>
                                                                Currencies
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/ai/investments">
                                                            <Nav.Link>
                                                                Investments
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                            </NavDropdown>
                                        ) : (
                                            <>
                                                <NavDropdown title="Portfolios" menuVariant="dark">
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/portfolio">
                                                            <Nav.Link>
                                                            Portfolio
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/portfolio/realtime-portfolio">
                                                            <Nav.Link>
                                                            Real-time
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/portfolio/investment-division">
                                                            <Nav.Link>
                                                            Investment Division
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                </NavDropdown>


                                                <NavDropdown title="Analysis" menuVariant="dark">
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/analysis/asset-risk">
                                                            <Nav.Link>
                                                                Asset Risk
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/analysis/portfolio-risk">
                                                            <Nav.Link>
                                                                Portfolio Risk
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/analysis/fundamentalist-data">
                                                            <Nav.Link>
                                                                Fundamentalist Data
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/analysis/imobiliary-funds-oportunities">
                                                            <Nav.Link>
                                                                Imobiliary Fund Oportunities
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/analysis/stocks-oportunities">
                                                            <Nav.Link>
                                                                Stocks Oportunities
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/analysis/dividend-map">
                                                            <Nav.Link>
                                                                Dividend Map
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/analysis/dividends-received">
                                                            <Nav.Link>
                                                                Dividends Received
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/analysis/income-tax-report">
                                                            <Nav.Link>
                                                                Income Tax
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/analysis/exchange-rates">
                                                            <Nav.Link>
                                                                Exchange Rates
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                </NavDropdown>

                                                <NavDropdown title="Management" menuVariant="dark">
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/management/asset-selection">
                                                            <Nav.Link>
                                                                Asset Selection
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/management/orders">
                                                            <Nav.Link>
                                                                Orders
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                </NavDropdown>
                                                <NavDropdown title="Projection" menuVariant="dark"> 
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/projection/dividends">
                                                            <Nav.Link>
                                                                Dividends
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/projection/asset-composition">
                                                            <Nav.Link>
                                                                Asset Composition
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/projection/prices">
                                                            <Nav.Link>
                                                                Prices
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/projection/portfolio-dividend-growth">
                                                            <Nav.Link>
                                                                Portfolio Dividend Growth
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                </NavDropdown>
                                                <NavDropdown title="Maintainance" menuVariant="dark">
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/maintainance/asset">
                                                            <Nav.Link>
                                                                Asset
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/maintainance/asset-prices">
                                                            <Nav.Link>
                                                                Asset Prices
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/maintainance/economic-index">
                                                            <Nav.Link>
                                                                Economic Indexes
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/maintainance/asset-types">
                                                            <Nav.Link>
                                                                Asset Types
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/maintainance/sectors">
                                                            <Nav.Link>
                                                                Sectors
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/maintainance/receivables">
                                                            <Nav.Link>
                                                                Receivables
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/maintainance/receivable-types">
                                                            <Nav.Link>
                                                                Receivable Types
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/maintainance/currencies">
                                                            <Nav.Link>
                                                                Currencies
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                </NavDropdown>
                                                <NavDropdown title="A.I." menuVariant="dark">
                                                    <NavDropdown.Item>
                                                        <LinkContainer to="/ai/investments">
                                                            <Nav.Link>
                                                                Investments
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </NavDropdown.Item>
                                                </NavDropdown>
                                            </>
                                        )
                                    }
                                </Nav>
                                <Nav>
                                    <Form className="d-flex">
                                        <FormControl className="me-2" type="date" value={userContext.date} onChange={handleDate} />
                                    </Form>
                                    <Button variant="outline-danger" onClick={logout}>Log out</Button>
                                </Nav>
                            </>
                        ) : (
                            <>
                                <Nav className="me-auto">
                                        <LinkContainer to="/home">
                                            <Nav.Link>
                                                home
                                            </Nav.Link>
                                        </LinkContainer>
                                </Nav>
                                <Nav>
                                    <Form className="d-flex">
                                        <Button variant="outline-warning" onClick={goToLogin}>Log in</Button>
                                    </Form>
                                </Nav>
                            </>
                        )
                    }
                </Container>
            </Navbar>
        ) : (
            <>
            </>
        )
}

export default Header;