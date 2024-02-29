import {send} from "../../Request"
import {UserInfo} from '../../const/UserInfo'
import {HttpMethod} from "../../const/HttpMethod";
import {SERVICE_APP_URL} from "../../const/BackEndHost";

const urlPrefix = SERVICE_APP_URL + '/api/v1/login'

export const LogInService = {
    signIn : async function (member) {
        let result = false

        await send(HttpMethod.POST, urlPrefix, member)
            .then((data) => {
                result = true
                localStorage.setItem(UserInfo.TOKEN, JSON.stringify(data.accessToken))
                localStorage.setItem(UserInfo.ID, data.id)
                localStorage.setItem(UserInfo.EMAIL, data.email)
                localStorage.setItem(UserInfo.NICKNAME, data.nickname)
                localStorage.setItem(UserInfo.IS_ADMIN, data.isAdmin)
            })
            .catch((error) => {
                alert(error.responseJSON.message)
            })

        return result
    },

    signOut : function () {
        localStorage.clear()
        window.location.href = "/"
    },
}