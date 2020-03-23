'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');

class UserService extends Service {
  // 查询该学号是否存在及密码是否正确
  async userLogin (id, pwd) {
    const { app } = this;
    const user = await app.mysql.get('user', { userId: id });
    const hashPwd = crypto.createHash('md5').update(pwd).digest('hex');
    if (user) {
      if (user.password === hashPwd) {
        return {
          code: 1,
          type: user.type,
          mes: '登陆成功'
        }
      } else {
        return {
          code: 2,
          mes: '密码错误'
        }
      }
    } else {
      return {
        code: 3,
        mes: '用户不存在'
      }
    }
  }

  // 查询学号下的用户资料
  async userMessage (id) {
    const { app } = this;
    const mes = await app.mysql.get('userDetail', { userId: id });
    if (mes) {
      return {
        code: 1,
        mes
      }
    } else {
      return {
        code: 2,
        mes: '查询失败'
      }
    }
  }

  // 获取所有用户的资料
  async getUserList () {
    const { app } = this;
    const list = await app.mysql.select('userDetail');
    if (list) {
      return {
        code: 1,
        list: list,
        mes: '获取成功'
      }
    } else {
      return {
        code: 2,
        mes: '获取失败'
      }
    }
  }

  // 更新用户的资料
  async updateData(query) {
    const { app } = this;
    const options = {
      where: {
        userId: query.userId,
      },
    };
    const row = {
      userId: Number(query.userId),
      userType: Number(query.userType),
      userName: query.userName
    };
    const result = await app.mysql.update('userDetail', row, options);
    return result;
  }

  // 向用户表和信息表中插入用户数据
  async insert(query) {
    const { app } = this;
    const hashPwd = crypto.createHash('md5').update(query.password).digest('hex');
    const userRes = await app.mysql.insert('user', {
      userId: query.userId,
      password: hashPwd
    });
    const detailRes = await app.mysql.insert('userDetail', {
      userId: query.userId,
      userName: query.userName,
      userType: query.userType
    });
    return {
      userRes,
      detailRes
    };
  }

  // 删除账号
  async delete(query) {
    const { app } = this;
    const userRes = await app.mysql.delete('user', {
      userId: query.userId
    })
    const detailRes = await app.mysql.delete('userDetail', {
      userId: query.userId
    })
    return {
      userRes,
      detailRes
    }
  }

  // 更新用户的密码
  async updatePwd(query) {
    const { app } = this;
    const hashPwd = crypto.createHash('md5').update(query.password).digest('hex');
    const row = {
      password: hashPwd,
    };
    const option = {
      where: {
        userId: query.userId,
      },
    };
    const result = await app.mysql.update('user', row, option);
    return result;
  }

}
module.exports = UserService;