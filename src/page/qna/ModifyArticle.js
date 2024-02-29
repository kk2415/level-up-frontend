import React, {useState, useEffect, useLayoutEffect} from 'react';

import {Container, Form} from 'react-bootstrap'
import $ from 'jquery'

import ArticleService from '../../api/service/article/ArticleService'
import {useNavigate} from "react-router-dom";
import {UserInfo} from "../../api/const/UserInfo";

const ModifyArticle = () => {
    const navigate = useNavigate();

    const getArticleType = () => {
        let queryString = decodeURI($(window.location).attr('search'))

        return queryString.substr(queryString.indexOf('=') + 1)
    }

    const getArticleId = () => {
        let pathname = decodeURI($(window.location).attr('pathname'))

        return pathname.substr(pathname.lastIndexOf('/') + 1)
    }

    const handleCreateArticle = async () => {
        let formData = new FormData(document.getElementById('form'));

        let article = {
            title : formData.get('title'),
            content  : $('#summernote').val(),
            articleType : articleType,
        }

        if (!validate(article)) {
            return
        }

        let result = await ArticleService.modify(article, localStorage.getItem(UserInfo.ID), articleId)

        if (result) {
            navigate('/article/list?articleType=' + articleType + '&page=1')
        }
    }

    const handleCancel = () => {
        navigate('/qna?page=1')
    }

    const validate = (article) => {
        let valid = true;

        removeAlertMassageBox()
        if (article.title === null || article.title === "") {
            $('#alert').append('<h5>[제목] : 제목을 입력해주세요.</h5>')
            valid = false;
        }
        if (article.content === null || article.content === "") {
            $('#alert').append('<h5>[내용] : 내용을 입력해주세요</h5>')
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

    const loadArticle = async (articleId) => {
        let article = await ArticleService.get(articleId, articleType)

        setArticle(article)
    }

    const showArticle = (article) => {
        if (article) {
            $('#title').val(article.title)
            $('#summernote').val(article.content)
        }
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

    const [articleType, setArticleType] = useState(getArticleType())
    const [article, setArticle] = useState(null)
    const [articleId, setArticleId] = useState(getArticleId())

    useEffect(() => {
        showArticle(article)
        hideAlertMassageBox()
    }, [article])

    useLayoutEffect(() => {
        setArticleId(getArticleId())
        loadArticle(articleId)
        configSummernote()
    }, [])

    return (
        <>
            {
                articleType &&
                <Container>
                    <Form id='form'>
                        <Form.Group className="mb-3">
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">제목</label>
                                <input type="text" className="form-control" id="title" name="title" placeholder="제목을 작성해주세요" />
                            </div>
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
                                <button onClick={handleCreateArticle} className="w-100 btn btn-primary btn-lg" type="button" id="postingButton">작성
                                </button>
                            </div>
                            <div className="col">
                                <button onClick={handleCancel} className="w-100 btn btn-secondary btn-lg" type="button" id="cancelButton">취소
                                </button>
                            </div>
                        </div>
                    </Form>
                </Container>
            }
        </>
    );
};

export default ModifyArticle;
