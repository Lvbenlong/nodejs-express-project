const express = require('express')
const router = express.Router()
const MD5 = require('md5-node')
const DB = require('../../modules/db')


router.get("/",function (req,res) {
  res.render('login')
});

router.post("/doLogin",function (req,res) {
  
  const username = req.body.username
  const password = MD5(req.body.password)
  DB.find('user', {username, password}, function(err, data){
    if (data.length > 0) {
      req.session.userinfo = data[0]
      res.redirect('/admin/product')
    }else{
      res.send("<script>alert('登录失败');location.href='/admin/login'</script>");
    }
  })
});

router.get('/logout', (req, res) => {
  req.session.destroy(function (err){
    if (err) return
    res.redirect('/admin/login')
  })
})

module.exports = router