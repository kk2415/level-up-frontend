import {send, sendMultiPart} from "../../Request"
import {HttpMethod} from "../../const/HttpMethod";
import {SERVICE_APP_URL} from "../../const/BackEndHost";

const urlPrefix = SERVICE_APP_URL + '/api/v1/sign-up'

export const SignUpService = {

    signUp : async (member) => {
        let result = null
        const url = urlPrefix

        await send(HttpMethod.POST, url, member)
            .then((data) => {
                result = data
            })
            .catch((error) => {
                console.log(error)
                alert(error.responseJSON.message)
            })

        return result
    },
}