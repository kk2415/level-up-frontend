import {Routes, Route, Link} from 'react-router-dom'

import React from 'react';
import Home from '../page/home/Home';
import MyPage from '../page/member/MyPage'
import CreateChannel from '../page/channel/CreateChannel'
import SignIn from '../page/member/SignIn'
import SignUp from '../page/member/SignUp'
import FindingPassword from '../page/member/FindingPassword'

import ModifyChannel from "../page/channel/ModifyChannel";
import Channel from "../page/channel/Channel"
import ChannelManager from "../page/channel/ChannelManager"
import CreateChannelArticle from "../page/channelArticle/CreateChannelArticle"
import CreateChannelNotice from "../page/channelNotice/CreateChannelNotice"
import DetailChannelNotice from "../page/channelNotice/DetailChannelNotice"
import ModifyChannelNotice from "../page/channelNotice/ModifyChannelNotice"
import DetailChannelArticle from "../page/channelArticle/DetailChannelArticle"

import CreateNotice from "../page/notice/CreateNotice"
import NoticeList from "../page/notice/NoticeList"
import Notice from "../page/notice/Notice"
import ModifyNotice  from "../page/notice/ModifyNotice"

import CreateArticle from "../page/qna/CreateArticle"
import ArticleList from "../page/qna/ArticleList"
import Article from "../page/qna/Article"
import ModifyArticle from "../page/qna/ModifyArticle"
import ConfirmEmail from "../page/member/ConfirmEmail";
import ChannelInfo from "../page/channel/ChannelInfo";
import ModifyChannelArticle from "../page/channelArticle/ModifyChannelArticle";

const AppRouter = () => {
  return (
	<Routes>
		<Route path="/" element={<Home/>}/>

		<Route path="/signin" element={<SignIn/>}/>
		<Route path="/signup" element={<SignUp/>}/>
		<Route path="/mypage" element={<MyPage/>}/>
		<Route path="/confirm-email" element={<ConfirmEmail/>}/>
		<Route path="/finding-password" element={<FindingPassword />}/>

		<Route path="/channel/:channelId" element={<Channel/>}/>
		<Route path="/channels" element={<ChannelInfo/>}/>
		<Route path="/channel/create" element={<CreateChannel/>}/>
		<Route path="/channel/modify/:channelId" element={<ModifyChannel/>}/>
		<Route path="/channel/description/:channelId" element={<ChannelInfo/>}/>
		<Route path="/channel/:channelId/manager" element={<ChannelManager/>}/>

		<Route path="/channel-notice/create" element={<CreateChannelNotice />}/>
		<Route path="/channel-notice/detail/:channelNoticeId" element={<DetailChannelNotice/>}/>
		<Route path="/channel-notice/modify/:channelNoticeId" element={<ModifyChannelNotice/>}/>

		<Route path="/channel-article/create" element={<CreateChannelArticle />}/>
		<Route path="/channel-article/:articleId" element={<DetailChannelArticle />}/>
		<Route path="/channel-article/modify/:articleId" element={<ModifyChannelArticle />}/>

		<Route path="/article/:articleId" element={<Article />}/>
		<Route path="/article/list" element={<ArticleList onClick={true} />}/>
		<Route path="/article/create" element={<CreateArticle />}/>
		<Route path="/article/modify/:articleId" element={<ModifyArticle />}/>

		<Route path="/notice/:articleId" element={<Notice />}/>
		<Route path="/notice/list" element={<NoticeList />}/>
		<Route path="/notice/create" element={<CreateNotice />}/>
		<Route path="/notice/modify/:articleId" element={<ModifyNotice />}/>
	</Routes>
  )
}

export default AppRouter