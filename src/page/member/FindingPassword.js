import React, {useEffect, useState} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";

import {createMemberValidation as validation} from '../../api/Validation'

import $ from 'jquery'

import HorizonLine from "../../component/HorizonLine";
import {EmailService} from "../../api/service/member/EmailService";
import {MemberService} from "../../api/service/member/MemberService";

const FindingPassword = ({} ) => {
    const navigate = useNavigate();

    const handleChangePasswordButton = async () => {
        if (!isValidPassword()) {
            return
        }

        if (isEmailAuthenticated) {
            if (!isValidPassword()) {
                return
            }

            const request = {
                password : $('#newPassword').val(),
            }

            let result = await MemberService.modifyPassword(request, 'kkh2415@naver.com');
            if (result) {
                alert('비밀번호가 변경되었습니다.')
                navigate('/signin')
                // window.location.href = '/signin'
            }
        } else {
          alert('이메일을 인증해주세요.')
        }
    }

    const handleSecurityCodeAuthenticateButton = async () => {
        let securityCode = $('#securityCode').val()
        if (!isValidSecurityCode(securityCode)) {
            return
        }

        let auth = {
            securityCode : securityCode,
            authType : "FINDING_PASSWORD",
        }

        let result = await EmailService.confirmEmail(auth, email);
        if (result) {
            alert('인증되었습니다.')
            setIsEmailAuthenticated(true)
        }
    }

    const handleSendEmailButton = async () => {
        let userInfo = {
            username : $('#username').val(),
            birthday : $('#birthday').val(),
            email : $('#email').val(),
            domain : $('#domain').val(),
        }

        if (!isValidUserInfo(userInfo)) {
            return
        } else if (!isExistMember()) {
            return
        }

        const emailAuthRequest = {
            securityCode : "",
            authType : "FINDING_PASSWORD",
        }
        const result = await EmailService.sendSecurityCode(emailAuthRequest, userInfo.email + '@' + userInfo.domain);
        if (result) {
            setEmail(userInfo.email + '@' + userInfo.domain)
            alert('인증번호가 전송되었습니다.')
        }
    }


    const handleSendEmailButton2 = async () => {
        let userInfo = {
            username : $('#username').val(),
            birthday : $('#birthday').val(),
            email : $('#email').val(),
            domain : $('#domain').val(),
        }
    }

    const isValidPassword = () => {
        let result = true
        let newPassword = $('#newPassword').val()
        let newPasswordConfirm = $('#newPasswordConfirm').val()

        $('#passwordAlert').css('display', 'none')

        if (newPassword === '') {
            alert('신규 비밀번호를 입력해주세요')
            result = false
        } else if (newPasswordConfirm === '') {
            alert('신규 비밀번호 확인을 입력해주세요')
            result = false
        } else if (!validation.password.test(newPassword)) {
            $('#passwordAlert').css('display', 'block')
            result = false
        } else if (newPassword !== newPasswordConfirm) {
            alert('비밀번호가 일치하지 않습니다.')
            result = false
        }

        return result
    }

    const isValidSecurityCode = (securityCode) => {
        let result = true

        if (securityCode === null || securityCode === '') {
            alert('인증번호를 입력해주세요')
            result = false
        } else if (email === '') {
            alert('인증번호가 아직 이메일로 발송되지 않았습니다. \n인증번호 발송버튼을 눌러주세요.')
            result = false
        }

        return result
    }

    const isValidUserInfo = (userInfo) => {
        let result = true

        $('#usernameAlert').css('display', 'none')
        $('#birthdayAlert').css('display', 'none')
        $('#emailAlert').css('display', 'none')

        if (userInfo.username === null || userInfo.username === '') {
            $('#usernameAlert').css('display', 'inline-block')
            result = false
        }
        if (userInfo.birthday === null || userInfo.birthday === '') {
            $('#birthdayAlert').css('display', 'inline-block')
            result = false
        }
        if (userInfo.email === null ||
            userInfo.domain === null ||
            userInfo.domain === '' ||
            userInfo.email === '') {
            $('#emailAlert').css('display', 'inline-block')
            result = false
        }

        return result
    }

    const isExistMember = () => {
        let result = true

        return result
    }

    const [isEmailAuthenticated, setIsEmailAuthenticated] = useState(false)
    const [email, setEmail] = useState('')

    useEffect(() => {
    }, [])

    return (
        <>
            <Container className='mt-5' style={{width: "100%", fontFamily: "sans-serif"}}>
                <p className="h2">비밀번호 찾기</p>
                <HorizonLine text={""} />
                <br/><br/><br/>

                <p className="h3">기본 정보</p>
                <HorizonLine text={""} />
                <form className="form-inline" id='info-form'>
                    <div id='usernameDiv1' className="mb-3">
                        <div id='usernameDiv2' style={{display: "inline-block", width: "25%"}}>
                            <span className='float-left h4' style={{marginRight: 100}}>성명</span>
                        </div>
                        <input id='username' type={"text"} className="form-control mb-2 mr-sm-2"/>
                        <p id='usernameAlert' style={{display: "none", marginLeft: 15}} className="text-danger h5">성함을 입력해주세요</p>
                    </div>
                    <HorizonLine text={""} />
                    <div className="mb-3">
                        <div style={{display: "inline-block", width: "25%"}}>
                            <span className='h4'>생년월일</span>
                        </div>
                        <input id='birthday' type={"date"} className="form-control mb-2 mr-sm-2"/>
                        <p id='birthdayAlert' style={{display: "none", marginLeft: 15}} className="text-danger h5">생년월일을 입력해주세요</p>
                    </div>
                    <HorizonLine text={""} />
                    <div className="mb-3">
                        <div style={{display: "inline-block", width: "25%"}}>
                            <span className='h4'>이메일(아이디)</span>
                            <br/>
                            <span className='text-hide'>히든1</span>
                        </div>

                        <div style={{display: "inline-block"}}>
                            <input id='email' type="text" className="form-control" />
                            <span style={{marginRight: 3, marginLeft: 3}}>@</span>
                            <input id='domain' type="text" className="form-control" />
                            <button onClick={handleSendEmailButton} className="btn btn-secondary" style={{marginLeft: 10}} type="button">
                                인증번호 발송
                            </button>
                            <p id='emailAlert' style={{display: "none", marginLeft: 15}} className="text-danger h5">이메일을 입력해주세요</p>
                            <br/>
                            <br/>
                            <input id='securityCode' type="text" className="form-control" placeholder="인증번호" />
                            <button onClick={handleSecurityCodeAuthenticateButton} className="btn btn-secondary" style={{marginLeft: 10}} type="button">
                                인증
                            </button>
                        </div>
                    </div>
                    <HorizonLine text={""} />
                    <div className="mb-3">
                        <div style={{display: "inline-block", width: "25%"}}>
                            <span className='float-left h4' style={{marginRight: 100}}>신규 비밀번호</span>
                        </div>
                        <input id='newPassword' type='password' className="form-control mb-2 mr-sm-2"/>
                        <p id='passwordAlert' style={{display: "none", marginLeft: 15}} className="text-danger h5">
                            비밀번호는 8자리이상 24이하, 영문자/숫자만 및 특수문자만 입력하세요
                        </p>
                    </div>
                    <HorizonLine text={""} />
                    <div className="mb-3">
                        <div style={{display: "inline-block", width: "25%"}}>
                            <span className='float-left h4' style={{marginRight: 100}}>신규 비밀번호 확인</span>
                        </div>
                        <input id='newPasswordConfirm' type='password' className="form-control mb-2 mr-sm-2"/>
                    </div>
                    <HorizonLine text={""} />

                    <Row className='d-flex justify-content-center align-items-center'>
                        <div style={{display: "inline-flex", width: "50%"}}>
                            <Col>
                                <button type='button' onClick={handleChangePasswordButton} className="w-100 btn btn-dark">비밀번호 변경</button>
                            </Col>
                            <Col>
                                <Link to='/signin'><button type="text" className="w-100 btn btn-secondary">취소</button></Link>
                            </Col>
                        </div>
                    </Row>
                </form>
            </Container>
        </>
    );
};

export default FindingPassword;
