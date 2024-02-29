import React, {useState} from 'react';
import {Button, Form, Container, Row} from 'react-bootstrap';

import {BiUserCircle} from "react-icons/bi";
import {EmailService} from "../../api/service/member/EmailService";
import '../../css/login.css'

import {useNavigate} from "react-router-dom";
import {UserInfo} from "../../api/const/UserInfo";

const SignIn = ({} ) => {
    const navigate = useNavigate();

    const [onShowAlertMsg, setOnShowAlertMsg] = useState(false)

    const HandleReConfirmButton = async () => {
        const emailAuthRequest = {
            securityCode : "",
            authType : "SIGN_UP",
        }
        let result = await EmailService.sendSecurityCode(emailAuthRequest, localStorage.getItem(UserInfo.EMAIL));

        if (result) {
            alert('인증번호가 전송되었습니다.')
        }
    }

    const HandleConfirmButton = async () => {
        let formData = new FormData(document.getElementById('form'));
        let auth = {
            securityCode : formData.get('security'),
            authType : "SIGN_UP",
        }

        let result = await EmailService.confirmEmail(auth, localStorage.getItem(UserInfo.EMAIL));

        if (result) {
            alert('인증되었습니다.')
            navigate('/')
        }
    }

    return (
        <>
            {
                localStorage.getItem(UserInfo.ID) &&
                <Container className='mt-5' style={{width: "40%"}}>
                    <Row className='d-flex justify-content-center align-items-center'>
                        <BiUserCircle className='loginIcon'/>
                        <Form id='form'>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control name="security" placeholder="인증코드를 입력해주세요"/>
                            </Form.Group>

                            {
                                onShowAlertMsg &&
                                <div className="alert alert-danger mt-5" id="alert" role="alert">
                                    <h4 className="alert-heading">인증코드가 일치하지 않습니다. 다시 확인해주세요</h4>
                                    <hr/>
                                </div>
                            }

                            <Button onClick={HandleConfirmButton} className='my-3' variant='info' type='button'
                                    style={{width: "100%"}}>
                                인증
                            </Button>

                            <Button onClick={HandleReConfirmButton} className='my-3' variant='info' type='button'
                                    style={{width: "100%"}}>
                                인증번호 다시받기
                            </Button>
                        </Form>
                    </Row>
                </Container>
            }
        </>
    );
};

export default SignIn;
