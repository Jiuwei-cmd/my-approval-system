
//demo.js

//导入express模块
const express = require('express')

//创建服务器
const demo = express.Router()

const {fetchApprovalList, fetchApprovalDetail, updateApproval, createApproval, withdrawApproval, handleApproval} = require('../dataBase/api')

//定义中间件，获取项目列表信息
demo.get("/get",async (req,res,next) => {
  try {
    const queryParams = req.query;
    const data = await fetchApprovalList(queryParams);
    
    res.json({
      code: 200,
      msg: 'success',
      data: data
    })
    // res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
})

// 定义中间件，获取项目详情信息
demo.get("/getDetail",async (req,res,next) => {
  try {
    const key = req.query.key;
    console.log(key);
    const data = await fetchApprovalDetail(key);
    res.json({
      code: 200,
      msg: 'success',
      data: data
    })
  } catch (error) {
    res.status(500).send(error.message);
  }
})

// 更新审批单接口
demo.put("/update",async (req,res,next) => {
  try {
    const key = req.query.key;
    const params = req.body;
    console.log(key, params);
    const data = await updateApproval(key, params);
    res.json({
      code: 200,
      msg: 'success',
      data: data
    })
  } catch (error) {
    res.status(500).send(error.message);
  }
})

// 定义中间件，新建审批单
demo.post("/create",async (req,res,next) => {
  try {
    const params = req.body;
    console.log(params);
    const data = await createApproval(params);
    res.json({
      code: 200,
      msg: 'success',
      data: data
    })
  } catch (error) {
    res.status(500).send(error.message);
  }
})

// 定义中间件,撤回审批单
demo.put("/withdraw",async (req,res,next) => {
  try {
    const key = req.query.key;
    const data = await withdrawApproval(key);
    res.json({
      code: 200,
      msg: 'success',
      data: data
    })
  } catch (error) {
    res.status(500).send(error.message);
  }
})

// 定义中间件,处理审批单
demo.post("/handle",async (req,res,next) => {
  try {
    // const key = req.query.key;
    const params = req.body;
    // console.log(key, params);
    const data = await handleApproval(params);
    res.json({
      code: 200,
      msg: 'success',
      data: data
    })
  } catch (error) {
    res.status(500).send(error.message);
  }
})


module.exports = demo