'use strict';

const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
const secert_key = '#ygh1226';

class TokenService extends Service {
  // 签发token
  async signJwt(id) {
    return jwt.sign({
      data: {
        id,
      },
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3600 * 24 * 7),
    }, secert_key);
  }
  // 验证jwt的方法
  async decodeJwt(token) {
    try {
      return jwt.verify(token, secert_key);
    } catch (err) {
      return err;
    }
  }
}
module.exports = TokenService;