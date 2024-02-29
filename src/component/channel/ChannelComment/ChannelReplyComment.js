import React, {useState} from 'react';
import {Container} from 'react-bootstrap'

import ChannelVoteService from "../../../api/service/channel/ChannelVoteService";

import {UserInfo} from "../../../api/const/UserInfo";

const ChannelReplyComment = ({reply, channelId}) => {

    const handleVoteButton = async () => {
        if (!token) {
            alert('로그인 해야합니다')
            return
        }

        let voteRequest = {
            'memberId' : channelMemberId,
            'channelId' : channelId,
            'targetId' : reply.commentId,
            'voteType' : 'COMMENT',
        }

        let result = await ChannelVoteService.create(voteRequest)
        if (result != null) {
            setVoteCount(result.successful === false ? voteCount - 1 : voteCount + 1)
        }
    }

    const [memberId, setMemberId] = useState(localStorage.getItem(UserInfo.ID))
    const [channelMemberId, setChannelMemberId] = useState(localStorage.getItem(UserInfo.CHANNEL_MEMBER_ID))
    const [token, setToken] = useState(localStorage.getItem(UserInfo.TOKEN))
    const [voteCount, setVoteCount] = useState(reply.voteCount)

    return (
        <>
            <Container>
                <div className="col bg-secondary text-dark bg-opacity-10" id="replyEmailAndDate">
                    <span id="replyEmail">{reply.nickname}</span>
                    <br/>
                    <span id="replyDate">{reply.createdAt}</span>
                </div>

                <div className="w-100"/>

                <div className="col bg-secondary text-dark bg-opacity-10 d-flex" id="replyContent">
                    {reply.content}
                    <div className="overflow-auto"/>
                </div>

                <div className="col bg-secondary text-dark bg-opacity-10" id="replyVote">
                    <span onClick={handleVoteButton} id="replyVoteButton" className="btn-sm btn btn-info" type="button">
                        {'추천 ' + voteCount}
                    </span>
                    <br/><br/>
                </div>
                <hr/>
            </Container>
        </>
    );
};

export default ChannelReplyComment;
