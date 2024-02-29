import React, {useState, useEffect, useLayoutEffect} from 'react';
import {Container, Form} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import $ from 'jquery'

import ChannelArticleService from '../../api/service/channel/ChannelArticleService'

import {UserInfo} from "../../api/const/UserInfo";

const ModifyChannel = () => {
    const navigate = useNavigate();

    const getChannelId = () => {
        let search = decodeURI($(window.location).attr('search'))

        return search.substr(search.indexOf('=') + 1)
    }

    const getArticleId = () => {
        let pathname = decodeURI($(window.location).attr('pathname'))

        return pathname.substr(pathname.lastIndexOf('/') + 1)
    }

    const handleModifyButton = async () => {
        let formData = new FormData(document.getElementById('form'));

        let article = {
            title : formData.get('title'),
            content  : $('#summernote').val(),
            category : formData.get('category'),
        }

        let result = await ChannelArticleService.modify(article, memberId, articleId, channelId);
        if (result) {
            alert('수정되었습니다.')
            navigate('/channel-article/' + articleId + '?channel=' + channelId)
        }
    }

    const handleCancelButton = () => {
        navigate('/channel-article/' + articleId + '?channel=' + channelId)
    }

    const loadArticle = async () => {
        let article = await ChannelArticleService.get(articleId, channelId, false)

        setArticle(article)
    }

    const showArticle = () => {
        if (article) {
            $('#title').val(article.title)
            $('#category').val(article.category)
        }
    }

    function configSummernote() {
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

    const [memberId, setMemberId] = useState(localStorage.getItem(UserInfo.ID))
    const [channelId, setChannelId] = useState(getChannelId())
    const [articleId, setArticleId] = useState(getArticleId())
    const [article, setArticle] = useState(null)

    useEffect(() => {
        showArticle()

        if (article) {
            $('#summernote').val(article.content)
        }
    }, [article])

    useLayoutEffect(() => {
        setChannelId(getChannelId())
        setArticleId(getArticleId)
        loadArticle()
        configSummernote()
    }, [])

    return (
        <>
            {
                article &&
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

                        <div className="row">
                            <div className="col">
                                <button onClick={handleModifyButton} className="w-100 btn btn-primary btn-lg" type="button" id="postingButton">
                                    수정
                                </button>
                            </div>
                            <div className="col">
                                <button onClick={handleCancelButton} className="w-100 btn btn-secondary btn-lg" type="button" id="cancelButton">
                                    취소
                                </button>
                            </div>
                        </div>
                    </Form>
                </Container>
            }
        </>
    );
};

export default ModifyChannel;
