// 路由模块化
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

const index = require('./routes/index')
const admin = require('./routes/admin')

const app = new express()
app.set('view engine', 'ejs')
// 设置静态资源文件
app.use(express.static('public'))
app.use('/upload',express.static('upload'));

// 使用body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// 使用session
app.use(session({
  secret: 'userinfo',
  name:'userinfo',
  rolling: true,
}))

// 权限判断
app.use(function(req, res, next){
  if (req.url === '/admin/login' || req.url === '/admin/login/doLogin') {
    next()
  }else{
    if (req.session.userinfo&&req.session.userinfo.username !== '') {
      app.locals['userinfo']=req.session.userinfo
      next()
    }else{
      res.redirect('/admin/login')
    }
  }
})

app.use('/', admin)
app.use('/admin', admin)



app.listen(3000)