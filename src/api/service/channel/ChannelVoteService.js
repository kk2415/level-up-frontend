import { send } from "../../Request"
import {HttpMethod} from "../../const/HttpMethod";
import {SERVICE_APP_URL} from "../../const/BackEndHost";

const urlPrefix = SERVICE_APP_URL + '/api/v1/channel/votes/'

const ChannelVoteService = {

    create: async (vote) => {
        let result = null
        const url = urlPrefix

        await send(HttpMethod.POST, url, vote)
            .then((data) => {
                result = data
                console.log(data)
            })
            .catch((error) => {
                console.log(error)
            })

        return result
    },
}

export default ChannelVoteService;