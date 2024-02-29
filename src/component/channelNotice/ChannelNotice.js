import React, {useState, useEffect, useLayoutEffect} from 'react';
import {Container} from 'react-bootstrap'

import ChannelArticleService from '../../api/service/channel/ChannelArticleService'
import {ChannelNoticeTable} from "./ChannelNoticeTable";
import {AiFillCaretRight, AiFillCaretLeft} from "react-icons/ai";

import {useNavigate as navigate} from 'react-router-dom'

const ChannelNotice = ({channelId}) => {

    const [curNoticePage, setCurNoticePage] = useState(1)
    const [notice, setNotice] = useState(null)
    const [noticeCount, setNoticeCount] = useState(0)

    const handleCreateNotice = () => {
        navigate('/channel-notice/create?channel=' + channelId)
        // window.location.href = '/channel-notice/create?channel=' + channelId
    }

    const handleNextNoticeList = () => {
        let lastNum = Math.floor(noticeCount / 5) + 1

        if (curNoticePage + 1 > lastNum) {
            alert("다음 페이지가 없습니다.")
        }
        else {
            setCurNoticePage(curNoticePage + 1)
        }
    }

    const handlePrevNoticeList = () => {
        if (curNoticePage - 1 <= 0) {
            alert("이전 페이지가 없습니다.")
        }
        else {
            setCurNoticePage(curNoticePage - 1)
        }
    }

    const handleManageChannel = () => {
        navigate('/channel/' + channelId + '/manager')
        // window.location.href = '/channel/' + channelId + '/manager'
    }

    const loadNotice = async (channelId) => {
        const pageable = 'page=' + (curNoticePage - 1) + '&size=5&sort=id,desc'


        let result = await ChannelArticleService.getAll(channelId, 'CHANNEL_NOTICE', pageable)

        if (result) {
            setNotice(result.content)
            setNoticeCount(result.totalElements)
        }
    }

    useEffect(() => {
        loadNotice(channelId)
    }, [curNoticePage])

    useLayoutEffect(() => {
        setCurNoticePage(1)
    }, [])

    return (
        <Container>
            <Container className="row row-cols-1">
                <div className="col">
                    <ChannelNoticeTable notices={notice} channelId={channelId} page={curNoticePage} />
                </div>
                <div className="col">
                    <div className="d-grid gap-2 d-md-block float-end">
                        {/*<button className="btn btn-secondary btn-sm" type="button" id="deleteNoticeAll">*/}
                        {/*    일괄삭제*/}
                        {/*</button>*/}
                        <button onClick={handleCreateNotice} className="btn btn-secondary btn-sm" type="button" id="createNotice">
                            글쓰기
                        </button>
                    </div>
                    <br/><br/><br/><br/>
                </div>
                <div className="col">
                    <div className="d-grid gap-2 d-md-block float-end">
                        <button onClick={handlePrevNoticeList} className="btn btn-secondary btn-sm" type="button" id="prevNoticeList">
                            <AiFillCaretLeft/>
                        </button>
                        <button onClick={handleNextNoticeList} className="btn btn-secondary btn-sm" type="button" id="nextNoticeList">
                            <AiFillCaretRight/>
                        </button>
                    </div>
                </div>
            </Container>
        </Container>
    );
};

export default ChannelNotice;
