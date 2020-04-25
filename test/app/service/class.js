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
      img: data.imgUrl,
      introduce: data.classIntro,
      teacherId: data.teacherId,
      classStatus: 'open',
      teacherName: data.teacherName
    });
    return result;
  }

  // 删除课程
  async deleteClass(query) {
    const { app } = this;
    const res = await app.mysql.delete('class', {
      id: query.classId
    })
    return res
  }

  // 更新课程状态
  async updateClassStatus (query) {
    const { app } = this;
    const options = {
      where: {
        id: query.classId,
      },
    };
    const row = {
      classStatus: query.status
    };
    const result = await app.mysql.update('class', row, options);
    return result
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

  // 退课
  async quitClass (classId, userId) {
    const { app } = this;
    const res = await app.mysql.delete('classChoose', {
      id: classId,
      studentId: userId,
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
  // 获取当前课程教学进度
  async getClassProcess (classId) {
    const { app } = this;
    const mes = await app.mysql.select('classProcess', { 
      where: { classId },
      orders:[['processTime', 'asc']] 
    });
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
  // 更新教学进度
  async updateProcess (query) {
    const { app } = this;
    const options = {
      where: {
        id: query.id,
      },
    };
    const row = {
      processValue: query.processValue,
      processType: query.processType,
      processTime: query.processTime
    };
    const result = await app.mysql.update('classProcess', row, options);
    return result
  }
  // 增加教学进度
  async addProcess (query) {
    const { app } = this;
    const res = await app.mysql.insert('classProcess', {
      classId: query.classId,
      processValue: query.processValue,
      processType: query.processType,
      processTime: query.processTime
    });
    return res
  }
  // 删除教学进度
  async deleteProcess(query) {
    const { app } = this;
    const res = await app.mysql.delete('classProcess', {
      id: query.processId
    })
    return res
  }
  // 获取课程通知列表
  async getClassNotice (classId) {
    const { app } = this;
    const mes = await app.mysql.select('classNotice', { 
      where: { classId },
      orders:[['time', 'desc']] 
    });
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
  // 获取教学通知详细信息
  async getNotice (id) {
    const { app } = this;
    const mes = await app.mysql.get('classNotice', { id });
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
  // 更新教学进度
  async updateNotice (query) {
    const { app } = this;
    const options = {
      where: {
        id: query.noticeId,
      },
    };
    const row = {
      noticeContent: query.noticeContent,
      noticeTitle: query.noticeTitle,
      time: query.time
    };
    const result = await app.mysql.update('classNotice', row, options);
    return result
  }
  // 增加教学通知
  async addNotice (query) {
    const { app } = this;
    const res = await app.mysql.insert('classNotice', {
      classId: query.classId,
      noticeTitle: query.noticeTitle,
      noticeContent: query.noticeContent,
      time: query.time
    });
    return res
  }
  // 删除教学通知
  async deleteNotice(query) {
    const { app } = this;
    const res = await app.mysql.delete('classNotice', {
      id: query.noticeId
    })
    return res
  }

  // 获取作业列表
  async getClassWork(classId) {
    const { app } = this;
    const mes = await app.mysql.select('classWork', { 
      where: { classId },
      orders:[['time', 'desc']] 
    });
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
  // 获取作业详细信息
  async getWork (id) {
    const { app } = this;
    const mes = await app.mysql.get('classWork', { id });
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
  // 更新作业
  async updateWork (query) {
    const { app } = this;
    const options = {
      where: {
        id: query.workId,
      },
    };
    const row = {
      workContent: query.workContent,
      workTitle: query.workTitle,
      endtime: query.endTime
    };
    const result = await app.mysql.update('classWork', row, options);
    return result
  }
  // 增加作业
  async addWork (query) {
    const { app } = this;
    const res = await app.mysql.insert('classWork', {
      classId: query.classId,
      workTitle: query.workTitle,
      workContent: query.workContent,
      endTime: query.endTime,
      time: query.time
    });
    return res
  }
  // 删除作业
  async deleteWork(query) {
    const { app } = this;
    const res = await app.mysql.delete('classWork', {
      id: query.id
    })
    return res
  }
  // 获取当前提交作业状态
  async getWorkStatus (query) {
    const { app } = this;
    const mes = await app.mysql.select('workSubmit', { 
      where: { workId: query.workId, studentId: query.studentId },
    });
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

  // 获取课程所有的选课学生
  async getClassStudent (query) {
    const { app } = this;
    const res = await app.mysql.select('classChoose', { 
      where: { id: query },
    });
    return res
  }

  // 更新作业的回答
  async updateAnswer (query) {
    const { app } = this;
    const options = {
      where: {
        id: query.id,
      },
    };
    const row = {
      workValue: query.workValue,
      lastSubmitTime: query.lastSubmitTime,
      point: query.point || NULL
    };
    const result = await app.mysql.update('workSubmit', row, options);
    return result
  }

  // 提交新作业的回答
  async addAnswer (query) {
    const { app } = this;
    const res = await app.mysql.insert('workSubmit', {
      workId: query.workId,
      studentId: query.studentId,
      workValue: query.workValue,
      lastSubmitTime: query.lastSubmitTime
    });
    return res
  }

  // 获取所有帖子
  async getPostList (classId) {
    const { app } = this;
    const mes = await app.mysql.select('post', { 
      where: { classId },
      orders:[['postTime', 'desc']] 
    });
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

  // 发表帖子
  async addPost (query) {
    const { app } = this;
    const res = await app.mysql.insert('post', {
      userId: query.userId,
      userName: query.userName,
      classId: query.classId,
      postTitle: query.postTitle,
      postContent: query.postContent,
      imgUrl: query.imgUrl,
      postTime: query.postTime
    });
    return res
  }

  // 更新帖子
  async updatePost (query) {
    const { app } = this;
    const options = {
      where: {
        id: query.postId,
      },
    };
    const row = {
      postContent: query.postContent,
      postTitle: query.postTitle,
      postTime: query.postTime,
      imgUrl: query.imgUrl
    };
    const result = await app.mysql.update('post', row, options);
    return result
  }

  // 删除帖子
  async deletePost(query) {
    const { app } = this;
    const res = await app.mysql.delete('post', {
      id: query.id
    })
    return res
  }
  
  // 获取帖子详情
  async getPost (query) {
    const { app } = this;
    const mes = await app.mysql.get('post', { id: query });
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

  // 获取帖子所有的评论
  async getPostReply (query) {
    const { app } = this;
    const mes = await app.mysql.select('reply', { 
      where: { postId: query.postId },
      orders:[['replyTime', 'desc']] 
    });
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

  // 发表评论
  async addReply (query) {
    const { app } = this;
    const res = await app.mysql.insert('reply', {
      postId: query.postId,
      replyUser: query.userId,
      replyContent: query.replyContent,
      replyTime: query.replyTime,
      replyName: query.replyName
    });
    return res
  }

  // 删除评论
  async deleteReply(query) {
    const { app } = this;
    const res = await app.mysql.delete('reply', {
      id: query.id
    })
    return res
  }

  // 上传资源
  async uploadResource(query) {
    const { app } = this;
    const res = await app.mysql.insert('classResource', {
      userId: query.userId,
      type: query.type,
      name: query.name,
      classId: query.classId,
      address: query.address,
      time: query.time
    });
    return res
  }

  // 获取资源列表
  async getResourceList (classId) {
    const { app } = this;
    const mes = await app.mysql.select('classResource', { 
      where: { classId },
      orders:[['time', 'desc']] 
    });
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

  // 删除资源
  async deleteResource(query) {
    const { app } = this;
    const res = await app.mysql.delete('classResource', {
      id: query.id
    })
    return res
  }

}

module.exports = ClassService;