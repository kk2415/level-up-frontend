import React from 'react';
import {useNavigate as navigate} from 'react-router-dom'
import ChannelArticleService from "../../../api/service/channel/ChannelArticleService";

const PostRow = ({info, channelId}) => {

    const deletePost = async () => {
        if (window.confirm('삭제하시겠습니까?')) {
            let result = await ChannelArticleService.delete(info.id, channelId);
            if (result) {
                alert('게시물이 삭제되었습니다.')
                navigate('/channel/' + channelId + '/manager')
            }
        }
    }

    return (
            <li className="list-group-item">
                <span className="float-start">{info.writer}</span>
                <span className='mx-5'><a href="">{info.title}</a></span>
                <button onClick={deletePost} className="btn-sm btn-primary btn float-end">삭제</button>
            </li>
    );
};

export default PostRow;
