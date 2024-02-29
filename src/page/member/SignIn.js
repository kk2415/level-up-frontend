import React, {useEffect, useLayoutEffect} from 'react';
import {Button, Form, Container, Row} from 'react-bootstrap';

import $ from 'jquery'

import {useNavigate} from 'react-router-dom'

import HorizonLine from "../../component/HorizonLine";
import { GoogleLogin } from 'react-google-login'
import {BiUserCircle} from "react-icons/bi";

import {Link} from "react-router-dom";
import {MemberService} from "../../api/service/member/MemberService";
import '../../css/login.css'
import {loginMemberValidation as validation} from '../../api/Validation'
import {LogInService} from "../../api/service/member/LogInService";

const SignIn = ({} ) => {
    const navigate = useNavigate();

    async function HandleSignInButton() {
        let formData = new FormData(document.getElementById('signInForm'));
        let member = {
            email : formData.get('email'),
            password : formData.get('password'),
        }

        if (validate(member)) {
            let result = await LogInService.signIn(member);

            if (result) {
                navigate('/', true)
            }
        }
    }

    const validate = (member) => {
        let valid = true;

        removeAlertMassageBox()
        if (!validation.email.test(member.email) || member.email === null) {
            $('#alert').append('<h5>[이매일] : 유효한 이메일 형식이 아닙니다.</h5>')
            valid = false;
        }
        if (!validation.password.test(member.password) || member.password === null) {
            $('#alert').append('<h5>[비밀번호] : 비밀번호는 8자리이상 24이하, 영문자/숫자만 및 특수문자만 입력하세요</h5>')
            valid = false;
        }

        if (!valid) {
            showAlertMassageBox()
        }
        return valid
    }

    const enterKeyEventHandler = async (event) => {
        if (event.keyCode === 13) {
            await HandleSignInButton()
        }
    }

    const removeAlertMassageBox = () => {
        $('#alert').children('h5').remove();
    }

    const showAlertMassageBox = () => {
        $('#alert').css('display', 'block')
    }

    const hideAlertMassageBox = () => {
        $('#alert').css('display', 'none')
    }

    useEffect(() => {
        hideAlertMassageBox()
    }, [])

    return (
        <Container className='mt-5' style={{width: '100%'}}>
            <Row className='d-flex justify-content-center align-items-center'>
                <BiUserCircle className='loginIcon' />
            </Row>
            <Row className='d-flex justify-content-center align-items-center'>
                <Form style={{width: '40%', marginTop: 10}} id='signInForm'>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control onKeyDown={enterKeyEventHandler} name="email" type="email" placeholder="이메일을 입력해주세요" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control onKeyDown={enterKeyEventHandler} name="password" type="password" placeholder="비밀번호를 입력해주세요" />
                    </Form.Group>

                    <div className="alert alert-danger mt-5" id="alert" role="alert">
                        <h4 className="alert-heading">입력한 정보에 문제가 있네요!</h4>
                        <hr/>
                    </div>

                    <Form.Group>
                        <Button style={{width: '100%'}} onClick={HandleSignInButton} className='my-3 btn-primary' type='button' >
                            로그인
                        </Button>
                    </Form.Group>

                    <HorizonLine text={"OR"} />
                    {/*<div style={{width: '100%'}}>*/}
                    {/*    <GoogleLogin*/}
                    {/*        render={renderProps=>{*/}
                    {/*            return (*/}
                    {/*                <Button*/}
                    {/*                    onClick={renderProps.onClick}*/}
                    {/*                    disabled={renderProps.disabled}*/}
                    {/*                    style={{*/}
                    {/*                        backgroundColor: "#176BEF",*/}
                    {/*                        borderColor: "#176BEF"*/}
                    {/*                    }}*/}
                    {/*                >*/}
                    {/*                    <i className='fab fa-google'/>&nbsp; Sign In with Google*/}
                    {/*                </Button>*/}
                    {/*            )*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*</div>*/}

                    <div className='d-flex justify-content-center align-items-center'>
                        <div className='text-left mt-3'>
                            <Link to="/signup"><small className='reset mx-2'>회원가입</small></Link>
                            ||
                            <Link to="/finding-password"><small className='reset mx-2'>비밀번호 찾기</small></Link>
                        </div>
                    </div>
                </Form>
            </Row>
        </Container>
    );
};

export default SignIn;
