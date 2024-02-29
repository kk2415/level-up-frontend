import React, {useState, useEffect} from 'react';
import {Container} from 'react-bootstrap'
import $ from 'jquery'

import ChannelCommentService from "../../../api/service/channel/ChannelCommentService";
import ChannelComment from "./ChannelComment";

import {UserInfo} from "../../../api/const/UserInfo";

const ChannelCommentFrame = ({articleId, channelId}) => {

    const handleCreateCommentButton = async () => {
        let comment = {
            content : $('#contentOfWritingComment').val(),
        }

        if (token) {
            await ChannelCommentService.create(comment, memberId, articleId, channelId)
            $('#contentOfWritingComment').val('')
            setOnComments(!onComments)
        }
        else {
            alert("댓글을 작성하려면 로그인을 해야합니다.")
        }
    }

    const loadComment = async (articleId) => {
        let result = await ChannelCommentService.get(articleId)
        setComments(result)
    }

    const [memberId, setMemberId] = useState(localStorage.getItem(UserInfo.ID))
    const [token, setToken] = useState(localStorage.getItem(UserInfo.TOKEN))
    const [comments, setComments] = useState(null)
    const [onComments, setOnComments] = useState(false)

    useEffect(() => {
        loadComment(articleId)
    }, [onComments])

    return (
        <>
            <div className="fs-3 mb-1">
                댓글
            </div>
            <div id="commentFrame" className="row row-cols-1">
                <Container className="mb-3">
                    {
                        comments &&
                        comments.map((info) => (
                            <ChannelComment comment={info} articleId={articleId} channelId={channelId} />
                        ))
                    }
                </Container>
                <Container>
                    <textarea id="contentOfWritingComment" className="form-control" rows="3" placeholder="댓글을 입력해주세요." />
                    <br/>
                    <button onClick={handleCreateCommentButton} className="btn btn btn-success float-end mb-5" type="button">
                        등록
                    </button>
                </Container>
            </div>
        </>
    );
};

export default ChannelCommentFrame;