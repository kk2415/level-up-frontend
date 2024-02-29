import React, {useState, useEffect} from 'react';
import PostRow from "../../../component/channel/manager/PostRow";
import Pager from "../../pager/Pager";

import ChannelArticleService from "../../../api/service/channel/ChannelArticleService";

const PAGER_LENGTH = 5

const PostFrame = ({channelId, postCount}) => {

    const [posts, setPosts] = useState(null)
    const [curPage, setCurPage] = useState(1)

    const loadPosts = async (channelId, curPage, PAGER_LENGTH) => {
        // let url = '/api/' + channelId + '/posts/' + curPage + '?postCount=' + PAGER_LENGTH
        const pageable = 'page=' + (curPage - 1) + '&size=5&sort=id,desc'

        let result = await ChannelArticleService.getAll(channelId, 'CHANNEL_POST', pageable);
        setPosts(result.content)
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
        loadPosts(channelId, curPage, PAGER_LENGTH)
    }, [curPage])

    return (
        <>
            {
                posts &&
                <div className="col">
                    <div className="card">
                        <h5 className="card-header">등록된 게시물</h5>
                        <div id="waitingMemberList" className="card-body list-group list-group-flush">
                            {
                                posts.map((post) => (
                                    <PostRow info={post} channelId={channelId} />
                                ))
                            }
                        </div>
                        <div className="card-footer">
                            <Pager setCurPage={setCurPage} currentPage={curPage}
                                   pagerLength={PAGER_LENGTH} postsCount={postCount}
                                   searchCondition={{}} onNext={onNext} onPrev={onPrev}
                            />
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default PostFrame;
