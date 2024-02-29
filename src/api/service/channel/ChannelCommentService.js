import { send } from "../../Request"
import {HttpMethod} from "../../const/HttpMethod";
import {SERVICE_APP_URL} from "../../const/BackEndHost";

const urlPrefix = SERVICE_APP_URL + '/api/v1/channel/comments/'

const ChannelCommentService = {

    create: async (body, memberId, articleId, channelId) => {
        let result = {}
        const url = urlPrefix + '?member=' + memberId + '&article=' + articleId + '&channel=' + channelId

        await send(HttpMethod.POST, url, body)
            .then((data) => {
                result = data
            })
            .catch((error) => {
                result = null
                console.log(error)

                if (error.status === 403) {
                    alert('이메일 인증을 해야합니다.')
                }
            })

        return result
    },

    createReply: async (body, memberId, parentId) => {
        let result = {}
        const url = urlPrefix + 'reply?member=' + memberId + '&parent=' + parentId

        await send(HttpMethod.POST, url, body)
            .then((data) => {
                result = data
            })
            .catch((error) => {
                result = null
                console.log(error)

                if (error.status === 403) {
                    alert('이메일 인증을 해야합니다.')
                }
            })

        return result
    },

    get: async (articleId) => {
        let comment = {}
        const url = urlPrefix + '?article=' + articleId

        await send(HttpMethod.GET, url)
            .then((data) => {
                comment = data
            })
            .catch((error) => {
                console.log(error)
                comment = null
            })

        return comment
    },

    getReply: async (commentId) => {
        let comment = {}
        const url = urlPrefix + commentId + '/reply'

        await send(HttpMethod.GET, url)
            .then((data) => {
                comment = data
            })
            .catch((error) => {
                console.log(error)
                comment = null
            })

        return comment
    },

    modify: async () => {
        await send()
            .then(() => {
            })
            .catch((error) => {
            })
    },

    delete: async (commentId) => {
        let result = false
        const url = urlPrefix + commentId

        await send(HttpMethod.DELETE, url)
            .then(() => {
                result = true
            })
            .catch((error) => {
                console.log(error)
            })

        return result
    },
}

export default ChannelCommentService;