'use strict';

const Service = require('egg').Service;

class ClassService extends Service {
  // 创建课程
  async createClass (data) {
    const { app } = this;
    const result = await app.mysql.insert('class', {
      name: data.className,
      classId: data.classId,
      year: data.time[0],
      season: data.season,
      limted: data.limiteNum,
      img: data.imgUrl,
      introduce: data.classIntro,
      teacherId: data.teacherId,
      classStatus: 'open',
      teacherName: data.teacherName
    });
    return result;
  }
  // 查找课程
  async queryClass (data) {
    const { app } = this;
    const obj = {};
    if(data.className) {
      obj.name = data.className
    }
    if(data.year) {
      obj.year = data.year
    }
    if(data.season) {
      obj.season = data.season
    }
    if(data.classStatus) {
      obj.classStatus = data.classStatus
    }
    if(data.teacherName) {
      obj.teacherName = data.teacherName
    }
    if(data.teacherId) {
      obj.teacherId = data.teacherId
    }
    const result = await app.mysql.select('class', {
      where: obj,
      orders: [['id','desc']]
    })
    return result;
  }
  // 获取课程的详细信息
  async getClassDetail (id) {
    const { app } = this;
    const mes = await app.mysql.get('class', { id });
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
  // 确认是否具有选课资格
  async checkChooseAuth (classId, userId) {
    const { app } = this;
    const chooseResult = await app.mysql.select('classChoose', {
      where: {
        id: classId,
        studentId: userId
      }
    })
    const classResult = await app.mysql.get('class', { id: classId });
    return {
      chooseResult,
      classResult
    }
  }
  // 选课
  async chooseClass (classId, userId) {
    const { app } = this;
    const res = await app.mysql.insert('classChoose', {
      id: classId,
      studentId: userId,
      time: new Date()
    })
    return res
  }
  // 获取用户选的课程列表
  async getUserClass (userId) {
    const { app } = this;
    const res = await app.mysql.select('classChoose', {
      where: { studentId: userId },
      orders: [['time', 'desc']]
    })
    return res
  }
}

module.exports = ClassService;