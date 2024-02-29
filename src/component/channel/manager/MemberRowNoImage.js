import React, {useState, useEffect} from 'react';
import ChannelMemberService from "../../../api/service/channel/ChannelMemberService";

const MemberRowNoImage = ({info, channelId}) => {
    const [onDeleteButton, setOnDeleteButton] = useState(false)

    const deniedMember = async () => {
        let result = await ChannelMemberService.delete(info.channelMemberId, channelId);

        if (result) {
            alert('회원을 강제퇴장시켰습니다.')
            setOnDeleteButton(!onDeleteButton)
        }
    }

    useEffect(() => {
    }, [onDeleteButton])

    return (
        <>
            {
                !info.manager &&
                <li id="member" className="list-group-item">
                    <span className="float-start">{info.email}</span>
                    <button onClick={deniedMember} className="btn-sm btn-primary btn float-end">퇴장</button>
                </li>
            }
        </>
    );
};

export default MemberRowNoImage;
