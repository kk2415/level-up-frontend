import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import ChannelMemberService from "../../../api/service/channel/ChannelMemberService";

import WaitingMemberRow from "../../../component/channel/manager/WaitingMemberRow";
import Pager from "../../pager/Pager";

const PAGER_LENGTH = 5

const WaitingMemberFrame = ({channelId, waitingMemberCount}) => {

    const [waitingMembers, setWaitingMembers] = useState(null)
    const [curPage, setCurPage] = useState(1)

    const loadWaitingMembers = async (channelId, curPage, PAGER_LENGTH) => {
        const pageable = 'page=' + (curPage - 1) + '&size=' + PAGER_LENGTH + '&sort=id,desc'

        let result = await ChannelMemberService.getAll(channelId, true, pageable);

        setWaitingMembers(result.content)
    }

    const onNext = (currentPage, lastPagerNum, pagerLength, searchCondition) => {
        let startNum = currentPage - (currentPage - 1) % pagerLength
        let nextPage = startNum + pagerLength

        if (nextPage <= lastPagerNum) {
            setCurPage(nextPage)
        }
        else {
            alert("다음 페이지가 없습니다")
        }
    }

    const onPrev = (currentPage, lastPagerNum, pagerLength, searchCondition) => {
        let startNum = currentPage - (currentPage - 1) % pagerLength
        let previousPage = startNum - pagerLength

        if (previousPage > 0) {
            setCurPage(previousPage)
        }
        else {
            alert("이전 페이지가 없습니다")
        }
    }

    useEffect(() => {
        loadWaitingMembers(channelId, curPage, PAGER_LENGTH)
    }, [curPage])

    return (
        <>
            {
                waitingMembers &&
                <div className="col">
                    <div className="card">
                        <h5 className="card-header">신청 회원</h5>
                        <div id="waitingMemberList" className="card-body list-group list-group-flush">
                            {
                                waitingMembers.map((waitingMember) => (
                                    <WaitingMemberRow info={waitingMember} channelId={channelId} />
                                ))
                            }
                        </div>
                        <div className="card-footer">
                            <Pager setCurPage={setCurPage} currentPage={curPage}
                                   pagerLength={PAGER_LENGTH} postsCount={waitingMemberCount}
                                   searchCondition={{}} onNext={onNext} onPrev={onPrev}
                             />
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default WaitingMemberFrame;
