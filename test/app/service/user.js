'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  // 查询该学号是否存在及密码是否正确
  async userLogin (id, pwd) {
    const { app } = this;
    const user = await app.mysql.get('user', { userId: id });
    if (user) {
      if (user.password === pwd) {
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


  // 向用户表中插入用户数据
  async insert(id, name, pwd) {
    const { app } = this;
    const result = await app.mysql.insert('user', {
      username: name,
      userid: id,
      pwd,
    });
    return result;
  }

  // 更新用户的密码
  async updatePwd(id, newPwd) {
    const { app } = this;
    const row = {
      pwd: newPwd,
    };
    const option = {
      where: {
        userid: id,
      },
    };
    const result = await app.mysql.update('user', row, option);
    return result;
  }

  // 获取用户的个人信息
  async queryUser(userid) {
    const { app } = this;
    const result = await app.mysql.get('user', { userid });
    return result;
  }

  // 更新用户的资料
  async updateData(userid, option, newData) {
    const { app } = this;
    const options = {
      where: {
        userid,
      },
    };
    const row = {
      [option]: newData,
    };
    const result = await app.mysql.update('user', row, options);
    return result;
  }

}
module.exports = UserService;