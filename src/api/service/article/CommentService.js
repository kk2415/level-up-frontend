import { send } from "../../Request"
import {HttpMethod} from "../../const/HttpMethod";
import {SERVICE_APP_URL} from "../../const/BackEndHost";

const urlPrefix = SERVICE_APP_URL + '/api/v1/comments/'

const CommentService = {

    create: async (comment, memberId) => {
        let result
        const url = urlPrefix + '?member=' + memberId

        await send(HttpMethod.POST, url, comment)
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

    createReply: async (reply, memberId) => {
        let result
        const url = urlPrefix + 'reply?member=' + memberId

        await send(HttpMethod.POST, url, reply)
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

    get: async (articleId, identity) => {
        let comment = {}
        const url = urlPrefix + articleId

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

    delete: async (commentId, articleType) => {
        let result = false
        const url = urlPrefix + commentId + '?articleType=' + articleType

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


export default CommentService;