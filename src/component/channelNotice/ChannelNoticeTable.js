import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {Table, Container, Col, Row, Form, Button, Card} from 'react-bootstrap'
import ArticleTableRow from '../article/ArticleTableRow'

export const ChannelNoticeTable = ({notices, channelId}) => {
    return (
        <>
            {
                <Table>
                    <caption className="caption-top fs-3 fw-bold">채널 공지</caption>
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
                        notices &&
                        notices.map((info) => (
                            <ArticleTableRow
                                info={info}
                                url={'/channel-notice/detail/' + info.id + '?channel=' + channelId} />
                        ))
                    }
                    </tbody>
                </Table>
            }
        </>
    );
};
