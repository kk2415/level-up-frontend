import React, {useState, useEffect} from 'react';
import {Container} from 'react-bootstrap'
import CommentService from "../../api/service/article/CommentService";
import Comment from './Comment'
import {UserInfo} from "../../api/const/UserInfo";

import $ from 'jquery'

const CommentFrame = ({articleId, identity}) => {

    const handleCreateCommentButton = async () => {
        let comment = {
            articleId : articleId,
            content : $('#contentOfWritingComment').val(),
            identity : identity,
        }

        if (localStorage.getItem(UserInfo.TOKEN)) {
            await CommentService.create(comment, localStorage.getItem(UserInfo.ID))
            $('#contentOfWritingComment').val('')
            setOnComments(!onComments)
        }
        else {
            alert("댓글을 작성하려면 로그인을 해야합니다.")
        }
    }

    const loadComment = async (articleId, identity) => {
        let result = await CommentService.get(articleId, identity)
        setComments(result)
    }

    const [comments, setComments] = useState(null)
    const [onComments, setOnComments] = useState(false)

    useEffect(() => {
        loadComment(articleId, identity)
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
                            <Comment comment={info} articleId={articleId} identity={identity} />
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

export default CommentFrame;