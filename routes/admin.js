const express = require("express");
const router = express.Router();
const login = require('./admin/login')
const product = require('./admin/product')
const user = require('./admin/user')



router.use('/login', login)
router.use('/product', product)
router.use('/user', user)
router.use('/', product)

module.exports = router;