const { Op } = require("sequelize");
const Contact = require('../models/contact.model');
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/apiResponse');
const ApiErrors = require('../utils/apiErrors');

function createResponse(arr) {
    let primaryContactId;

    const emailArr = [];
    const phoneNumberArr = [];
    const secondaryContactIdsArr = [];

    arr.forEach(contact => {

        const obj = contact.toJSON();

        if (obj.linkPrecedence == 'primary') {

            primaryContactId = obj.id;
            emailArr.push(obj.email);
            phoneNumberArr.push(obj.phoneNumber);

        } else if (obj.linkPrecedence == 'secondary') {

            emailArr.push(obj.email)
            phoneNumberArr.push(obj.phoneNumber)
            secondaryContactIdsArr.push(obj.id)
        }
    })
    return {
        contact: {
            primaryContactId: primaryContactId,
            emails: Array.from(new Set(emailArr)),
            phoneNumbers: Array.from(new Set(phoneNumberArr)),
            secondaryContactIds: secondaryContactIdsArr,
        }
    }

}
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

        let newContact;
        if (existingContacts.length === 0 || !existingContacts[0]) {

            newContact = await Contact.create({ phoneNumber: userPhoneNumber, email: userEmail, linkedId: null, linkPrecedence: "primary" });

            if (!newContact) throw new ApiErrors(500, "Server Error! Insertion Failed.");

            return res.status(200).json(new ApiResponse(200, createResponse([newContact]), "yes"));
        }

        let primaryContact = existingContacts.find(obj => obj.toJSON().email == userEmail && obj.toJSON().linkPrecedence == 'primary' && obj.toJSON().linkedId == null)
        let updateStatus;

        if (primaryContact.length != 0) {
            existingContacts.forEach(async obj => {
                const jsonObj = obj.toJSON();

                if (jsonObj.phoneNumber == userPhoneNumber) {
                    updateStatus = true
                    await Contact.update({ linkedId: primaryContact.toJSON().id, linkPrecedence: 'secondary' }, { where: { id: jsonObj.id } });
                    // if (!updatedContact) throw ApiErrors(500, "vjvnfn");
                }
            })

        }

        if (updateStatus == true) {

            const userContacts = await Contact.findAll({ where: condition });

            console.log("userContacts: ", userContacts.map(obj => obj.toJSON()));
            
            const data = createResponse(userContacts);
            return res.status(200).json(new ApiResponse(200, data));
        }

        primaryContact = existingContacts.find(obj => obj.toJSON().linkedId == null && obj.toJSON().linkPrecedence === "primary")

        const newSecondaryContact = await Contact.create({
            phoneNumber: userPhoneNumber,
            email: userEmail,
            linkedId: primaryContact.toJSON().id,
            linkPrecedence: "secondary"
        });

        if (!newSecondaryContact) throw new ApiErrors(500, "Not able Insert value in Database");

        const userContacts = [...existingContacts, newSecondaryContact];

        const data = createResponse(userContacts);
        return res.status(200).json(data);
    })
}