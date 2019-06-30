const express = require('express')
const router = express.Router()
const DB = require('../../modules/db')

router.get("/",function (req,res) {
  DB.find('user', {}, function(err, data){
    res.render('user/user', {
      list: data
    })
  })
});
router.get("/add",function (req,res) {
  res.send("增加用户")
});

module.exports = router