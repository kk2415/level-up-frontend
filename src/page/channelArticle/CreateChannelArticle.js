import React, {useState, useEffect, useLayoutEffect} from 'react';
import {useNavigate} from "react-router-dom";

import $ from 'jquery'
import ChannelArticleService from '../../api/service/channel/ChannelArticleService'
import {Container, Form} from 'react-bootstrap'
import {UserInfo} from "../../api/const/UserInfo";

const CreateChannelArticle = () => {
    const navigate = useNavigate();

    const getChannelId = () => {
        let search = decodeURI($(window.location).attr('search'))

        return search.substr(search.indexOf('=') + 1)
    }

    const handleCreatePost = async () => {
        let formData = new FormData(document.getElementById('form'));

        let article = {
            title : formData.get('title'),
            content  : $('#summernote').val(),
            category : formData.get('category'),
        }

        if (!validate(article)) {
            return
        }

        let result = await ChannelArticleService.create(article, channelId, memberId);

        if (result) {
            navigate('/channel/' + channelId + '?page=1')
        }
    }

    const validate = (post) => {
        let valid = true;

        removeAlertMassageBox()
        if (post.title === null || post.title === "") {
            $('#alert').append('<h5>[제목] : 제목을 입력해주세요.</h5>')
            valid = false;
        }
        if (post.category === 'NONE') {
            $('#alert').append('<h5>[카테고리] : 카테고리를 선택해주세요.</h5>')
            valid = false;
        }
        if (post.contents === null || post.contents === "") {
            $('#alert').append('<h5>[내용] : 내용을 입력해주세요</h5>')
            valid = false;
        }

        if (!valid) {
            showAlertMassageBox()
        }
        return valid
    }

    const handleCancel = () => {
        navigate('/channel/' + channelId + '?page=1')
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

    function configSummernote() {
        $(document).ready(function() {
            let fontList = ['맑은 고딕','굴림','돋움','바탕','궁서','NotoSansKR','Arial','Courier New','Verdana','Tahoma','Times New Roamn'];

            $('#summernote').summernote({
                lang: 'ko-KR',
                height: 400,
                minHeight: null,
                maxHeight: null,
                toolbar: [
                    ['fontstyle', ['bold','italic','underline','strikethrough','forecolor','backcolor','superscript','subscript','clear']],
                    ['paragraph', ['ul','ol']],
                    ['insert', ['hr','link','picture']],
                    ['codeview'],
                ],
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

    const [channelId, setChannelId] = useState(getChannelId())
    const [memberId, setMemberId] = useState(localStorage.getItem(UserInfo.ID))

    useEffect(() => {
        hideAlertMassageBox()
    }, [])

    useLayoutEffect(() => {
        configSummernote()
    }, [])

    return (
        <>
            <Container>
                <Form id='form'>
                    <Form.Group className="mb-3">
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">제목</label>
                            <input type="text" className="form-control" id="title" name="title" placeholder="제목을 작성해주세요" />
                        </div>
                    </Form.Group>

                    <Form.Group className='mb-4'>
                        <Form.Label>카테고리</Form.Label>
                        <Form.Select aria-label="Default select example" name="category" id="category">
                            <option selected value="NONE">카테고리를 선택해주세요</option>
                            <option value="INFO">정보</option>
                            <option value="SELF_IMPROVEMENT">자기계발</option>
                            <option value="TIP">팁</option>
                            <option value="LIFE">생활</option>
                            <option value="TALK">수다</option>
                            <option value="INTRODUCE">인사</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>내용</Form.Label>
                        <textarea id='summernote' />
                    </Form.Group>

                    <div className="alert alert-danger mt-5" id="alert" role="alert">
                        <h4 className="alert-heading">입력한 정보에 문제가 있네요!</h4>
                        <hr/>
                    </div>

                    <div className="row">
                        <div className="col">
                            <button onClick={handleCreatePost} className="w-100 btn btn-primary btn-lg" type="button" id="postingButton">작성
                            </button>
                        </div>
                        <div className="col">
                            <button onClick={handleCancel} className="w-100 btn btn-secondary btn-lg" type="button" id="cancelButton">취소
                            </button>
                        </div>
                    </div>
                </Form>
            </Container>
        </>
    );
};

export default CreateChannelArticle;
