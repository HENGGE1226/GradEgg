'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
  async login() {
    const { ctx } = this;
    const query = ctx.request.body;
    const userId = query.Id;
    const pwd = query.pwd;
    const loginResult = await ctx.service.user.userLogin(userId, pwd);
    if(loginResult.code === 1) {
      const token = await ctx.service.token.signJwt(userId);
      ctx.body = {
        code: 200,
        token,
        mes: loginResult.mes
      }
    } else {
      ctx.body = {
        code: 201,
        mes: loginResult.mes
      }
    }
  }
}

module.exports = LoginController;