const express = require('express')
const router = express.Router()
/*可使用 express.Router 类创建模块化、可挂载的路由句柄*/

router.get('/', function(req, res) {
  res.send('index page')
})

router.get('/product', (req, res) => {
  res.send('product page')
})

module.exports = router

