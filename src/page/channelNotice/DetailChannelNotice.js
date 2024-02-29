import React, {useState, useEffect, useLayoutEffect} from 'react';
import {Container} from 'react-bootstrap'
import {useNavigate} from "react-router-dom";
import $ from 'jquery'

import ChannelArticleService from '../../api/service/channel/ChannelArticleService'
import CommentFrame from '../../component/comment/CommentFrame'
import VoteService from "../../api/service/article/VoteService";

import {UserInfo} from "../../api/const/UserInfo";

const DetailChannelNotice = () => {
    const navigate = useNavigate();

    const getChannelNoticeId = () => {
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
        let prev = await ChannelArticleService.getPrev(channelNoticeId, 'CHANNEL_NOTICE', channelId)

        if (prev != null) {
            navigate('/channel-notice/detail/' + prev.id + '?channel=' + channelId)
        }
        else {
            alert("이전 페이지가 없습니다.")
        }
    }

    const handleNextPostButton = async () => {
        let next = await ChannelArticleService.getNext(channelNoticeId, 'CHANNEL_NOTICE', channelId)

        if (next != null) {
            navigate('/channel-notice/detail/' + next.id + '?channel=' + channelId)
        }
        else {
            alert("다음 페이지가 없습니다.")
        }
    }

    const handleModifyButton = () => {
        navigate('/channel-notice/modify/' + channelNoticeId + '?channel=' + channelId)
    }

    const handleDeleteButton = async () => {
        if (window.confirm('삭제하시겠습니까?')) {
            let result = await ChannelArticleService.delete(channelNoticeId, channelId)
            if (result) {
                alert('삭제되었습니다.')
                navigate('/channel/' + channelId + '?page=1')
            }
        }
    }

    const loadChannelNotice = async (channelNoticeId) => {
        let notice = await ChannelArticleService.get(channelNoticeId, channelId, 'true')

        setChannelNotice(notice)
        setVoteCount(notice.voteCount)
    }

    const authorize = (channelNotice) => {
        if (channelNotice && Number(memberId) === channelNotice.memberId) {
            setAuthentication(true)
        }
    }

    const createVote = async () => {
        if (memberId === null || memberId === '') {
            alert('로그인을 해야합니다.')
            return
        }

        let voteRequest = {
            'memberId' : memberId,
            'targetId' : channelNoticeId,
            'voteType' : 'ARTICLE',
        }

        let result = await VoteService.create(voteRequest)
        if (result != null) {
            setVoteCount(result.successful === false ? voteCount - 1 : voteCount + 1)
        }
    }

    const [memberId, setMemberId] = useState(localStorage.getItem(UserInfo.ID))
    const [channelNotice, setChannelNotice] = useState(null)
    const [channelNoticeId, setChannelNoticeId] = useState(getChannelNoticeId())
    const [channelId, setChannelId] = useState(getChannelId())
    const [authentication, setAuthentication] = useState(false)
    const [voteCount, setVoteCount] = useState(0)

    useEffect(() => {
        authorize(channelNotice)
    }, [channelNotice])

    useLayoutEffect(() => {
        setChannelNoticeId(getChannelNoticeId())
        loadChannelNotice(channelNoticeId)
    }, [])

    return (
        <>
            {
                channelNotice &&
                <Container>
                    <div className="row">
                        <div className="col border-bottom">
                            <p id="writer" className="h6">{channelNotice.writer}</p>
                            <h1 id="title" className="display-3">{channelNotice.title}</h1>
                            <br/>
                            <p className="h6">
                                <span>작성일
                                    &nbsp;
                                    <span id="dateCreated">{channelNotice.createdAt}</span>
                                </span>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <span>조회&nbsp;
                                    <span id="views">{channelNotice.views}</span>
                                </span>
                                &nbsp;&nbsp;&nbsp;
                                <span>추천
                                    &nbsp;
                                    <span id="voteCount">{voteCount}</span>
                                </span>
                                &nbsp;&nbsp;&nbsp;
                                <span>
                                    댓글&nbsp;
                                    <span id="commentCount">{channelNotice.commentCount}</span>
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
                                <p dangerouslySetInnerHTML={{ __html: channelNotice.content }}/>
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
                    <CommentFrame articleId={channelNoticeId} identity={'CHANNEL_NOTICE'} />

                    <div>
                        <button onClick={handleGoChannelButton} className="btn btn-dark float-start" type="button" id="allPostButton">
                            목록으로
                        </button>
                        <div className="d-grid gap-2 d-md-block float-end">
                            <button onClick={handleNextPostButton} className="btn btn-dark" type="button" id="nextPostButton">다음글
                            </button>
                            <button onClick={handlePrevPostButton} className="btn btn-dark" type="button" id="prevPostButton">이전글
                            </button>
                        </div>
                    </div>
                </Container>
            }
        </>
    );
};

export default DetailChannelNotice;
