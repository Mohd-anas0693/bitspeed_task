const { Op,where } = require("sequelize");
const Contact = require('../models/contact.model');
const asyncHandler = require('../utils/asyncHandler')
const ApiErrors = require('../utils/apiErrors');
const { ErrorMessage } = require("../utils/message");

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

        const { phoneNumber, email } = req.body;
        

        if (!phoneNumber && !email) throw new ApiErrors(400, ErrorMessage.fieldsRequired);


        const condition = {
            [Op.or]: [
                { phoneNumber: phoneNumber },
                { email: email }
            ]
        }

        const existingContacts = await Contact.findAll({ where: condition });

        if (!phoneNumber || !email) return res.status(200).json(createResponse(existingContacts));;

        let newContact;

        if (!Array.isArray(existingContacts) || existingContacts.length == 0) {


            newContact = await Contact.create({ phoneNumber: phoneNumber, email: email, linkedId: null, linkPrecedence: "primary" });
            console.log("newContact : ", newContact);
            if (!newContact) throw new ApiErrors(500, "Server Error! Insertion Failed.");

            return res.status(200).json(createResponse([newContact]));
        }

        let primaryContact = existingContacts.find(obj => obj.toJSON().email == email && obj.toJSON().linkPrecedence == 'primary' && obj.toJSON().linkedId == null)
        let updateStatus = false;
    

        if (primaryContact) {
            for (let index = 0; index < existingContacts.length; index++) {

                const jsonObj = existingContacts[index].toJSON();
                console.log("JsonObj: " + jsonObj.phoneNumber);

                if (jsonObj.phoneNumber == phoneNumber  ) {
                    await Contact.update({ linkedId: primaryContact.toJSON().id, linkPrecedence: 'secondary' }, { where: { id: jsonObj.id } });
                    updateStatus = true;
                }
                
            }

        }

        if (updateStatus == true) {

            const userContacts = await Contact.findAll({ where: condition });

            console.log("userContacts: ", userContacts.map(obj => obj.toJSON()));

            const data = createResponse(userContacts);
            return res.status(200).json(data);
        }

        primaryContact = existingContacts.find(obj => obj.toJSON().linkedId == null && obj.toJSON().linkPrecedence === "primary")

        const newSecondaryContact = await Contact.create({
            phoneNumber: phoneNumber,
            email: email,
            linkedId: primaryContact.toJSON().id,
            linkPrecedence: "secondary"
        });

        if (!newSecondaryContact) throw new ApiErrors(500, "Not able Insert value in Database");

        const userContacts = [...existingContacts, newSecondaryContact];

        const data = createResponse(userContacts);
        return res.status(200).json(data);
    })
}