import React, {useState} from 'react';
import {Container} from 'react-bootstrap'
import $ from 'jquery'

import ChannelCommentService from "../../../api/service/channel/ChannelCommentService";
import {UserInfo} from "../../../api/const/UserInfo";

const ChannelWriteReplyComment = ({setWritingReplyComment, setReplyCount, replyCount, parentCommentId}) => {
    const handleCreateReplyCommentButton = async () => {
        let replyRequest = {
            content : $('#createReplyContent').val(),
        }

        let result = await ChannelCommentService.createReply(replyRequest, memberId, parentCommentId)
        if (result !== null) {
            $('#createReplyContent').val('')
            setWritingReplyComment(true)
            setReplyCount(replyCount + 1)
        }
    }

    const [memberId, setMemberId] = useState(localStorage.getItem(UserInfo.ID))

    return (
        <>
            <Container>
                <span id="createReplyWriter">댓글작성자</span>
            </Container>
            <Container>
                <textarea id="createReplyContent" minLength="1" maxLength="200" className="form-control" rows="3" placeholder="댓글을 입력해주세요"/>
            </Container>
            <Container className='mt-4'>
                <button onClick={handleCreateReplyCommentButton} className="btn btn btn-success btn-sm btn float-end" type="button" id="createReply">등록</button>
            </Container>
        </>
    );
};

export default ChannelWriteReplyComment;
