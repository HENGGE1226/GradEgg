'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async getMessage() {
    const { ctx } = this;
    if (ctx.id) {
      const mes = await ctx.service.user.userMessage(ctx.id);
      if (mes.code === 1) {
        const res = mes.mes
        ctx.body = {
          code: 200,
          data: res
        }
      } else {
        ctx.body = {
          code: 201,
          mes: '用户信息获取失败'
        }
      }
    } else {
      ctx.body = {
        code: 401,
        mes: '用户验证失败'
      }
    }
  }
  async getAuth() {
    const { ctx } = this;
    if (ctx.id) {
      const mes = await ctx.service.user.userMessage(ctx.id);
      if (mes.code === 1) {
        const res = mes.mes
        console.log(res)
        ctx.body = {
          code: 200,
          data: res.userType
        }
      } else {
        ctx.body = {
          code: 201,
          mes: '权限获取失败'
        }
      }
    } else {
      ctx.body = {
        code: 401,
        mes: '用户验证失败'
      }
    }
  }
}

module.exports = UserController;
