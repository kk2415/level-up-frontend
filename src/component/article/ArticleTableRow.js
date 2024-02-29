import React from 'react';
import $ from 'jquery'
import {useNavigate} from 'react-router-dom'

const ArticleTableRow = ({info, url}) => {
    const navigate = useNavigate();

    const titleHandler = () => {
        navigate(url)
        // window.location.href = url
    }

    const onMouseEnter = () => {
        $('#' + info.id).css('text-decoration', 'underline')
        $('#' + info.id).css('cursor', 'pointer')
    }

    const onMouseLeave = () => {
        $('#' + info.id).css('text-decoration', 'none')
    }

    return (
        <>
            {
                info &&
                <tr id="articleRow">
                    <td>{info.id}</td>
                    <td id={info.id} onMouseOver={onMouseEnter} onMouseOut={onMouseLeave} onClick={titleHandler}>{info.title + ' [' + info.commentCount + ']'}</td>
                    <td>{info.writer}</td>
                    <td>{info.views}</td>
                    <td>{info.voteCount}</td>
                    <td>{info.createdAt}</td>
                </tr>
            }
        </>
    );
};

export default ArticleTableRow;
