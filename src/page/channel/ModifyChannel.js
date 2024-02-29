import React, {useState, useEffect, useLayoutEffect} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import $ from "jquery";

import ChannelService from '../../api/service/channel/ChannelService'
import {Container, FloatingLabel, Form, Row} from 'react-bootstrap'
import {createChannelValidation as validation} from "../../api/Validation";
import {FileService} from "../../api/service/file/FileService";

const CreateChannel = () => {
    const navigate = useNavigate();

    const getChannelId = () => {
        let pathname = decodeURI($(window.location).attr('pathname'))

        return Number(pathname.substr(pathname.lastIndexOf('/') + 1))
    }

    const loadDescription = async (channelId) => {
        let result = await ChannelService.get(channelId)

        setDescription(result)
    }

    const handleChangeThumbnail = (event) => {
        setThumbnail(event.target.files[0])
    }

    const handleBackButton = () => {
        window.history.back();
    }

    const handleModifyButton = async () => {
        let channel = {
            name : $('#name').val(),
            limitedMemberNumber : $('#limitedMemberNumber').val(),
            description : $('#summernote').val(),
            category : $('#category').val(),
            expectedStartDate : $('#expectedStartDate').val(),
            expectedEndDate : $('#expectedEndDate').val(),
        }

        if (validate(channel)) {
            // let result = await ChannelService.modify(channel, channelId);
            await FileService.update(channelId, 'CHANNEL', thumbnail)
            // if (result) {
            //
            //     alert('수정되었습니다.')
            //     navigate('/channel/description/' + channelId)
            // }
        }
    }

    const validate = (channel) => {
        let valid = true;

        removeAlertMassageBox()
        if (!validation.name.test(channel.name) || channel.name == null) {
            $('#alert').append('<h5>[프로젝트 이름] : 이름은 2자리 이상 20이하 자리수만 입력 가능합니다.</h5>')
            valid = false;
        }
        if (!validation.limitedMemberNumber.test(channel.limitedMemberNumber) || channel.limitedMemberNumber == null) {
            $('#alert').append('<h5>[프로젝트 인원] : 숫자만 입력가능하며 일의자리수부터 백의자리수까지 입력 가능합니다.</h5>')
            valid = false;
        }
        if (channel.category === 'NONE') {
            $('#alert').append('<h5>[카테고리] : 카테고리를 정해주세요.</h5>')
            valid = false;
        }
        if (channel.expectedStartDate === '') {
            $('#alert').append('<h5>[시작 예정일] : 시작 예정일을 정해주세요.</h5>')
            valid = false;
        }
        if (channel.expectedEndDate === '') {
            $('#alert').append('<h5>[종료 예정일] : 종료 예정일을 정해주세요.</h5>')
            valid = false;
        }

        if (!valid) {
            showAlertMassageBox()
        }
        return valid
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

    const showChannel = () => {
        if (description) {
            $('#name').val(description.name)
            $('#limitedMemberNumber').val(description.limitedMemberNumber)
            $('#thumbnailDescription').val(description.thumbnailDescription)
        }
    }

    const configSummernote = () => {
        $(document).ready(function() {
            $('#summernote').summernote({
                height: 400,
                minHeight: null,
                maxHeight: null,
                callbacks: {
                    onImageUpload : function(images) {
                        for (let i = 0; i < images.length; i++) {
                            let reader = new FileReader();
                            reader.readAsDataURL(images[i])

                            reader.onloadend = () => {
                                const base64 = reader.result
                                $('#summernote').summernote('insertImage', base64)
                            }
                        }
                    },
                    onPaste: function (e) {
                        let clipboardData = e.originalEvent.clipboardData;
                        if (clipboardData && clipboardData.items && clipboardData.items.length) {
                            let item = clipboardData.items[0];
                            if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
                                e.preventDefault();
                            }
                        }
                    }
                }
            })
        })
    }

    const [thumbnail, setThumbnail] = useState(null)
    const [channelId, setChannelId] = useState(getChannelId())
    const [description, setDescription] = useState(null)

    useEffect(() => {
        hideAlertMassageBox()
        showChannel()
        configSummernote()
        if (description) {
            $('#summernote').val(description.description)
        }
    }, [description])

    useLayoutEffect(() => {
        setChannelId(getChannelId())
        loadDescription(channelId)
    }, [])

    return (
        <>
            <Container style={{width: "100%", fontFamily: "sans-serif"}}>
                {
                    description &&
                    <Row className='d-flex justify-content-center align-items-center'>
                        <Form id='form' style={{width: "70%"}}>
                            <FloatingLabel label="채널 정원" className="mb-3 " style={{width: "11%", display: 'inline-block', marginRight: 20}}>
                                <Form.Control type="number" id="limitedMemberNumber" name="limitedMemberNumber" placeholder="회원 제한 수"/>
                            </FloatingLabel>

                            <Form.Select className="mb-3 form-control" name="category" id="category" defaultValue={description.category}
                                         style={{width: "86%", display: 'inline-block'}}>
                                <option className="fs-4" selected value="NONE" placeholder="name@example.com">카테고리를 선택해주세요</option>
                                <option className="fs-4" value="STUDY">스터디</option>
                                <option className="fs-4" value="PROJECT">프로젝트</option>
                            </Form.Select>

                            <FloatingLabel label="스터디 이름" className="mb-3" style={{width: "100%"}}>
                                <Form.Control id="name" name="name" />
                            </FloatingLabel>

                            <Form.Group className="mb-3 mt-3" style={{width: "49%", display: 'inline-block', marginRight: 10}}>
                                <Form.Label>시작 예정일</Form.Label>
                                <Form.Control defaultValue={description.expectedStartDate} type="date" id="expectedStartDate" name="expectedStartDate" placeholder="생년월일 6자리를 입력해주세요" />
                            </Form.Group>

                            <Form.Group className="mb-3" style={{width: "49%", display: 'inline-block'}}>
                                <Form.Label>종료 예정일</Form.Label>
                                <Form.Control defaultValue={description.expectedEndDate} type="date" id="expectedEndDate" name="expectedEndDate" placeholder="생년월일 6자리를 입력해주세요" />
                            </Form.Group>

                            <Form.Group style={{width: "100%"}}>
                                <Form.Label>대표 사진</Form.Label>
                                <Form.Control onChange={handleChangeThumbnail} id='file' type='file' />
                            </Form.Group>

                            <Form.Group className="mb-3 mt-5" style={{width: "100%"}}>
                                <Form.Label className="fs-3 fw-bold">스터디 설명</Form.Label>
                                <textarea id='summernote' />
                            </Form.Group>

                            <div className="alert alert-danger mt-5" id="alert" role="alert">
                                <h4 className="alert-heading">입력한 정보에 문제가 있네요!</h4>
                                <hr/>
                            </div>

                            <div className="row mt-5">
                                <div className="col">
                                    <button onClick={handleModifyButton} className="w-100 btn btn-primary btn-lg" type="button"
                                            id="modifyButton">수정</button>
                                </div>
                                <div className="col">
                                    <button onClick={handleBackButton} className="w-100 btn btn-secondary btn-lg" type="button" id="cancel">뒤로가기</button>
                                </div>
                            </div>
                        </Form>
                    </Row>
                }
            </Container>
        </>
    );
};

export default CreateChannel;
