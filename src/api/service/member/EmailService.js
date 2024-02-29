import { send } from "../../Request"
import {HttpMethod} from "../../const/HttpMethod";
import {IMAGE_SERVER_URL, SERVICE_APP_URL} from "../../const/BackEndHost";

const urlPrefix = SERVICE_APP_URL + '/api/v1/email-auth'

export const EmailService = {
    sendSecurityCode : async (emailAuthRequest, email) => {
        let result = false
        const url = urlPrefix +'?email=' + email

            await send(HttpMethod.POST, url, emailAuthRequest)
            .then(() => {
                result = true
            })
            .catch((error) => {
                console.log(error)
                alert(error.responseJSON.message)
            })

        return result
    },

    confirmEmail : async (emailAuthRequest, email) => {
        let result = false
        const url = urlPrefix +'?email=' + email

        await send(HttpMethod.PATCH, url, emailAuthRequest)
            .then(() => {
                result = true
            })
            .catch((error) => {
                console.log(error)
                alert(error.responseJSON.message)
            })

        return result
    },
}