const { Op } = require("sequelize");
const Contact = require('../models/contact.model');
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/apiResponse');
const ApiErrors = require('../utils/apiErrors');
function createResponse(primaryContactId, emails, phoneNumbers, secondaryContactIds) {
    return {
        contact: {
            primaryContactId: primaryContactId,
            emails: emails,
            phoneNumbers: phoneNumbers,
            secondaryContactIds: secondaryContactIds,
        }
    }
};
module.exports = {
    createContact: asyncHandler(async (req, res) => {

        const { userPhoneNumber, userEmail } = req.body;


        if ([userPhoneNumber, userEmail].some((fields) => fields == undefined || "")) {
            throw new ApiErrors(400, "Error! Missing fields");
        }

        const condition = {
            [Op.or]: [
                { phoneNumber: userPhoneNumber },
                { email: userEmail }
            ]
        }

        const existingContacts = await Contact.findAll({ where: condition });
        // console.log("ExistingContact : ", existingContacts);

        let newContact;
        if (existingContacts.length === 0 || !existingContacts[0]) {

            newContact = await Contact.create({ phoneNumber: userPhoneNumber, email: userEmail, linkedId: null, linkPrecedence: "primary" });

            if (!newContact) throw new ApiErrors(500, "Server Error! Insertion Failed.");

            const { id, email, phoneNumber, linkedId } = newContact.toJSON();

            return res.status(200).json(new ApiResponse(200, createResponse(id, [email], [phoneNumber], linkedId), "yes"));
        }
        // console.log('ExistingContacts:', existingContacts)
        const primaryContact = existingContacts.find(obj => obj.toJSON().linkedId == null && obj.toJSON().linkPrecedence === "primary")

        // console.log("Primary Contact: ", primaryContact.toJSON());

        const newSecondaryContact = await Contact.create({
            phoneNumber: userPhoneNumber,
            email: userEmail,
            linkedId: primaryContact.id,
            linkPrecedence: "secondary"
        });

        if (!newSecondaryContact) throw new ApiErrors(500, "Not able Insert value in Database");
        console.log("newSecondaryContact : ", newSecondaryContact.toJSON());
        const allContacts = [...existingContacts, newSecondaryContact];

        // console.log(allContacts)
        return res.status(200).json(new ApiResponse(200, allContacts, "yes"));
    })
}