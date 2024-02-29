import React, {useState, useEffect, useLayoutEffect} from 'react';
import {Container} from 'react-bootstrap'
import {useNavigate} from "react-router-dom";
import $ from 'jquery'

import ChannelArticleService from '../../api/service/channel/ChannelArticleService'
import ChannelCommentFrame from "../../component/channel/ChannelComment/ChannelCommentFrame";
import ChannelVoteService from "../../api/service/channel/ChannelVoteService";

import {UserInfo} from "../../api/const/UserInfo";

const DetailChannelArticle = () => {
    const navigate = useNavigate();

    const getPostId = () => {
        let pathname = decodeURI($(window.location).attr('pathname'))
        return pathname.substr(pathname.lastIndexOf('/') + 1)
    }

    const getChannelId = () => {
        let search = decodeURI($(window.location).attr('search'))
        return search.substr(search.indexOf('=') + 1)
    }

    const handleGoChannelButton = () => {
        navigate('/channel/' + channelId + '?page=1')
    }

    const handlePrevPostButton = async () => {
        let prev = await ChannelArticleService.getPrev(articleId, channelId)

        if (prev != null) {
            navigate('/channel-article/' + prev.id + '?channel=' + channelId)
        }
        else {
            alert("이전 페이지가 없습니다.")
        }
    }

    const handleNextPostButton = async () => {
        let next = await ChannelArticleService.getNext(articleId, channelId)

        if (next != null) {
            navigate('/channel-article/' + next.id + '?channel=' + channelId)
        }
        else {
            alert("다음 페이지가 없습니다.")
        }
    }

    const handleModifyButton = () => {
        navigate('/channel-article/modify/' + articleId + '?channel=' + channelId)
    }

    const handleDeleteButton = async () => {
        if (window.confirm('삭제하시겠습니까?')) {
            let result = await ChannelArticleService.delete(articleId, channelId);
            if (result) {
                alert('삭제되었습니다.')
                navigate('/channel/' + channelId + '?page=1')
            }
        }
    }

    const loadArticle = async (articleId) => {
        let article = await ChannelArticleService.get(articleId, channelId, true)

        setArticle(article)
        setVoteCount(article.voteCount)
    }

    const authorize = (article) => {
        if (article && Number(memberId) === article.memberId) {
            setAuthentication(true)
        }
    }

    const handleVoteButton = async () => {
        if (!token) {
            alert('로그인 해야합니다.')
            return
        }

        let voteRequest = {
            'memberId' : channelMemberId,
            'channelId' : channelId,
            'targetId' : article.id,
            'voteType' : 'ARTICLE',
        }

        let result = await ChannelVoteService.create(voteRequest)
        if (result != null) {
            setVoteCount(result.successful === false ? voteCount - 1 : voteCount + 1)
        }
    }

    const [memberId, setMemberId] = useState(localStorage.getItem(UserInfo.ID))
    const [channelMemberId, setChannelMemberId] = useState(localStorage.getItem(UserInfo.CHANNEL_MEMBER_ID))
    const [token, setToken] = useState(localStorage.getItem(UserInfo.TOKEN))
    const [article, setArticle] = useState(null)
    const [articleId, setArticleId] = useState(getPostId())
    const [channelId, setChannelId] = useState(getChannelId())
    const [authentication, setAuthentication] = useState(false)
    const [voteCount, setVoteCount] = useState(0)

    useEffect(() => {
        authorize(article)
    }, [article])

    useLayoutEffect(() => {
        setArticleId(getPostId())
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
                                    <button onClick={handleVoteButton} id="vote" className="btn-sm btn btn-info">
                                        {'추천 ' + voteCount}
                                    </button>
                                </span>
                            </p>
                        </div>

                        <div className="w-100"></div>

                        <div className="col-lg-11">
                            <h1 className="display-6">
                                <p dangerouslySetInnerHTML={{ __html: article.content }}></p>
                            </h1>
                            <br/><br/><br/><br/>
                        </div>

                        <div className="w-100"></div>

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
                    <ChannelCommentFrame articleId={articleId} channelId={channelId} />

                    <div>
                        <button onClick={handleGoChannelButton} className="btn btn-dark float-start" type="button" id="allPostButton">목록으로
                        </button>
                        <div className="d-grid gap-2 d-md-block float-end">
                            <button onClick={handleNextPostButton} className="btn btn-dark" type="button" id="nextPostButton">
                                다음글
                            </button>
                            <button onClick={handlePrevPostButton} className="btn btn-dark" type="button" id="prevPostButton">
                                이전글
                            </button>
                        </div>
                    </div>
                </Container>
            }
        </>
    );
};

export default DetailChannelArticle;
