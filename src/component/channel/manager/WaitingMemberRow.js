import React from 'react';
import {useNavigate as navigate} from 'react-router-dom'
import ChannelMemberService from "../../../api/service/channel/ChannelMemberService";


const WaitingMemberRow = ({info, channelId}) => {
    const deniedMember = async () => {
        let result = await ChannelMemberService.delete(info.channelMemberId, channelId);

        if (result) {
            alert('채널 가입을 거절하였습니다')
            navigate('/channel/' + channelId + '/manager')
            // window.location.href = '/channel/' + channelId + '/manager'
        }
    }

    const approvalMember = async () => {
        let result = await ChannelMemberService.approval(info.channelMemberId);

        if (result) {
            alert('채널 가입을 승인하였습니다')
            navigate('/channel/' + channelId + '/manager')
            // window.location.href = '/channel/' + channelId + '/manager'
        }
    }

    return (
        <li id="waitingMember" className="list-group-item">
            <span className="float-start">{info.email}</span>
            <button onClick={deniedMember} className="btn-sm btn-primary btn float-end">거절 버튼</button>
            <button onClick={approvalMember} className="btn-sm btn-primary btn float-end">수락 버튼</button>
        </li>
    );
};

export default WaitingMemberRow;
