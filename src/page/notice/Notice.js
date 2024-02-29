import React, {useState, useEffect, useLayoutEffect} from 'react';
import {Container} from 'react-bootstrap'
import $ from 'jquery'

import VoteService from "../../api/service/article/VoteService";
import ArticleService from "../../api/service/article/ArticleService";

import CommentFrame from '../../component/comment/CommentFrame'
import {useNavigate} from "react-router-dom";
import {UserInfo} from "../../api/const/UserInfo";

const Notice = () => {
    const navigate = useNavigate();

    const getArticleType = () => {
        let queryString = decodeURI($(window.location).attr('search'))

        return queryString.substr(queryString.indexOf('=') + 1)
    }

    const getArticleId = () => {
        let pathname = decodeURI($(window.location).attr('pathname'))

        return pathname.substr(pathname.lastIndexOf('/') + 1)
    }

    const handleArticleListButton = () => {
        navigate('/notice/list?articleType=' + articleType + '&page=1')
    }

    const handlePrevArticleButton = async () => {
        let prev = await ArticleService.getPrev(articleId, articleType)

        if (prev != null) {
            navigate('/notice/' + prev.id + '?articleType=' + articleType)
        }
        else {
            alert("이전 페이지가 없습니다.")
        }
    }

    const handleNextArticleButton = async () => {
        let next = await ArticleService.getNext(articleId, articleType)

        if (next != null) {
            navigate('/notice/' + next.id + '?articleType=' + articleType)
        }
        else {
            alert("다음 페이지가 없습니다.")
        }
    }

    const handleModifyButton = () => {
        navigate('/notice/modify/' + articleId +  '?articleType=' + articleType)
    }

    const handleDeleteButton = async () => {
        if (window.confirm('삭제하시겠습니까?')) {
            let result = await ArticleService.delete(articleId, articleType);
            if (result) {
                navigate('/notice/list?articleType=' + articleType + '&page=1')
            }
        }
    }

    const authorize = (article) => {
        if (article && Number(memberId) === article.memberId) {
            setAuthentication(true)
        }
    }

    const createVote = async () => {
        if (!token) {
            alert('로그인 해야합니다')
            return
        }

        let voteRequest = {
            'memberId' : memberId,
            'targetId' : articleId,
            'voteType' : 'ARTICLE',
        }

        let result = await VoteService.create(voteRequest)
        if (result != null) {
            setVoteCount(result.successful === false ? voteCount - 1 : voteCount + 1)
        }
    }

    const loadArticle = async (articleId) => {
        let article = await ArticleService.get(articleId, articleType)

        setArticle(article)
        setVoteCount(article.voteCount)
    }

    const [token, setToken] = useState(localStorage.getItem(UserInfo.TOKEN))
    const [memberId, setMemberId] = useState(localStorage.getItem(UserInfo.ID))
    const [articleType, setArticleType] = useState(getArticleType())
    const [article, setArticle] = useState(null)
    const [articleId, setArticleId] = useState(getArticleId())
    const [authentication, setAuthentication] = useState(false)
    const [voteCount, setVoteCount] = useState(0)

    useEffect(() => {
        authorize(article)
    }, [article])

    useLayoutEffect(() => {
        setArticleId(getArticleId())
        loadArticle(articleId)
    }, [])

    return (
        <>
            {
                article &&
                <Container>
                    <div className="row">
                        <div className="col border-bottom">
                            <p id="writer" className="h6">{article.writer}</p>
                            <h1 id="title" className="display-3">{article.title}</h1>
                            <br/>
                            <p className="h6">
                                <span>작성일
                                    &nbsp;
                                    <span id="dateCreated">{article.createdAt}</span>
                                </span>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <span>조회&nbsp;
                                    <span id="views">{article.views}</span>
                                </span>
                                &nbsp;&nbsp;&nbsp;
                                <span>추천
                                    &nbsp;
                                    <span id="voteCount">{voteCount}</span>
                                </span>
                                &nbsp;&nbsp;&nbsp;
                                <span>
                                    댓글&nbsp;
                                    <span id="commentCount">{article.commentCount}</span>
                                </span>

                                <span className="d-grid gap-2 d-md-block float-end">
                                    <button onClick={createVote} id="vote" className="btn-sm btn btn-primary">
                                        {'추천 ' + voteCount}
                                    </button>
                                </span>
                            </p>
                        </div>

                        <div className="w-100"/>

                        <div className="col-lg-11">
                            <h1 className="display-6">
                                <p dangerouslySetInnerHTML={{ __html: article.content }}/>
                            </h1>
                            <br/><br/><br/><br/>
                        </div>

                        <div className="w-100"/>

                        <div className="d-grid gap-2 d-md-block float-end">
                            {
                                authentication &&
                                <button onClick={handleModifyButton} className="btn btn-secondary btn-sm" type="button" id="modifyButton">
                                    수정
                                </button>
                            }
                            {
                                authentication &&
                                <button onClick={handleDeleteButton} className="btn btn-danger btn-sm" type="button" id="deleteButton">
                                    삭제
                                </button>
                            }
                        </div>
                    </div>

                    <hr/>



                    <CommentFrame articleId={articleId} identity={'CHANNEL_NOTICE'} />

                    <div>
                        <button onClick={handleArticleListButton} className="btn btn-dark float-start" type="button" id="allPostButton">
                            목록으로
                        </button>
                        <div className="d-grid gap-2 d-md-block float-end">
                            <button onClick={handleNextArticleButton} className="btn btn-dark" type="button" id="nextPostButton">다음글
                            </button>
                            <button onClick={handlePrevArticleButton} className="btn btn-dark" type="button" id="prevPostButton">이전글
                            </button>
                        </div>
                    </div>
                </Container>
            }
        </>
    );
};

export default Notice;
