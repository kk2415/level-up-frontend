import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom'

import $ from 'jquery'
import {Container, Form, Row} from 'react-bootstrap'
import { ArticleTable } from '../../component/article/ArticleTable'
import {UserInfo} from "../../api/const/UserInfo";
import Pager from "../../component/pager/Pager";
import ArticleService from "../../api/service/article/ArticleService";

const NoticeList = ({onClick}) => {
    const navigate = useNavigate();

    const getBoardTitle = (articleType) => {
        switch (articleType) {
            case 'QNA' :
                return 'Q&A'
            case 'NOTICE' :
                return '공지사항'
            case 'CHANNEL_NOTICE' :
                return '채널 공지사항'
            default :
                return '채널'
        }
    }

    const getArticleType = () => {
        let queryString = decodeURI($(window.location).attr('search'))

        return queryString.substring(queryString.indexOf('=') + 1, queryString.indexOf('&'))
    }

    const getSearchCondition = () => {
        let queryString = decodeURI($(window.location).attr('search'))
        let searchCondition = {}

        if (!queryString.includes("field", 0) || !queryString.includes("query", 0)) {
            searchCondition.field = ""
            searchCondition.querys = ""
        }

        if (queryString.includes("field", 0)) {
            let queryStringOfPostSearch = queryString.substr(queryString.search("field"));
            let firstIndex = queryStringOfPostSearch.indexOf("=") + 1;
            let endIndex = queryStringOfPostSearch.indexOf("&");

            searchCondition.field = queryStringOfPostSearch.substring(firstIndex, endIndex)
        }

        if (queryString.includes("query", 0)) {
            let queryStringOfPostSearch = queryString.substr(queryString.search("query"));
            let firstIndex = queryStringOfPostSearch.indexOf("=") + 1
            searchCondition.querys = queryStringOfPostSearch.substr(firstIndex)
        }

        return searchCondition
    }

    const getCurrentPage = () => {
        let queryString = decodeURI($(window.location).attr('search'))

        let pageStartQueryString = queryString.substr(queryString.indexOf('page'));

        if (pageStartQueryString.indexOf('&') !== -1) {
            return pageStartQueryString.substring(pageStartQueryString.indexOf('=') + 1, pageStartQueryString.indexOf('&'))
        }

        return Number(pageStartQueryString.substr(pageStartQueryString.indexOf('=') + 1))
    }

    const searchKeyDown = (event) => {
        if (event.keyCode === 13) {
            handleArticleSearch()
        }
    }

    const handleGoHome = () => {
        navigate('/')
    }

    const handleWriting = () => {
        if (localStorage.getItem(UserInfo.TOKEN)) {
            navigate('/notice/create?articleType=' + articleType)
        }
        else {
            alert('로그인해야됩니다.')
        }
    }

    const onPagerNextButton = async (currentPage, lastPagerNum, pagerLength, searchCondition) => {
        let startNum = currentPage - (currentPage - 1) % pagerLength
        let nextPage = startNum + pagerLength

        let url = '/notice/list?articleType=' + articleType + '&page=' + nextPage + '&field=' + searchCondition.field +
            '&query=' + searchCondition.querys

        if (searchCondition.field === "" || searchCondition.querys === "") {
            url = '/notice/list?articleType=' + articleType + '&page=' + nextPage
        }

        if (nextPage <= lastPagerNum) {
            setCurPage(nextPage)
            navigate(url)
        }
        else {
            alert("다음 페이지가 없습니다")
        }
    }

    const onPagerPrevButton = async (currentPage, lastPagerNum, pagerLength, searchCondition) => {
        let startNum = currentPage - (currentPage - 1) % pagerLength
        let previousPage = startNum - pagerLength

        let url = '/notice/list?articleType=' + articleType + '&page=' + previousPage + '&field=' + searchCondition.field +
            '&query=' + searchCondition.querys

        if (searchCondition.field === "" || searchCondition.querys === "") {
            url = '/notice/list?articleType=' + articleType + '&page=' + previousPage
        }

        if (previousPage > 0) {
            setCurPage(previousPage)
            navigate(url)
        }
        else {
            alert("이전 페이지가 없습니다")
        }
    }

    const handleArticleSearch = async (event) => {
        event.preventDefault()

        let searchCondition = {
            field : $('#field').val(),
            querys : $('#search').val(),
        }

        const pageable = 'page=0&size=10&sort=id,desc'
        let url = '/notice/list?articleType=' + articleType + '&page=1&field=' + searchCondition.field + '&query=' + searchCondition.querys
        if (searchCondition.field === "" || searchCondition.querys === "") {
            url = '/notice/list?articleType=' + articleType + '&page=1'
        }

        let result = await ArticleService.getAll(articleType, pageable, searchCondition)
        console.log(result)

        setArticle(result.content)
        setArticleCount(result.totalElements)

        setCurPage(1)
        navigate(url)
    }

    const loadArticles = async (articleType) => {
        let searchCondition = getSearchCondition()

        let url = '/notice/list?articleType=' + articleType + '&page=' + (curPage - 1) + '&field=' + searchCondition.field + '&query=' + searchCondition.querys
        if (searchCondition.field === "" || searchCondition.querys === "") {
            url = '/notice/list?articleType=' + articleType + '&page=' + (curPage - 1)
        }

        const pageable = 'page=' + (curPage - 1) + '&size=10&sort=id,desc'
        let result = await ArticleService.getAll(articleType, pageable, searchCondition)
        if (result) {
            setArticle(result.content)
            setArticleCount(result.totalElements)
        }
        navigate(url)
    }

    const PAGER_LENGTH = 5

    const [articleType, setArticleType] = useState(getArticleType())
    const [boardTitle, setBoardTitle] = useState(getBoardTitle(getArticleType()))
    const [searchCondition, setSearchCondition] = useState(getSearchCondition())

    const [curPage, setCurPage] = useState(getCurrentPage())
    const [articleCount, setArticleCount] = useState(0)
    const [article, setArticle] = useState(null)

    useEffect(() => {
        loadArticles(articleType)
    }, [curPage])

    return (
        <>
            {
                article &&
                <Container>
                    <Container>
                        <Row className='d-flex justify-content-center align-items-center'>
                            <h2 className="page-section-heading text-center text-uppercase text-secondary mb-3" id="channelName">
                                {boardTitle} 게시판
                            </h2>
                        </Row>
                    </Container>

                    <div className="row">
                        <div className="col-lg-6 col-sm-12 text-lg-start text-center">
                        </div>
                        <div className="col-lg-6 col-sm-12 text-lg-end text-center">
                            <nav className="navbar navbar-expand-lg navbar-light float-end">
                                <div className="container-fluid">
                                    <div>
                                        <select className="form-control form-control-sm" id="field" name="field">
                                            <option value="title">제목</option>
                                            <option value="writer">작성자</option>
                                        </select>
                                    </div>
                                    <Form className="navbar-form navbar-right">
                                        <div className="input-group">
                                            <input type="Search"
                                                   onKeyDown={searchKeyDown}
                                                   onKeyPress={searchKeyDown}
                                                   id="search"
                                                   name="search"
                                                   placeholder="Search..."
                                                   className="form-control"/>
                                            <div className="input-group-btn">
                                                <button onClick={handleArticleSearch} id="articleSearchButton" className="btn btn-info">
                                                    <span className="glyphicon glyphicon-search" />
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            </nav>
                        </div>
                    </div>

                    <ArticleTable articles={article} />

                    <div className="row">
                        <div className="col-lg-6 col-sm-12 text-lg-start text-center">
                            <button onClick={handleGoHome} type="button" className="btn btn-secondary btn-sm" id="backButton">홈으로</button>
                        </div>
                        <div className="col-lg-6 col-sm-12 text-lg-end text-center">
                            <button onClick={handleWriting} type="button" className="btn btn-secondary btn-sm" id="postingButton">글쓰기</button>
                        </div>
                    </div>

                    <Pager
                        currentPage={curPage}
                        postsCount={articleCount}
                        pagerLength={PAGER_LENGTH}
                        searchCondition={searchCondition}
                        setCurPage={setCurPage}
                        onNext={onPagerNextButton}
                        onPrev={onPagerPrevButton}
                    />

                </Container>
            }
        </>
    );
};

export default NoticeList;
