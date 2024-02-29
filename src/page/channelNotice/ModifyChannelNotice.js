import React, {useState, useEffect, useLayoutEffect} from 'react';
import {useNavigate} from 'react-router-dom'

import $ from 'jquery'
import ChannelService from '../../api/service/channel/ChannelService'
import ChannelArticleService from '../../api/service/channel/ChannelArticleService'
import {Container, Form} from 'react-bootstrap'
import RichTextEditor from "../../component/SummerNote";

const ModifyChannelArticle = () => {
    const navigate = useNavigate();

    const getChannelId = () => {
        let search = decodeURI($(window.location).attr('search'))

        return search.substr(search.indexOf('=') + 1)
    }

    const getChannelNoticeId = () => {
        let pathname = decodeURI($(window.location).attr('pathname'))

        return pathname.substr(pathname.lastIndexOf('/') + 1)
    }

    const [channelId, setChannelId] = useState(getChannelId())
    const [channelNoticeId, setChannelNoticeId] = useState(getChannelNoticeId())
    const [contents, setContents] = useState('내용')
    const [channelNotice, setChannelNotice] = useState(null)

    const handleModifyPost = async () => {
        let formData = new FormData(document.getElementById('form'));

        let channelNotice = {
            title : formData.get('title'),
            content  : $('#summernote').val(),
        }

        let result = await ChannelArticleService.modify(channelNotice, channelNoticeId, channelId);
        if (result) {
            navigate(-1)
            // window.history.back()
        }
    }

    const handleCancel = () => {
        navigate('/channel/' + channelId + '?page=1')
    }

    const loadChannelNotice = async (channelNoticeId) => {
        let channelNotice = await ChannelArticleService.get(channelNoticeId, channelId, false)

        setChannelNotice(channelNotice)
    }

    const showChannelNotice = () => {
        if (channelNotice) {
            $('#title').val(channelNotice.title)
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

    useEffect(() => {
        showChannelNotice()

        if (channelNotice) {
            $('#summernote').val(channelNotice.content)
        }
    }, [channelNotice])

    useLayoutEffect(() => {
        setChannelId(getChannelId())
        setChannelNoticeId(getChannelNoticeId())
        loadChannelNotice(channelNoticeId)
        configSummernote()
    }, [])

    return (
        <>
            {
                channelNotice &&
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
                            {/*<RichTextEditor setContents={setContents} contents={channelNotice.content} />*/}
                        </Form.Group>

                        <div className="row">
                            <div className="col">
                                <button onClick={handleModifyPost} className="w-100 btn btn-primary btn-lg" type="button" id="postingButton">수정
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

export default ModifyChannelArticle;
