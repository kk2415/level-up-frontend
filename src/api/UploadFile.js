import { sendMultiPart, send } from "./Request"

export async function uploadFile(method, url, file) {
    let form = new FormData()
    let uploadImage = {}

    //스프링 MVC 컨트롤러의 메서드 파라미터와 이름을 똑같이 해야한다.
    form.append('file', file)

    await sendMultiPart(method, url, form)
        .then((data) => {
            uploadImage.storeFileName = data.storeFileName
            uploadImage.uploadFileName = data.uploadFileName
        })
        .catch((error) => {
            uploadImage = null
            console.log(error)
        })

    return uploadImage
}

export async function uploadFileByBase64(url, method, file) {
    send(url, method, file)
        .then((data) => {console.log(data)})
        .catch((error) => {console.log(error)})
}