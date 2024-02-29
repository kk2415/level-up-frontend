import React, {useState, useLayoutEffect} from 'react';
import {useNavigate} from 'react-router-dom'

import $ from 'jquery'
import ChannelArticleService from '../../api/service/channel/ChannelArticleService'
import {Container, Form} from 'react-bootstrap'
import {UserInfo} from "../../api/const/UserInfo";

const CreateChannelNotice = () => {
    const navigate = useNavigate();

    const getChannelId = () => {
        let search = decodeURI($(window.location).attr('search'))

        return search.substr(search.indexOf('=') + 1)
    }

    const handleCreateNotice = async () => {
        let formData = new FormData(document.getElementById('form'));

        let notice = {
            title : formData.get('title'),
            content  : $('#summernote').val(),
            articleType : 'CHANNEL_NOTICE',
        }

        let result = await ChannelArticleService.create(notice, channelId, memberId);
        if (result) {
            navigate('/channel/' + channelId + '?page=1')
        }
    }

    const handleCancel = () => {
        navigate('/channel/' + channelId + '?page=1')
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

    const [channelId, setChannelId] = useState(getChannelId())
    const [memberId, setMemberId] = useState(localStorage.getItem(UserInfo.ID))

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

                    <Form.Group className="mb-3">
                        <Form.Label>내용</Form.Label>
                        <textarea id='summernote' />
                    </Form.Group>

                    <div className="row">
                        <div className="col">
                            <button onClick={handleCreateNotice} className="w-100 btn btn-primary btn-lg" type="button" id="postingButton">작성
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

export default CreateChannelNotice;
