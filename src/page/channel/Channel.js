import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom'

import $ from 'jquery'
import ChannelService from '../../api/service/channel/ChannelService'
import {Container, Form, Tabs, Tab, Row} from 'react-bootstrap'
import { ChannelTable } from '../../component/channel/ChannelTable'
import {UserInfo} from "../../api/const/UserInfo";
import Pager from "../../component/pager/Pager";
import ChannelNotice from '../../component/channelNotice/ChannelNotice'
import ChannelArticleService from "../../api/service/channel/ChannelArticleService";

const Channel = () => {
    const navigate = useNavigate();

    const getChannelId = () => {
        let pathname = $(window.location).attr('pathname')

        return pathname.substr(pathname.lastIndexOf('/') + 1)
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

        if (queryString.indexOf('&') !== -1) {
            return queryString.substring(queryString.indexOf('=') + 1, queryString.indexOf('&'))
        }

        return Number(queryString.substr(queryString.indexOf('=') + 1))
    }

    const handleWritingButton = () => {
        if (token) {
            navigate('/channel-article/create?channel=' + channelId)
        }
        else {
            alert('로그인해야됩니다.')
        }
    }

    const handleEnterManageChannelButton = () => {
        navigate('/channel/' + channelId + '/manager')
    }

    const searchKeyDown = (event) => {
        if (event.keyCode === 13) {
            handleSearch()
        }
    }

    const handleHomeButton = () => {
        navigate('/')
    }

    const onPagerNextButton = async (currentPage, lastPagerNum, pagerLength, searchCondition) => {
        let startNum = currentPage - (currentPage - 1) % pagerLength
        let nextPage = startNum + pagerLength

        let url = '/channel/' + channelId + '?page=' + nextPage + '&field='
            + searchCondition.field + '&' + 'query=' + searchCondition.querys

        if (searchCondition.field === "" || searchCondition.querys === "") {
            url = '/channel/' + channelId + '?page=' + nextPage
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

        let url = '/channel/' + channelId + '?page=' + previousPage
        if (searchCondition !== undefined && searchCondition.field !== "") {
            url = '/channel/' + channelId + '?page=' + previousPage + '&field='
                + searchCondition.field + '&' + 'query=' + searchCondition.querys
        }

        if (previousPage > 0) {
            setCurPage(previousPage)
            navigate(url)
        }
        else {
            alert("이전 페이지가 없습니다")
        }
    }

    const handleSearch = async (event) => {
        event.preventDefault()

        let searchCondition = {
            field : $('#field').val(),
            querys : $('#search').val(),
        }
        let url = '/channel/' + channelId + '?page=1'
        const pageable = 'page=0&size=10&sort=id,desc'

        if (searchCondition !== undefined && searchCondition.field !== "") {
            url += '&field=' + searchCondition.field + '&' + 'query=' + searchCondition.querys
        }

        let result = await ChannelArticleService.getAll(channelId, pageable, searchCondition)
        setChannelPosts(result.content)
        setChannelPostsCount(result.totalElements)

        navigate(url)
    }

    const loadChannelPosts = async (channelId) => {
        let searchCondition = getSearchCondition()

        let url = '/channel/' + channelId + '?page=' + curPage
        if (searchCondition !== undefined && searchCondition.field !== "") {
            url =+ '&field=' + searchCondition.field + '&' + 'query=' + searchCondition.querys
        }

        const pageable = 'page=' + (curPage - 1) + '&size=10&sort=id,desc'
        console.log(pageable)
        let result = await ChannelArticleService.getAll(channelId, pageable, searchCondition)

        setChannelPosts(result.content)
        setChannelPostsCount(result.totalElements)

        navigate(url)
    }

    const loadChannelInfo = async (channelId) => {
        let result = await ChannelService.get(channelId)
        console.log(result)
        if (result.managerId === Number(memberId)) {
            setIsManager(true)
        }
        setChannelName(result.name)
    }

    const PAGER_LENGTH = 5

    const [memberId, setMemberId] = useState(localStorage.getItem(UserInfo.ID))
    const [token, setToken] = useState(localStorage.getItem(UserInfo.TOKEN))
    const [channelId, setChannelId] = useState(getChannelId())
    const [isManager, setIsManager] = useState(false)
    const [searchCondition, setSearchCondition] = useState(getSearchCondition())

    const [curPage, setCurPage] = useState(getCurrentPage())
    const [channelName, setChannelName] = useState(null)
    const [channelPostsCount, setChannelPostsCount] = useState(0)
    const [channelPosts, setChannelPosts] = useState(null)

    useEffect(() => {
        loadChannelInfo(channelId)
        loadChannelPosts(channelId)
    }, [curPage])

    return (
        <>
            {
                channelName && channelPosts &&
                <Container>
                    <Container>
                        <Row className='d-flex justify-content-center align-items-center'>
                            <h2 className="page-section-heading text-center text-uppercase text-secondary mb-3" id="channelName">
                                {channelName}
                            </h2>
                            {
                                isManager &&
                                <button onClick={handleEnterManageChannelButton} className="w-25 btn btn-info btn-md float-start" type="button" id="manager">
                                    채널 관리
                                </button>
                            }
                        </Row>
                    </Container>

                    <Tabs
                        defaultActiveKey="home"
                        transition={false}
                        id="noanim-tab-example"
                        className="mb-3"
                    >
                        <Tab eventKey="home" title="전체글">
                            <Container>
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
                                                            <button onClick={handleSearch} id="searchButton" className="btn btn-info">
                                                                <span className="glyphicon glyphicon-search" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Form>
                                            </div>
                                        </nav>
                                    </div>
                                </div>

                                <ChannelTable channelArticle={channelPosts} channelId={channelId} />

                                <div className="row">
                                    <div className="col-lg-6 col-sm-12 text-lg-start text-center">
                                        <button onClick={handleHomeButton} type="button" className="btn btn-secondary btn-sm" id="backButton">홈으로</button>
                                    </div>
                                    <div className="col-lg-6 col-sm-12 text-lg-end text-center">
                                        <button onClick={handleWritingButton} type="button" className="btn btn-secondary btn-sm" id="postingButton">글쓰기</button>
                                    </div>
                                </div>

                                <Pager
                                    currentPage={curPage}
                                    postsCount={channelPostsCount}
                                    pagerLength={PAGER_LENGTH}
                                    searchCondition={searchCondition}
                                    setCurPage={setCurPage}
                                    onNext={onPagerNextButton}
                                    onPrev={onPagerPrevButton}
                                />
                            </Container>
                        </Tab>
                        {/*<Tab eventKey="profile" title="공지사항">*/}
                        {/*    <ChannelNotice channelId={channelId} />*/}
                        {/*</Tab>*/}
                    </Tabs>
                </Container>
            }
        </>
    );
};

export default Channel;
