import React from 'react';
import {Table} from 'react-bootstrap'
import ArticleTableRow from '../article/ArticleTableRow'

export const ChannelTable = ({channelArticle, channelId} ) => {
    return (
        <>
            {
                channelArticle &&
                <Table>
                    <caption className="caption-top fs-3 fw-bold">전체글</caption>
                    <thead>
                    <tr>
                        <th scope="col" className='fs-5 fw-bold'>번호</th>
                        <th scope="col" className='fs-5 fw-bold'>제목</th>
                        <th scope="col" className='fs-5 fw-bold'>글쓴이</th>
                        <th scope="col" className='fs-5 fw-bold'>조회수</th>
                        <th scope="col" className='fs-5 fw-bold'>추천</th>
                        <th scope="col" className='fs-5 fw-bold'>작성일</th>
                    </tr>
                    </thead>
                    <tbody id="tableBody">
                    {
                        channelArticle.map((info) => (
                            <ArticleTableRow info={info} url={'/channel-article/' + info.id + '?channel=' + channelId} />
                        ))
                    }
                    </tbody>
                </Table>
            }
        </>
    );
};
