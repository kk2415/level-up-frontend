import {send, sendMultiPart} from "../../Request";
import {HttpMethod} from "../../const/HttpMethod";
import {IMAGE_SERVER_URL} from "../../const/BackEndHost";

const urlPrefix = IMAGE_SERVER_URL + '/api/v1/files'

export const FileService = {

    create : async (ownerId, fileType, file) => {
        let form = new FormData()
        const url = urlPrefix + '?ownerId=' + ownerId + '&fileType=' + fileType
        let uploadFile = {}

        //스프링 MVC 컨트롤러의 메서드 파라미터와 이름을 똑같이 해야한다.
        form.append('file', file)

        await sendMultiPart(HttpMethod.POST, url, form)
            .then((data) => {
                uploadFile = data.result
            })
            .catch((error) => {
                uploadFile = null
                console.log(error)
            })

        return uploadFile
    },

    get : async (ownerId, fileType) => {
        let file = {}
        const url = urlPrefix + '?ownerId=' + ownerId + '&fileType=' + fileType

        await send(HttpMethod.GET, url)
            .then((data) => {
                file = data.result
            })
            .catch((error) => {
                file = null
                console.log(error)
            })

        return file
    },

    getFiles : async (ownerIds, fileType) => {
        let file = {}
        const url = urlPrefix + '/list?ownerIds=' + ownerIds + '&fileType=' + fileType

        await send(HttpMethod.GET, url)
            .then((data) => {
                file = data.result
            })
            .catch((error) => {
                file = null
                console.log(error)
            })

        return file
    },

    update : async (ownerId, fileType, file) => {
        let form = new FormData()
        const url = urlPrefix + '?ownerId=' + ownerId + '&fileType=' + fileType
        let uploadFile = {}

        form.append('file', file)

        await sendMultiPart(HttpMethod.PATCH, url, form)
            .then((data) => {
                uploadFile = data.result
            })
            .catch((error) => {
                uploadFile = null
                console.log(error)
            })

        return uploadFile
    }
}