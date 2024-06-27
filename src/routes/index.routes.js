const { Router } = require('express');
const router = Router();
const { createContact } = require('../controllers/contact.controller');
router.route("/identify").post(createContact);

module.exports = router ;