function returnUserJson(companyId, name, email, password, phoneNumber, userImage){
    return {
        image: userImage,
        companyId: companyId,
        name: name,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
    }
}
exports.returnUserJson = returnUserJson;