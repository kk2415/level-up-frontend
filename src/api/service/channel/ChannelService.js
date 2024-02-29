import {send, sendMultiPart} from "../../Request"
import {HttpMethod} from "../../const/HttpMethod";
import {SERVICE_APP_URL} from "../../const/BackEndHost";

const urlPrefix = SERVICE_APP_URL + '/api/v1/channels'
const ChannelService = {

    create: async (channel, memberId) => {
        let result = false
        const url = urlPrefix + '?member=' + memberId

        await send(HttpMethod.POST, url, channel)
            .then((data) => {
                alert('채널을 만들었습니다.')
                result = data
            })
            .catch((error) => {
                if (error.status === 403) {
                    alert('이메일 인증을 해야합니다.')
                }
                console.log(error)
            })

        return result
    },

    get: async (channelId) => {
        let result = {}
        const url = urlPrefix + '/' + channelId

        await send(HttpMethod.GET, url)
            .then((data) => {
                result = data;
            })
            .catch((error) => {
                result = null
                console.log(error)
            })

        return result;
    },

    getByCategory: async (category, sort, page, size) => {
        let result = {}
        const url = urlPrefix + '?category=' + category + '&sort=' + sort + '&page=' + page + '&size=' + size

        await send(HttpMethod.GET, url)
            .then((data) => {
                result = data;
            })
            .catch((error) => {
                result = null
                console.log(error)
            })

        return result;
    },

    getManager: async (memberId, channelId) => {
        let result = {}
        const url = urlPrefix + '/' + channelId + '/manager?member=' + memberId

        await send(HttpMethod.GET, url)
            .then((data) => {
                result = data
            })
            .catch((error) => {
                console.log(error)
                result = null
            })

        return result
    },

    modify: async (channel, channelId) => {
        let result = false
        const url = urlPrefix + '/' + channelId

        await send(HttpMethod.PATCH, url, channel)
            .then(() => {
                result = true
            })
            .catch((error) => {
                console.log(error)
            })

        return result;
    },

    delete: async (channelId, category) => {
        let result = true
        const url = urlPrefix + '/' + channelId + '?category=' + category

        await send(HttpMethod.DELETE, url)
            .then(() => {
                alert('삭제되었습니다.')
            })
            .catch((error) => {
                result = false
                alert('삭제에 실패하였습니다.')
                console.log(error)
            })

        return result;
    },
}

export default ChannelService;
