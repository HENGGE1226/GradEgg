'use strict';

const Controller = require('egg').Controller;
const qiniu = require("qiniu");

class UploadTokenController extends Controller {
  async getToken() {
    const { ctx } = this;
    try {
      const accessKey = 'm6EMqUV3XwiRkwG9w-mVH-HaJrg001htFSXtbqx8';
      const secretKey = 'EM87f2vkkgfiI5pQ_7oKA3SZYhzF4nreRWyawjoI';
      const bucket = 'ygh2';
      const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);    
      const options = {
        scope: bucket,
        expires: 7200000,
      };
      const putPolicy = new qiniu.rs.PutPolicy(options);
      const uploadToken = putPolicy.uploadToken(mac);
      ctx.body = {
        code: 200,
        message: '获取成功',
        uploadToken,
      };
    } catch (e) {
      console.log(e);
      ctx.body = {
        code: 401,
        message: e,
      };
    }
  }
}

module.exports = UploadTokenController;