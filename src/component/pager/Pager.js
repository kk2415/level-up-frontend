import React from 'react';
import {Container} from 'react-bootstrap'
import PagerUnit from "./PagerUnit";
import NoticeList from "../../page/notice/NoticeList";

const Pager = ({currentPage, postsCount, pagerLength, searchCondition, setCurPage, onNext, onPrev}) => {
    let numArr = []
    let startNum = currentPage - (currentPage - 1) % pagerLength
    let loopCount = pagerLength
    let lastPagerNum = Math.floor(postsCount / 10) + 1;

    if ((postsCount % 10) === 0 && (postsCount / 10) > 0) {
        lastPagerNum--
    }

    if (lastPagerNum - startNum < pagerLength) {
        loopCount = lastPagerNum - startNum + 1
    }

    for (let i = 0; i < loopCount; i++) {
        numArr.push(i + startNum)
    }

    const onNextButton = () => (
        onNext(currentPage, lastPagerNum, pagerLength, searchCondition)
    )

    const onPrevButton = () => (
        onPrev(currentPage, lastPagerNum, pagerLength, searchCondition)
    )

    return (
        <Container className='w-100' style={{ textAlign: "center" }}>
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                    <li onClick={onPrevButton} className="page-item">
                        <a className="page-link" href="#" id="previous">Previous</a>
                    </li>
                    {
                        numArr.map((idx) => (
                            <PagerUnit setCurPage={setCurPage} num={idx} />
                        ))
                    }
                    <li onClick={onNextButton} className="page-item">
                        <a className="page-link" href="#" id="next">Next</a>
                    </li>
                </ul>
            </nav>
        </Container>
    );
};

export default Pager;
