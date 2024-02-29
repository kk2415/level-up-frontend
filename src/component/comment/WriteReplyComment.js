import React from 'react';
import {Container} from 'react-bootstrap'
import CommentService from "../../api/service/article/CommentService";

import $ from 'jquery'
import {UserInfo} from "../../api/const/UserInfo";

const WriteReplyComment = ({setWritingReplyComment, setReplyCount, replyCount, parentCommentId, articleId, identity}) => {
    const createReplyComment = async () => {
        let replyRequest = {
            parentId : parentCommentId,
            content : $('#createReplyContent').val(),
            articleId : articleId,
            identity : identity,
        }

        let result = await CommentService.createReply(replyRequest, localStorage.getItem(UserInfo.ID))
        if (result !== null) {
            $('#createReplyContent').val('')
            setWritingReplyComment(true)
            setReplyCount(replyCount + 1)
        }
    }

    return (
        <>
            <Container>
                <span id="createReplyWriter">댓글작성자</span>
            </Container>
            <Container>
                <textarea id="createReplyContent" minLength="1" maxLength="200" className="form-control" rows="3" placeholder="댓글을 입력해주세요"/>
            </Container>
            <Container className='mt-4'>
                <button onClick={createReplyComment} className="btn btn btn-success btn-sm btn float-end" type="button" id="createReply">등록</button>
            </Container>
        </>
    );
};

export default WriteReplyComment;
