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
            <Navbar bg="dark" variant="dark">
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
                                    <LinkContainer to="/portfolio">
                                        <Nav.Link>
                                            Portfolio
                                        </Nav.Link>
                                    </LinkContainer>

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

                                    <NavDropdown title="Maintainance" menuVariant="dark">
                                        <NavDropdown.Item>
                                            <LinkContainer to="/maintainance/asset">
                                                <Nav.Link>
                                                    Asset
                                                </Nav.Link>
                                            </LinkContainer>
                                        </NavDropdown.Item>
                                        <NavDropdown.Item>
                                            <LinkContainer to="/maintaince/prices">
                                                <Nav.Link>
                                                    Asset Prices
                                                </Nav.Link>
                                            </LinkContainer>
                                        </NavDropdown.Item>
                                    </NavDropdown>
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