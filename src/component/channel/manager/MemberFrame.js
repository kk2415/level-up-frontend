import React, {useState, useEffect} from 'react';
import MemberRowNoImage from "./MemberRowNoImage"
import Pager from "../../pager/Pager";
import ChannelMemberService from "../../../api/service/channel/ChannelMemberService";

const PAGER_LENGTH = 5

const MemberFrame = ({channelId, memberCount}) => {

    const [members, setMembers] = useState(null)
    const [curPage, setCurPage] = useState(1)

    const loadMembers = async (channelId, curPage, PAGER_LENGTH) => {
        const pageable = 'page=' + (curPage - 1) + '&size=' + PAGER_LENGTH + '&sort=id,desc'

        let result = await ChannelMemberService.getAll(channelId, false, pageable);

        setMembers(result.content)
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
        loadMembers(channelId, curPage, PAGER_LENGTH)
    }, [curPage])

    return (
        <>
            {
                members &&
                <div className="col">
                    <div className="card">
                        <h5 className="card-header">가입 회원</h5>
                        <div id="waitingMemberList" className=" card-body list-group list-group-flush">
                            {
                                members.map((member) => (
                                    <MemberRowNoImage info={member} channelId={channelId} />
                                ))
                            }
                        </div>
                        <div className="card-footer">
                            <Pager setCurPage={setCurPage} currentPage={curPage}
                                   pagerLength={PAGER_LENGTH} postsCount={memberCount}
                                   searchCondition={{}} onNext={onNext} onPrev={onPrev}
                             />
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default MemberFrame;
