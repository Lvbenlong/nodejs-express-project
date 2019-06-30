const express = require('express')
const multiparty = require('multiparty')
const fs = require('fs')
const router = express.Router()
const DB = require('../../modules/db')

router.get("/",function (req,res) {
  DB.find('product', {}, function(err, data){
    res.render('product/product', {
      list: data
    })
  })
});
router.get("/add",function (req,res) {
  res.render('product/add')
});
router.post("/doAdd",function (req,res) {
  var form = new multiparty.Form();
  form.uploadDir='upload'
  form.parse(req, function(err, fields, files) {
    const title = fields.title[0]
    const price = fields.price[0]
    const fee = fields.fee[0]
    const description = fields.description[0]
    const pic = files.pic[0].path
    //获取提交的数据以及图片上传成功返回的图片信息
    DB.insert('product', {title,price,fee,description,pic}, function(err, data){
      if (!err){
        console.log(data)
        res.redirect('/admin/product')
      }
    })
  });
});
router.get("/edit",function (req,res) {
  const id = req.query.id
  DB.find('product', {_id:  DB.ObjectID(id)}, function(err, data){
    console.log(data)
    res.render('product/edit', {
      data: data[0]
    })
  })
});

router.post("/doEdit",function (req,res) {
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
        res.redirect('/admin/product/')
      }
    })
  });
});

router.get("/delete",function (req,res) {
  DB.deleteOne('product', {_id: DB.ObjectID(req.query.id)}, function(err, data){
    if (!err){
        res.redirect('/admin/product')
    }
  })
});

module.exports = router