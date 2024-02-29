import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {Container} from 'react-bootstrap'
import {useNavigate} from "react-router-dom";
import $ from 'jquery'

import ChannelService from "../../api/service/channel/ChannelService";
import WaitingMemberFrame from "../../component/channel/manager/WaitingMemberFrame";
import PostFrame from "../../component/channel/manager/PostFrame";
import MemberFrame from "../../component/channel/manager/MemberFrame";

import {UserInfo} from "../../api/const/UserInfo";
import { S3_URL } from "../../api/const/BackEndHost.js"
import {FileService} from "../../api/service/file/FileService";

const ChannelManager = () => {
    const navigate = useNavigate();

    const getChannelId = () => {
        let pathname = decodeURI($(window.location).attr('pathname'))

        return pathname.substring(pathname.indexOf('/', 2) + 1, pathname.lastIndexOf('/'))
    }

    const loadManager = async (channelId) => {
        let result = await ChannelService.getManager(memberId, channelId)
        let thumbnail = await FileService.get(channelId, 'CHANNEL');
        result.thumbnail = thumbnail.uploadFile.storeFileName

        setManager(result)
    }

    const handleChannelModify = () => {
        navigate('/channel/modify/' + channelId)
    }

    const handleBack = () => {
        navigate('/channel/' + channelId + '?page=1')
    }

    const [channelId, setChannelId] = useState(getChannelId())
    const [memberId, setMemberId] = useState(localStorage.getItem(UserInfo.ID))
    const [manager, setManager] = useState(null)

    useEffect(() => {
    })

    useLayoutEffect(() => {
        setChannelId(getChannelId())
        loadManager(channelId)
    },[])

    return (
        <>
            {
                manager &&
                <div className="h-100 row align-items-center">
                    <div className="col">
                        <div className="card text-center">
                            <h5 className="card-header">채널정보</h5>
                            <div className="card-body">
                                <div className="justify-content-center">
                                    <img src={S3_URL + manager.thumbnail} id="thumbnail" className="img-thumbnail img-fluid rounded-circle"
                                         width="200px" height="200px"/>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text" id="inputGroup-sizing-default1">채널명</span>
                                        <input type="text" className="form-control" id="channelName"
                                               aria-label="Sizing example input" value={manager.channelName}
                                               aria-describedby="inputGroup-sizing-default" disabled/>
                                    </div>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text" id="inputGroup-sizing-default2">매니저</span>
                                        <input type="text" className="form-control" id="manager"
                                               aria-label="Sizing example input" value={manager.manager}
                                               aria-describedby="inputGroup-sizing-default" disabled/>
                                    </div>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text" id="inputGroup-sizing-default3">채널 등록일</span>
                                        <input type="text" className="form-control" id="date"
                                               aria-label="Sizing example input" value={manager.date}
                                               aria-describedby="inputGroup-sizing-default" disabled/>
                                    </div>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text" id="inputGroup-sizing-default4">회원수</span>
                                        <input type="text" className="form-control" id="memberCount"
                                               aria-label="Sizing example input" value={manager.memberCount}
                                               aria-describedby="inputGroup-sizing-default" disabled/>
                                    </div>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text" id="inputGroup-sizing-default5">게시글 개수</span>
                                        <input type="text" className="form-control" id="postCount"
                                               aria-label="Sizing example input" value={manager.postCount}
                                               aria-describedby="inputGroup-sizing-default" disabled/>
                                    </div>
                                    <br/>
                                    <div className="row">
                                        <div className="col">
                                            <button onClick={handleChannelModify} className="w-100 btn btn-primary btn-lg"
                                                    type="button" id="updateButton">수정
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <br/>
            <br/>

            {
                manager &&
                <Container className="row row-cols-1 row-cols-md-3 g-4 mb-5">
                    <WaitingMemberFrame channelId={channelId} waitingMemberCount={manager.waitingMemberCount} />
                    <MemberFrame channelId={channelId} memberCount={manager.memberCount} />
                    <PostFrame channelId={channelId} postCount={manager.postCount} />
                </Container>
            }

            <button onClick={handleBack} type="button" className="btn btn-lg btn-secondary mt-5" id="backButton">뒤로가기</button>
        </>
    );
};

export default ChannelManager;
