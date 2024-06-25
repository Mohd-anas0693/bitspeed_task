const Contact = require('../models/contact.model');
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/apiResponse');
module.exports = {
    createContact: asyncHandler(async (req, res) => {
        const userData = await Contact.create({
            phoneNumber: "123",
            email: "1234@gmail.com",
            linkedId: null,
            linkPrecedence: "primary",
        })
        console.log(userData)
        return res.status(200).json(new ApiResponse(200, userData, "yes"));
    })
}