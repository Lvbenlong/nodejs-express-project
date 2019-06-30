// 未使用路由模块化
const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const session = require('express-session')
const MD5 = require('md5-node')
const multiparty = require('multiparty')
const DB = require('./modules/db')


const app = new express()

app.set('view engine', 'ejs')
// 给public目录下面的文件提供静态web服务
app.use(express.static('public'))
// 给图片文件涉及虚拟目录
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

//ejs中 设置全局数据   所有的页面都可以使用
//app.locals['userinfo']='1213'

// 权限判断
// app.use(function(req, res, next){
  // if (req.url === '/login' || req.url === '/doLogin') {
  //   next()
  // }else{
  //   if (req.session.userinfo&&req.session.userinfo.username !== '') {
  //     app.locals['userinfo']=req.session.userinfo
  //     next()
  //   }else{
  //     res.redirect('/login')
  //   }
  // }
// })

app.get('/logout', (req, res) => {
  req.session.destroy(function (err){
    if (err) return
    res.redirect('/login')
  })
})
app.get('/login', (req, res) => {
  res.render('login')
})
app.post('/doLogin', (req, res) => {
  const username = req.body.username
  const password = MD5(req.body.password)
  DB.find('user', {username, password}, function(err, data){
    if (data.length > 0) {
      req.session.userinfo = data[0]
      res.redirect('/productlist')
    }else{
      res.send("<script>alert('登录失败');location.href='/login'</script>");
    }
  })
})

app.get('/productlist', (req, res) => {
  DB.find('product', {}, function(err, data){
    res.render('productlist', {
      list: data
    })
  })
})
app.get('/productadd', (req, res) => {
  res.render('productadd')
})
app.post('/productDoAdd', (req, res) => {
  var form = new multiparty.Form();

  form.uploadDir='upload'
 
  form.parse(req, function(err, fields, files) {

    console.log(fields)
    console.log(files)
    const title = fields.title[0]
    const price = fields.price[0]
    const fee = fields.fee[0]
    const description = fields.description[0]
    const pic = files.pic[0].path
    //获取提交的数据以及图片上传成功返回的图片信息
    DB.insert('product', {title,price,fee,description,pic}, function(err, data){
      if (!err){
        console.log(data)
        res.redirect('/productlist')
      }
    })
  });

})

app.get('/productedit', (req, res) => {
  console.log(req.query.id)
  const id = req.query.id
  DB.find('product', {_id:  DB.ObjectID(id)}, function(err, data){
    console.log(data)
    res.render('productedit', {
      data: data[0]
    })
  })
})
app.post('/productDoEdit', (req, res) => {
  var form = new multiparty.Form();

  form.uploadDir='upload'
 
  form.parse(req, function(err, fields, files) {
    const updateData = {
      id: fields.id[0],
      title: fields.title[0],
      price: fields.price[0],
      fee: fields.fee[0],
      description: fields.description[0],
    }
    if (files.pic[0].originalFilename !== '') {
      updateData.pic = files.pic[0].path
    }else{
      console.log(files.pic[0].path);
      fs.unlink(files.pic[0].path,function(err, data){
        console.log('delete tmp file sucessful.')
      });

    }
    //获取提交的数据以及图片上传成功返回的图片信息
    DB.update('product', {_id: DB.ObjectID(updateData.id)}, updateData, function(err, data){
      if (!err){
        res.redirect('/productlist')
      }
    })
  });

})

app.get('/productDoDelete', (req, res) => {
  DB.deleteOne('product', {_id: DB.ObjectID(req.query.id)}, function(err, data){
    if (!err){
      res.redirect('/productlist')
    }
  })

})



app.get('/', (req, res) => {
  res.render('productlist')
})

app.listen(3000)