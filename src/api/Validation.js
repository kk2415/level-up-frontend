export let createMemberValidation =  {
    name : /^[가-힣]{2,15}$/,
    nickname : /^[a-zA-Z0-9가-힣]{2,15}$/,
    phone : /^\d{2,3}-\d{3,4}-\d{4}$/,
    email : /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
    password : /^[a-zA-Z\\d`~!@#$%^&*()-_=+]{8,24}$/,
    birthday : /^[0-9]{8}$/,
}


export let loginMemberValidation =  {
    email : /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
    password : /^[a-zA-Z\\d`~!@#$%^&*()-_=+]{8,24}$/,
}

export let createChannelValidation =  {
    name : /^[ㄱ-ㅎ가-힣a-zA-Z0-9\s!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\"\'\,\.\/\`\₩]{1,20}$/,
    limitedMemberNumber : /^[0-9]{1,3}$/,
    thumbnailDescription : /^[ㄱ-ㅎ가-힣a-zA-Z0-9\s!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\"\'\,\.\/\`\₩]{1,40}$/,
}
