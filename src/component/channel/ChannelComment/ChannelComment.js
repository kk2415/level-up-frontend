import React, {useState, useEffect} from 'react';
import { Container } from 'react-bootstrap'
import {useNavigate} from "react-router-dom";

import ChannelVoteService from "../../../api/service/channel/ChannelVoteService";
import ChannelCommentService from "../../../api/service/channel/ChannelCommentService";
import ChannelReplyComment from "./ChannelReplyComment";
import ChannelWriteReplyComment from "./ChannelWriteReplyComment";

import {UserInfo} from "../../../api/const/UserInfo";

const ChannelComment = ({comment, articleId, channelId}) => {

    const navigate = useNavigate();

    const handleVoteButton = async () => {
        if (!token) {
            alert('로그인 해야합니다')
            return
        }

        let voteRequest = {
            'memberId' : channelMemberId,
            'channelId' : channelId,
            'targetId' : comment.commentId,
            'voteType' : 'COMMENT',
        }

        let result = await ChannelVoteService.create(voteRequest)
        if (result != null) {
            setVoteCount(result.successful === false ? voteCount - 1 : voteCount + 1)
        }
    }

    const handleDeleteCommentButton = async () => {
        if (window.confirm('삭제하시겠습니까?')) {
            let result = await ChannelCommentService.delete(comment.commentId)

            if (result) {
                window.location.reload()
            }
        }
    }

    const loadReplyComment = async () => {
        let reply = await ChannelCommentService.getReply(comment.commentId)

        setReplyComment(reply)
    }

    const handleShowReplyCommentList = async () => {
        setOnHideShowReplyComment(!onHideReplyComment)
    }

    const [memberId, setMemberId] = useState(localStorage.getItem(UserInfo.ID))
    const [channelMemberId, setChannelMemberId] = useState(localStorage.getItem(UserInfo.CHANNEL_MEMBER_ID))
    const [token, setToken] = useState(localStorage.getItem(UserInfo.TOKEN))
    const [replyComment, setReplyComment] = useState(null)
    const [voteCount, setVoteCount] = useState(comment.voteCount)
    const [replyCount, setReplyCount] = useState(comment.replyCount)
    const [onHideReplyComment, setOnHideShowReplyComment] = useState(false)
    const [writingReplyComment, setWritingReplyComment] = useState(false)

    useEffect(() => {
        loadReplyComment(comment.commentId)
    }, [onHideReplyComment, writingReplyComment])

    return (
        <>
            {
                comment &&
                <Container id="comment" className="comment col mb-3">
                    <div className="mt-3">
                        <span id="commentWriter">{comment.nickname}</span>
                        &nbsp;&nbsp;&nbsp;
                        <span id="commentDate">{comment.createdAt}</span>
                    </div>
                    <div id="commentContent" className="text-dark bg-opacity-10 d-flex fs-3 mb-4">
                        {comment.content}
                    </div>
                    {
                        comment.replyCount > 0 &&
                        <button onClick={handleShowReplyCommentList} className="btn-sm btn-secondary" id="replyButton">
                            답글 {replyCount}
                        </button>
                    }
                    {
                        comment.replyCount <= 0 &&
                        <button onClick={handleShowReplyCommentList} className="btn-sm btn-secondary" id="replyButton">
                            답글쓰기
                        </button>
                    }

                    {
                        comment.memberId === Number(memberId) &&
                        <button onClick={handleDeleteCommentButton} className="btn-sm btn-danger" id="replyButton">
                            삭제
                        </button>
                    }

                    <span id="commentVote" className="float-end">
                        <button onClick={handleVoteButton} className="btn-sm btn-info" type="button">
                            {'추천 ' + voteCount}
                        </button>
                    </span>

                    {
                        onHideReplyComment &&
                        <Container className="container" id="replyList">
                            {
                                replyComment &&
                                replyComment.map((reply) => (
                                    <ChannelReplyComment reply={reply} channelId={channelId} />
                                ))
                            }
                            <ChannelWriteReplyComment setWritingReplyComment={setWritingReplyComment}
                                               setReplyCount={setReplyCount}
                                               replyCount={replyCount}
                                               parentCommentId={comment.commentId} />
                        </Container>
                    }
                </Container>
            }
        </>
    );
};

export default ChannelComment;
