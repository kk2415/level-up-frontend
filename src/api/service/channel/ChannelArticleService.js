import { send } from "../../Request"
import {HttpMethod} from "../../const/HttpMethod";
import {SERVICE_APP_URL} from "../../const/BackEndHost";

const urlPrefix = SERVICE_APP_URL + '/api/v1/channel-articles/'

const ChannelArticleService = {

    create: async (article, channelId, memberId) => {
        let result = null
        const url = urlPrefix + '?channel=' + channelId + '&member=' + memberId

        await send(HttpMethod.POST, url, article)
            .then((data) => {
                result = data
            })
            .catch((error) => {
                console.log(error)
                alert(error.responseJSON.message)

                if (error.status === 403) {
                    alert('이메일 인증을 해야합니다.')
                }
            })

        return result
    },

    get: async (articleId, channelId, view) => {
        let post = {}
        const url = urlPrefix + articleId + '?channel=' + channelId + '&view=' + view

        await send(HttpMethod.GET, url)
            .then((data) => {
                post = data
            })
            .catch((error) => {
                console.log(error)
                post = null
            })

        return post
    },

    getAll: async (channelId, pageable, searchCondition) => {
        let result = {}

        let url = urlPrefix + '?channel=' + channelId + '&' + pageable;
        if (searchCondition !== undefined && searchCondition.field !== undefined) {
            url += '&field=' + searchCondition.field + '&query=' + searchCondition.querys
        }

        await send(HttpMethod.GET, url)
            .then((data) => {
                result = data
            })
            .catch((error) => {
                console.log(error)
            })

        return result;
    },

    getNext: async (articleId, channelId) => {
        let post = {}
        const url = urlPrefix + articleId + '/next-article?channel=' + channelId

        await send(HttpMethod.GET, url)
            .then((data) => {
                post = data
            })
            .catch((error) => {
                console.log(error)
                post = null
            })

        return post
    },

    getPrev: async (articleId, channelId) => {
        let post = {}
        const url = urlPrefix + articleId + '/prev-article?channel=' + channelId

        await send(HttpMethod.GET, url)
            .then((data) => {
                post = data
            })
            .catch((error) => {
                console.log(error)
                post = null
            })

        return post
    },

    modify: async (article, memberId, articleId, channelId) => {
        let result = false
        const url = urlPrefix + articleId + '?member=' + memberId + '&channel=' + channelId

        await send(HttpMethod.PATCH, url, article)
            .then(() => {
                result = true
            })
            .catch((error) => {
                console.log(error)
            })

        return result
    },

    delete: async (articleId, channelId) => {
        let result = false
        const url = urlPrefix + articleId + '?channel=' + channelId

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


export default ChannelArticleService;