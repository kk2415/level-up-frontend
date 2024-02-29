import React, {useState, useEffect} from 'react';
import {Container, Row} from "react-bootstrap";
import $ from "jquery";

import ChannelService from '../../api/service/channel/ChannelService'
import ChannelMemberService from "../../api/service/channel/ChannelMemberService";

import {UserInfo} from "../../api/const/UserInfo";
import HorizonLine from "../../component/HorizonLine";
import {AiOutlineImport} from "react-icons/ai";
import MemberRow from "../../component/channel/manager/MemberRow";
import {useNavigate} from "react-router-dom";
import {FileService} from "../../api/service/file/FileService";

const getChannelId = () => {
    let pathname = decodeURI($(window.location).attr('pathname'))

    return Number(pathname.substr(pathname.lastIndexOf('/') + 1))
}

const ChannelInfo = () => {
    let navigate = new useNavigate();

    const handleEnterChannel = () => {
        if (memberEmail === null) {
            alert('로그인해야 합니다.')
            return
        }

        let isChannelMember = false
        channelMembers.map((member) => {
            if (member.memberId === Number(memberId)) {
                isChannelMember = true
                localStorage.setItem(UserInfo.CHANNEL_MEMBER_ID, member.channelMemberId)
            }
        })

        if (isChannelMember) {
            navigate('/channel/' + channelId + '?page=1')
        } else {
            alert('채널에 가입해야 접속이 가능합니다.')
        }
    }

    const handleBack = () => {
        navigate('/')
    }

    const handleModifyChannel = () => {
        navigate('/channel/modify/' + channelId)
    }

    const handleDeleteChannel = async () => {
        if (window.confirm('삭제하시겠습니까?')) {
            let result = await ChannelService.delete(channelId, channelInfo.category)
            if (result) {
                navigate('/')
            }
        }
    }

    const handleRegisterChannel = async () => {
        if (localStorage.getItem(UserInfo.TOKEN)) {
            const channelMember = {
                memberEmail : memberEmail,
                memberNickname : memberNickname,
                isManager : false,
                isWaitingMember : true,
            }
            let result = await ChannelMemberService.create(channelId, memberId, channelMember);

            if (result) {
                alert('신청되었습니다. 매니저가 수락할 때 까지 기다려주세요.')
            }
        }
        else {
            alert('로그인해야합니다.')
        }
    }

    const loadChannelMembers = async (channelId) => {
        const pageable = 'page=0&size=100&sort=id,desc'
        let result = await ChannelMemberService.getAll(channelId, false, pageable);
        let memberIds = parseChannelMemberIds(result.content);
        let profileFiles = await FileService.getFiles(memberIds, 'MEMBER');

        combineChannelMemberAndProfileUrl(result.content, profileFiles)
        setChannelMembers(result.content)
    }

    const combineChannelMemberAndProfileUrl = (channelMembers, profileFiles) => {
        channelMembers.forEach((channelMember, index) => {
            let file = profileFiles.filter(file => file.ownerId === channelMember.memberId);
            channelMember.storeFileName = file[0].uploadFile.storeFileName
        })
    }

    const parseChannelMemberIds = (channelMembers) => {
        let channelIdList = []

        channelMembers.forEach((channelMember, index) => {
            channelIdList.push(channelMember.memberId)
        })
        return channelIdList
    }

    const loadChannelInfo = async (channelId) => {
        let result = await ChannelService.get(channelId)
        setChannelInfo(result)
    }

    const [memberId, setMemberId] = useState(localStorage.getItem(UserInfo.ID))
    const [memberNickname, setMemberNickname] = useState(localStorage.getItem(UserInfo.NICKNAME))
    const [memberEmail, setMemberEmail] = useState(localStorage.getItem(UserInfo.EMAIL))
    const [channelMembers, setChannelMembers] = useState([])
    const [channelInfo, setChannelInfo] = useState({})
    const [channelId, setChannelId] = useState(getChannelId())

    useEffect(() => {
        loadChannelInfo(channelId)
        loadChannelMembers(channelId)
    }, [])

    return (
        <>
            <Container style={{width: '100%', height: '100%'}}>
                <Row>
                    <div id='channelMain' style={{width: '65%', marginRight: 10}}>
                        <div style={{marginBottom: 20}}>
                            <p id='channelName' className='h1'>{channelInfo.name}</p>
                            {
                                channelInfo.managerId === Number(localStorage.getItem(UserInfo.ID)) &&
                                <button onClick={handleModifyChannel} type='button' className='btn btn-secondary float-end'>수정</button>
                            }
                            {
                                channelInfo.managerId === Number(localStorage.getItem(UserInfo.ID)) &&
                                <button onClick={handleDeleteChannel} type='button' className='btn btn-danger float-end'>삭제</button>
                            }
                            <p id='managerName' className='h3' style={{display: 'inline-block', marginRight: 30}}>{channelInfo.managerName}</p>
                            <p id='createdAt' className='h4' style={{display: 'inline-block'}}>{channelInfo.createdAt}</p>
                        </div>
                        <HorizonLine text={""} />
                        <div style={{marginBottom: 20}}>
                            <div className='mb-3'>
                                <p style={{marginRight: 20, padding: 5, backgroundColor: 'violet', borderRadius: 30}} className='h4 d-inline'>
                                    모집 현황
                                </p>
                                <p id='currentMemberNumber' className='h4 d-inline'>{channelInfo.memberCount}</p>
                                <p className='h4 d-inline'>/</p>
                                <p id='limitMemberNumber' className='h4 d-inline'>{channelInfo.limitedMemberNumber}</p>
                            </div>
                            <div className='mb-3'>
                                <p style={{marginRight: 20, padding: 5, backgroundColor: 'violet', borderRadius: 30}} className='h4 d-inline'>
                                    시작 예정
                                </p>
                                <p id='expectedStartDate' className='h4 d-inline'>{channelInfo.expectedStartDate}</p>
                            </div>
                            <div>
                                <p style={{marginRight: 20, padding: 5, backgroundColor: 'violet', borderRadius: 30}} className='h4 d-inline'>
                                    종료 예정
                                </p>
                                <p id='expectedEndDate' className='h4 d-inline'>{channelInfo.expectedEndDate}</p>
                            </div>
                        </div>
                        <HorizonLine text={""} />
                        <div style={{marginBottom: 70}}>
                            <p id="description" className='h5' dangerouslySetInnerHTML={{__html: channelInfo.description}}></p>
                        </div>
                        <HorizonLine text={""} />
                    </div>
                    <div style={{width: '25%'}}>
                        <button style={{width: '100%', marginBottom: 10}} onClick={handleEnterChannel} className="btn btn-sm btn-info" type="button" id="enterStudyButton">
                            <AiOutlineImport className='enterChannel' />
                            <span className='fw-bold'>스터디 접속</span>
                        </button>
                        <div>
                            <button onClick={handleRegisterChannel} style={{width: '100%', marginBottom: 30}} type='button' className='btn btn-primary'>
                                스터디 신청
                            </button>
                        </div>
                        <div style={{borderRadius: 5}} className='border bg-secondary d-flex justify-content-center align-items-center'>
                            <p className='text-white h4'>회원 목록</p>
                        </div>
                        <div style={{minHeight: '60%'}} id='memberList' className='border d-flex flex-column align-items-stretch flex-shrink-0 bg-white pre-scrollable'>
                            {
                                channelMembers &&
                                channelMembers.map((member) => (
                                    <MemberRow member={member} />
                                ))
                            }
                        </div>
                    </div>
                </Row>
            </Container>
        </>
    );
};

export default ChannelInfo;
