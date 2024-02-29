import { send } from "../../Request"

import {HttpMethod} from "../../const/HttpMethod";
import {SERVICE_APP_URL} from "../../const/BackEndHost";

const urlPrefix = SERVICE_APP_URL + '/api/v1/articles/'

const ArticleService = {

    create: async (memberId, article) => {
        let result = null
        const url = urlPrefix + '?member=' + memberId

        await send(HttpMethod.POST, url, article)
            .then((data) => {
                result = data
            })
            .catch((error) => {
                console.log(error)
                if (error.status === 403) {
                    alert('이메일 인증을 해야합니다.')
                }
            })

        return result
    },

    get: async (articleId, articleType) => {
        let article = {}
        const url = urlPrefix + articleId + '?articleType=' + articleType + '&view=true'

        await send(HttpMethod.GET, url)
            .then((data) => {
                article = data
            })
            .catch((error) => {
                console.log(error)
                article = null
            })

        return article
    },

    getAll: async (articleType, pageable, searchCondition) => {
        let result = {}

        let url = urlPrefix + '?articleType=' + articleType + '&' + pageable;
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

    getNext: async (articleId, articleType) => {
        let article = {}
        const url = urlPrefix + articleId + '/next-article?articleType=' + articleType

        await send(HttpMethod.GET, url)
            .then((data) => {
                article = data
            })
            .catch((error) => {
                console.log(error)
                article = null
            })

        return article
    },

    getPrev: async (articleId, articleType) => {
        let article = {}
        const url = urlPrefix + articleId + '/prev-article?articleType=' + articleType

        await send(HttpMethod.GET, url)
            .then((data) => {
                article = data
            })
            .catch((error) => {
                console.log(error)
                article = null
            })

        return article
    },

    modify: async (article, memberId, articleId) => {
        let result = false
        const url = urlPrefix + articleId + '?member=' + memberId

        await send(HttpMethod.PATCH, url, article)
            .then(() => {
                alert('수정되었습니다.')
                result = true
            })
            .catch((error) => {
                console.log(error)
            })

        return result
    },

    delete: async (articleId, articleType) => {
        let result = false
        const url = urlPrefix + articleId + '?articleType=' + articleType

        await send(HttpMethod.DELETE, url)
            .then(() => {
                result = true
                alert('삭제되었습니다.')
            })
            .catch((error) => {
                console.log(error)
            })

        return result
    },
}


export default ArticleService;