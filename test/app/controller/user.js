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
  // 获取权限
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
      ctx.status = 401;
      ctx.body = {
        code: 401,
        mes: '用户验证失败'
      }
    }
  }
  // 获取用户列表
  async getUserList() {
    const { ctx } = this;
    if (ctx.id) {
      const res = await ctx.service.user.getUserList();
      if (res.code === 1) {
        ctx.body = {
          code: 200,
          list: res.list,
          mes: res.mes
        }
      } else {
        ctx.body = {
          code: 201,
          mes: res.mes
        }
      }
    } else {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        mes: '用户验证失败'
      }
    }
  }
  // 更新用户个人信息
  async updateUserMessage() {
    const { ctx } = this;
    const query = ctx.request.body;
    const res = await ctx.service.user.updateData(query);
    if (res.affectedRows === 1) {
      ctx.body = {
        code: 200,
        res: '更新成功'
      }
    } else {
      console.log(res)
      ctx.body = {
        code: 201,
        res: '更新失败'
      }
    }
  }
  // 增加用户
  async addUser() {
    const { ctx } = this;
    const query = ctx.request.body;
    const res = await ctx.service.user.insert(query);
    if (res.userRes.affectedRows ===1 && res.detailRes.affectedRows === 1) {
      ctx.body = {
        code: 200,
        res: '添加成功'       
      }
    } else {
      console.log(res)
      ctx.body = {
        code: 201,
        res: '添加失败'
      }
    }
  }
  // 删除用户
  async deleteUser() {
    const { ctx } = this;
    const query = ctx.request.body;
    const res = await ctx.service.user.delete(query);
    if (res.userRes.affectedRows === 1 && res.detailRes.affectedRows === 1) {
      ctx.body = {
        code: 200,
        res: '删除成功'
      }
    } else {
      console.log(res)
      ctx.body = {
        code: 201,
        res: '删除失败'
      }
    }
  }

  // 修改用户密码
  async updatePwd() {
    const { ctx } = this;
    const query = ctx.request.body;
    if(!query.userId) {
      query.userId = ctx.id
    }
    const res = await ctx.service.user.updatePwd(query);
    if (res.affectedRows === 1) {
      ctx.body = {
        code: 200,
        res: '更新成功'
      }
    } else {
      console.log(res)
      ctx.body = {
        code: 201,
        res: '更新失败'
      }
    }
  }
}

module.exports = UserController;
