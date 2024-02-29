import $ from 'jquery';
import {IMAGE_SERVER_URL, SERVICE_APP_URL} from "./const/BackEndHost.js"
import {UserInfo} from './const/UserInfo'
import {useNavigate as navigate} from 'react-router-dom'

export async function send(method, url, requestBody) {
	let headers = {
		"Content-Type" : "application/json",
	}

	const accessToken = JSON.parse(localStorage.getItem(UserInfo.TOKEN))
	if (accessToken) {
		let validationResult = await validateAccessToken(accessToken);
		if (validationResult) {
			headers.Authorization = "Bearer " + accessToken.token
		} else {
			localStorage.clear();
			window.location.href = '/signin'
		}
	}

	let options = {
		url: url,
		method: method,
		headers : headers,
		async: false,
	}

	if (requestBody) {
		options.data = JSON.stringify(requestBody)
	}

	return await new Promise((resolve, reject) => {
		$.ajax(options)
			.done(function (response, textStatus, request) {
				resolve(response)
			})
			.fail(function (error) {
				reject(error)
			})
	})
}

const validateAccessToken = async (accessToken) => {
	if (accessToken) {
		if (isExpired(accessToken.expiration)) {
			return false
		} else if (isOneMinuteBeforeExpiration(accessToken.expiration)) {
			//토큰 연장
			let newAccessToken = await requestAccessToken(accessToken)
			if (newAccessToken) {
				accessToken = newAccessToken
				localStorage.setItem(UserInfo.TOKEN, JSON.stringify(newAccessToken))
			}
		}
		return true
	}
	return false
}

const isExpired = (expiration) => {
	let now = new Date;
	let duration = expiration - now.getTime();

	return duration <= 1000
}

const isOneMinuteBeforeExpiration = (expiration) => {
	let now = new Date;
	let duration = expiration - now.getTime();

	return duration > 0 && duration < 60000
}

const requestAccessToken = (accessToken) => {
	let newAccessToken = {}

	let data = {
		email : localStorage.getItem(UserInfo.EMAIL),
		token : accessToken.token,
		expiration : accessToken.expiration,
		issuedAt : accessToken.issuedAt,
	}

	$.ajax({
		url: SERVICE_APP_URL + '/api/v1/access-token',
		type: 'POST',
		data: JSON.stringify(data),
		contentType: 'application/json',
		dataType: 'json',
		async: false,
		success: function(res) {
			newAccessToken = res
		},
		error: function(error) {
			console.log(error)
			newAccessToken = null
		}
	})
	return newAccessToken
}

export async function sendMultiPart(method, url, requestBody) {
	let headers = {
	}

	const accessToken = JSON.parse(localStorage.getItem(UserInfo.TOKEN))
	if (accessToken) {
		let validationResult = await validateAccessToken(accessToken);
		if (validationResult) {
			headers.Authorization = "Bearer " + accessToken.token
		} else {
			localStorage.clear();
			navigate('/signin')
		}
	}

	let options = {
		url: url,
		method: method,
		headers : headers,
		async: false,
		processData: false, // - processData : false로 선언 시 formData를 string으로 변환하지 않음
		contentType: false, // - contentType : false 로 선언 시 content-type 헤더가 multipart/form-data로 전송되게 함
		cache: false,
		enctype: 'multipart/form-data',
	}

	if (requestBody) {
		options.data = requestBody
	}

	return await new Promise((resolve, reject) => {
		$.ajax(options)
		.done(function (response) {
			resolve(response)
		})
		.fail(function (error) {
			reject(error)
		})
	})
}