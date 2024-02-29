import React, {useState, useEffect, useLayoutEffect} from "react";
import {Container} from 'react-bootstrap'

import {useNavigate} from 'react-router-dom'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ChannelService from "../api/service/channel/ChannelService";

import $ from "jquery";
import CardSlide from "./CardSlide";
import {UserInfo} from "../api/const/UserInfo";
import {ChannelSort} from "../api/const/ChannelSort";
import {FileService} from "../api/service/file/FileService";
import {DEFAULT_IMAGE_URL} from "../api/const/BackEndHost";

const StudySwiper = ({category}) => {
	const navigate = useNavigate();
	const orderByPopularButton = category + 'orderByPopular'
	const orderByCreatedAtButton = category + 'orderByCreatedAt'

	const handleOrderByPopularButton = () => {
		setSort(ChannelSort.MEMBER_COUNT)
		$('#' + orderByPopularButton).attr('checked', true)
		$('#' + orderByCreatedAtButton).attr('checked', false)
	}

	const handleOrderByCreatedAtButton = () => {
		setSort(ChannelSort.ID)
		$('#' + orderByCreatedAtButton).attr('checked', true)
		$('#' + orderByPopularButton).attr('checked', false)
	}

	const handleCreateChannel = () => {
		if (localStorage.getItem(UserInfo.TOKEN) === null || localStorage.getItem(UserInfo.TOKEN) === 'null') {
			alert('로그인이 필요합니다')
		}
		else {
			navigate(`/channel/create`);
		}
	}

	const loadChannels = async (category) => {
		let result = await ChannelService.getByCategory(category, sort, 0, 10);
		if (result) {
			let channelIdList = parseChannelIds(result.content)
			let thumbnailFiles = await FileService.getFiles(channelIdList, 'CHANNEL');

			combineChannelAndThumbnailUrl(result.content, thumbnailFiles)
			setChannels(result.content)
		}
	}

	const combineChannelAndThumbnailUrl = (channels, thumbnailFiles) => {
		if (thumbnailFiles) {
			channels.forEach((channel, index) => {
				let file = thumbnailFiles.filter(file => file.ownerId === channel.id);
				channel.storeFileName = DEFAULT_IMAGE_URL
				if (file && file[0]) {
					channel.storeFileName = file[0].uploadFile.storeFileName
					console.log(channel.storeFileName)
					console.log(DEFAULT_IMAGE_URL)
				}
			})
		}
	}

	const parseChannelIds = (channels) => {
		let channelIdList = []

		channels.forEach((object, index) => {
			channelIdList.push(object.id)
		})
		return channelIdList
	}

	const [channels, setChannels] = useState([])
	const [sort, setSort] = useState(ChannelSort.ID)

	useLayoutEffect(() => {
		loadChannels(category)
		$('#' + orderByCreatedAtButton).attr('checked', true)

	}, [sort])

	return (
	  <>
		  {
			  channels &&
			  <Container className='mt-5' style={{width: '100%'}}>
				  <div className="d-flex flex-row mb-3">
					  <input onClick={handleOrderByPopularButton} type="radio" className="btn-check" name={orderByPopularButton} id={orderByPopularButton} autoComplete="off" />
					  <label className="btn btn-outline-primary" htmlFor={orderByPopularButton}>인기순</label>

					  <input onClick={handleOrderByCreatedAtButton} type="radio" className="btn-check" name={orderByPopularButton} id={orderByCreatedAtButton} autoComplete="off" />
					  <label className="btn btn-outline-primary" htmlFor={orderByCreatedAtButton}>최신순</label>

					  <button className="btn btn-info fixed p-2" style={{marginLeft: 30}} onClick={handleCreateChannel} type="button" id="createProjectButton">
						  스터디/프로젝트 모집하기
					  </button>
				  </div>
				  <Swiper
					  slidesPerView={3}
					  spaceBetween={30}
					  slidesPerGroup={3}
					  loop={true}
					  loopFillGroupWithBlank={true}
					  pagination={{
						  clickable: true,
					  }}
					  navigation={true}
					  modules={[Pagination, Navigation]}
					  className="mySwiper"
				  >

					  {
						  channels.map((channel) => {
							  return (
								  <SwiperSlide>
									  <CardSlide channel={ channel } />
								  </SwiperSlide>
							  )
						  })
					  }

				  </Swiper>
			  </Container>
		  }
	  </>
	)
}

export {StudySwiper}