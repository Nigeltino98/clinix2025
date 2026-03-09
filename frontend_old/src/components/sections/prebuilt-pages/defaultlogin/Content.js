import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, InputGroup, Button, Modal } from 'react-bootstrap';
import { authActions } from '../../../../store/auth'
import { useDispatch } from 'react-redux'
import { getToken } from '../../../../api/api'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getApi } from '../../../../api/api'

const Content = () => {
    const dispatch = useDispatch()
    const token = useSelector((state) => state.auth.token).token
    const isLoggedIn = useSelector((state) => state.auth.loggedin)
    const [validated, setValidated] = useState(false);
    const [passwordType, setPasswordType] = useState("password")

    const [show_privacy, setShowPrivacy] = useState(false)
    const [state, setState] = useState({
        email: '',
        password: ''
    });

    const handlePrivacyClose = () => {
        setShowPrivacy(false)
    }

    const handlePrivacyShow = () => {
        setShowPrivacy(true)
    }

    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text")
            return;
        }
        setPasswordType("password")
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            getToken(response => {
                dispatch(authActions.setToken(response.data))
                dispatch(authActions.login())
            },
                `/api/token/`, state)
        }
        setValidated(true);
    };
    const handeChange = (event) => {
        switch (event.target.name) {

            case 'email':
                setState({
                    ...state,
                    email: event.target.value
                })
                break;
            case 'password':
                setState({
                    ...state,
                    password: event.target.value
                })
                break;
            default:
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            getApi(response => { dispatch(authActions.setUser(response.data)) }, token, "/api/me")
        }
    }, [dispatch, token, isLoggedIn])

    return (
        <>
            {!isLoggedIn ? (
                <div
                    className="ms-content-wrapper ms-auth"
                    style={{
                        backgroundImage: "url('/images/backgroundAI.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        //backgroundRepeat: "no-repeat",
                        minHeight: "150vh",
                        display: "flex",
                        flexDirection: "column",
                        //alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "10px 20px",
                            width: "100%",
                            textAlign: "left",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            position: "relative"
                        }}
                    >
                        <img
                            src="/images/Seacole%20logo.png"
                            alt="Seacole Healthcare"
                            style={{height: "50px", position: "absolute", left:"20px"}}
                        />
                        <h2 style={{textAlign: "center" }}>SEACOLE HEALTHCARE</h2>
                    </div>
                    <div
                        className="ms-auth-container"
                        style={{
                            backgroundColor: "rgb(159,222,149, 0.7pytrhon)",
                            padding: "30px 40px",
                            borderRadius: "8px",
                            maxWidth: "900px", // Increased width
                            width: "100%",
                            minHeight: "400px", // Reduced height
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignSelf: "center",
                            margin: "0px auto",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        }}
                    >
                        <div className="ms-auth-form">
                            <Form noValidate validated={validated} onSubmit={handleSubmit} autoComplete="off">
                                <h1 className="text-center">CLINIX</h1>
                                <p className="text-center">
                                    24 Hour support for vulnerable adults with complex needs in supported accommodation.
                                </p>
                                <p>Please enter your email and password to continue</p>

                                <Form.Group className="mb-3" controlId="validationCustom01">
                                    <Form.Label>Email Address</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            name="email"
                                            onChange={handeChange}
                                            required
                                            type="email"
                                            value={state.email}
                                            placeholder="Email Address"
                                        />
                                        <Form.Control.Feedback type="invalid"> Please provide a valid
                                            email.</Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-5" controlId="validationCustom02">
                                    <Form.Label>Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            name="password"
                                            autoComplete="off"
                                            onChange={handeChange}
                                            required
                                            type={passwordType}
                                            value={state.password}
                                            placeholder="Password"
                                        />
                                        <InputGroup.Text onClick={togglePassword}>
                                            <i className={passwordType === "text" ? 'fas fa-eye ms-text-primary' : 'fas fa-eye-slash ms-text-primary'}/>
                                        </InputGroup.Text>
                                        <Form.Control.Feedback type="invalid"> Please provide a
                                            password.</Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group controlId="validationCustom03">
                                    <Form.Check type="checkbox" id="checkbox">
                                        <Form.Check.Input type="checkbox" required/>
                                        <div
                                            style={{
                                                backgroundColor: 'rgb(255,255,255)',
                                                padding: '20px 20px',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                color: '#333',
                                                lineHeight: '1.6',
                                                maxWidth: '100%',
                                                maxHeight: '180px',
                                                overflowY: 'auto',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                marginTop: '10px'
                                            }}
                                        >
                                            <Form.Check.Label>
                                                We take your privacy seriously and will only use your personal
                                                information to administer your
                                                account and to provide information on the services you have requested
                                                from us, or that will be
                                                of a legitimate interest to you and your business. Users are to abide by
                                                organisational
                                                parameters as far as data sharing is concerned. We will never sell,
                                                share, or use your personal
                                                information other than as described in our
                                                <Link to="/login" onClick={handlePrivacyShow}> privacy policy</Link>.
                                            </Form.Check.Label>
                                        </div>
                                        <Form.Control.Feedback type="invalid">
                                            Please agree to the Terms and conditions.
                                        </Form.Control.Feedback>
                                    </Form.Check>
                                </Form.Group>

                                <Button type="submit" className="mt-4 d-block w-100">Sign In</Button>

                                <p className="mb-0 mt-3 text-center">Lost password? <Link className="btn-link"
                                                                                          to="/password-reset-email">Reset
                                    Password</Link></p>
                            </Form>
                        </div>
                    </div>

                    <Modal show={show_privacy} className="ms-modal-dialog-width ms-modal-content-width"
                           onHide={handlePrivacyClose} centered>
                        <Modal.Header className="ms-modal-header-radius-0">
                            <h3>Privacy Page</h3>
                            <button type="button" className="close text-white" onClick={handlePrivacyClose}>x</button>
                        </Modal.Header>
                        <Modal.Body className="p-0 text-left">
                            <p className='p-3'>
                                We take your privacy seriously and will only use your personal
                                information to administer your account and to provide information on
                                the services you have requested from us, or that will be of a legitimate
                                interest to you and your business. Users are to abide by organisational
                                parameters as far as data sharing is concerned. We will never sell, share,
                                or use your personal information other than as described in our.
                            </p>
                        </Modal.Body>
                    </Modal>
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "10px 20px",
                            width: "100%",
                            textAlign: "center",
                            boxShadow: "0 -2px 5px rgba(0,0,0,0.1)"
                        }}
                    >
                        <p style={{margin: 0, fontWeight: "bold"}}>
                            Gateway to Community Integration
                        </p>
                    </div>
                </div>


            ) : (
                <Redirect exact from="login" to="/"/>
            )}
        </>
    );
}

export default Content;