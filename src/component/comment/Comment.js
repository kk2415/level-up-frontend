import React, {useState, useEffect} from 'react';
import { Container } from 'react-bootstrap'

import CommentService from "../../api/service/article/CommentService";
import VoteService from "../../api/service/article/VoteService";
import ReplyComment from "./ReplyComment";
import WriteReplyComment from './WriteReplyComment'
import {UserInfo} from "../../api/const/UserInfo";

const Comment = ({comment, articleId, identity}) => {

    const handleVoteButton = async () => {
        if (!token) {
            alert('로그인 해야합니다')
            return
        }

        let voteRequest = {
            'memberId' : memberId,
            'targetId' : comment.commentId,
            'voteType' : 'COMMENT',
        }

        let result = await VoteService.create(voteRequest)
        if (result != null) {
            setVoteCount(result.successful === false ? voteCount - 1 : voteCount + 1)
        }
    }

    const handleDeleteComment = async () => {
        if (window.confirm('삭제하시겠습니까?')) {
            let result = await CommentService.delete(comment.commentId, identity)

            if (result) {
                window.location.reload()
            }
        }
    }

    const loadReplyComment = async () => {
        let reply = await CommentService.getReply(comment.commentId)

        setReplyComment(reply)
    }

    const showReplyCommentList = async () => {
        setOnHideShowReplyComment(!onHideReplyComment)
    }

    const [memberId, setMemberId] = useState(localStorage.getItem(UserInfo.ID))
    const [token, setToken] = useState(localStorage.getItem(UserInfo.TOKEN))
    const [onHideReplyComment, setOnHideShowReplyComment] = useState(false)
    const [replyComment, setReplyComment] = useState(null)
    const [writingReplyComment, setWritingReplyComment] = useState(false)
    const [voteCount, setVoteCount] = useState(comment.voteCount)
    const [replyCount, setReplyCount] = useState(comment.replyCount)

    useEffect(() => {
        loadReplyComment(comment.commentId)
    }, [onHideReplyComment, writingReplyComment])

    return (
        <>
            {
                comment &&
                <Container id="comment" className="comment col mb-3">
                    <div className="mt-3">
                        <span id="commentWriter">{comment.writer}</span>
                        &nbsp;&nbsp;&nbsp;
                        <span id="commentDate">{comment.createdAt}</span>
                    </div>
                    <div id="commentContent" className="text-dark bg-opacity-10 d-flex fs-3 mb-4">
                        {comment.content}
                    </div>
                    {
                        comment.replyCount > 0 &&
                        <button onClick={showReplyCommentList} className="btn-sm btn-secondary" id="replyButton">답글 {replyCount}</button>
                    }
                    {
                        comment.replyCount <= 0 &&
                        <button onClick={showReplyCommentList} className="btn-sm btn-secondary" id="replyButton">답글쓰기</button>
                    }

                    {
                        comment.memberId === Number(localStorage.getItem(UserInfo.ID)) &&
                        <button onClick={handleDeleteComment} className="btn-sm btn-danger" id="replyButton">
                            삭제
                        </button>
                    }

                    <span id="commentVote" className="float-end">
                        <button onClick={handleVoteButton} className="btn-sm btn-info" type="button">{'추천 ' + voteCount}</button>
                    </span>

                    {
                        onHideReplyComment &&
                        <Container className="container" id="replyList">
                            {
                                replyComment &&
                                replyComment.map((reply) => (
                                    <ReplyComment reply={reply} />
                                ))
                            }
                            <WriteReplyComment setWritingReplyComment={setWritingReplyComment}
                                               setReplyCount={setReplyCount}
                                               replyCount={replyCount}
                                               parentCommentId={comment.commentId}
                                               articleId={articleId}
                                               identity={identity} />
                        </Container>
                    }
                </Container>
            }
        </>
    );
};

export default Comment;
