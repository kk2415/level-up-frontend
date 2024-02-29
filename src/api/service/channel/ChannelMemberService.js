import { send } from "../../Request"
import {HttpMethod} from "../../const/HttpMethod";
import {SERVICE_APP_URL} from "../../const/BackEndHost";

const urlPrefix = SERVICE_APP_URL + '/api/v1/channel/members/'

const ChannelMemberService = {

    create: async (channelId, memberId, channelMember) => {
        let result = false
        let url = urlPrefix + '?channel=' + channelId + '&member=' + memberId

        await send(HttpMethod.POST, url, channelMember)
            .then(() => {
                result = true
            })
            .catch((error) => {
                console.log(error)
                alert(error.responseJSON.message)
            })

        return result;
    },

    getAll: async (channelId, isWaitingMember, pageable) => {
        let result = null
        let url = urlPrefix + '?channelId=' + channelId + '&isWaitingMember=' + isWaitingMember + '&' + pageable;

        await send(HttpMethod.GET, url)
            .then((data) => {
                result = data
            })
            .catch((error) => {
                console.log(error)
            })

        return result;
    },

    approval: async (channelMemberId) => {
        let result = false
        let url = urlPrefix + channelMemberId

        await send(HttpMethod.PATCH, url)
            .then(() => {
                result = true
            })
            .catch((error) => {
                console.log(error)
            })

        return result;
    },

    delete: async (channelMemberId, channelId) => {
        let result = false
        let url = urlPrefix + channelMemberId + '?channelId=' + channelId;

        await send(HttpMethod.DELETE, url)
            .then(() => {
                result = true
            })
            .catch((error) => {
                console.log(error)
            })

        return result;
    },
}


export default ChannelMemberService;