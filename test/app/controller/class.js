'use strict';

const Controller = require('egg').Controller;
const imgFun = require('../util')

class ClassController extends Controller {
  // 创建课程
  async createClass() {
    const { ctx } = this;
    const query = ctx.request.body;
    query.teacherId = ctx.id;
    query.teacherName = ctx.teacherName;
    try {
      const result = await ctx.service.class.createClass(query);
      if (result.affectedRows === 1) {
        ctx.body = {
          code: 200,
          mes: '创建成功',
        };
      } else {
        ctx.body = {
          code: 500,
          mes: '服务器错误',
        };
      }
    } catch (e) {
      console.log('ee', e);
      ctx.body = {
        code: 401,
        mes: e,
      };
    }
  }

  // 搜索课程
  async queryClass() {
    const { ctx } = this;
    const query = ctx.request.body;
    if(!query.season) {
      delete query.season
    }
    if(!query.classStatus) {
      delete query.classStatus
    }
    try {
      const res = await ctx.service.class.queryClass(query);
      const start = (query.page - 1) * 8;
      const end = start + query.pageSize;
      const resList = res.slice(start, end)
      ctx.body = {
        code: 200,
        res: resList,
        total: res.length
      }
    } catch (e) {
      ctx.body = {
        code: 403,
        mes: e
      }
    }
  }

  // 获取单一课程的详细信息
  async getClassDetail() {
    const { ctx } = this;
    const query = ctx.request.body.id;
    try {
      const res = await ctx.service.class.getClassDetail(query);
      if (res.code === 1) {
        const result = res.mes
        ctx.body = {
          code: 200,
          data: result
        }
      } else {
        ctx.body = {
          code: 201,
          mes: '用户信息获取失败'
        }
      }
    } catch (e) {
      console.log(e)
      ctx.body = {
        code: 403,
        mes: e
      }
    }
  }

  // 选择课程 
  async chooseClass() {
    const { ctx } = this;
    const classId = ctx.request.body.id;
    const res = await ctx.service.class.chooseClass(classId, ctx.id);
    console.log('res', res);
    if(res.affectedRows === 1) {
      ctx.body = {
        code: 200,
        mes: '选课成功'
      }
    } else {
      ctx.status = 403;
      ctx.body = {
        code: 403,
        mes: '选课失败',
        reson: result.affectedRows
      }
    }
  }

  // 检测是否具有选课资格
  async checkChooseAuth() {
    const { ctx } = this;
    ctx.body = {
      code: 200,
      classType: 1,
      mes: '可选'
    }
  }

  // 获取个人课程列表
  async getUserClass() {
    const { ctx } = this;
    // 搜索的变量参数
    const query = ctx.request.body;
    const userMes = await ctx.service.user.userMessage(ctx.id);
    const userType = userMes.mes.userType;

    // 如果用户类型是教师，则直接从课程表里面查找
    if (userType === 2) {
      if(!query.season) {
        delete query.season
      }
      if(!query.classStatus) {
        delete query.classStatus
      }
      query.teacherId = ctx.id;
      try {
        const res = await ctx.service.class.queryClass(query);
        const start = (query.page - 1) * 3;
        const end = start + query.pageSize;
        const resList = res.slice(start, end)
        if(res.length > 0) {
          ctx.body = {
            code: 200,
            res: resList,
            total: res.length
          }
        } else {
          ctx.body = {
            code: 201,
            res: [],
            mes: '没有相关课程'
          }
        }

      } catch (e) {
        console.log(e)
        ctx.status = 403;
        ctx.body = {
          code: 403,
          mes: e
        }
      }
    }
    // 如果用户类型是学生，则先根据搜索条件将所有的课程搜索出来， 然后跟用户选课表中的选课Id进行过滤
    if (userType === 1) {
      if(!query.season) {
        delete query.season
      }
      if(!query.classStatus) {
        delete query.classStatus
      }
      try {
        // 根据搜索条件筛选出来的课程
        const allClassRes = await ctx.service.class.queryClass(query);
        // 得到用户选中的课程Id
        const classList = await ctx.service.class.getUserClass(ctx.id);
        let list = [];
        if(classList.length > 0) {
          if(allClassRes.length > 0) {
            for(let i of classList) {
              for(let j of allClassRes) {
                if(j.id === i.id) {
                  list.push(j)
                }
              }
            }
            const start = (query.page - 1) * 3;
            const end = start + query.pageSize;
            const resList = list.slice(start, end)
            if(list.length > 0) {
              ctx.body = {
                code: 200,
                res: resList,
                total: list.length
              }
            } else {
              ctx.body = {
                code: 201,
                res: [],
                total: 0,
                mes: '没有相关数据'
              }
            }
          } else {
            ctx.body = {
              code: 200,
              res: [],
              total: 0
            }
          }
        } else {
          ctx.body = {
            code: 200,
            res: [],
            total: 0
          }
        }
      } catch (e) {
        console.log('结果',e)
        ctx.status = 403;
        ctx.body = {
          code: 403,
          mes: e
        }
      }
    }
  }

  // 获取课程当前教学进度
  async getProcessList() {
    const { ctx } = this;
    const query = ctx.request.body.classId;
    try {
      const res = await ctx.service.class.getClassProcess(query);
      if (res.code === 1) {
        const result = res.mes
        ctx.body = {
          code: 200,
          res: result
        }
      } else {
        ctx.body = {
          code: 201,
          mes: '教学进度获取失败'
        }
      }
    } catch (e) {
      console.log(e)
      ctx.status = 403;
      ctx.body = {
        code: 403,
        mes: e
      }
    }
  }

  // 修改教学进度
  async updateProcess() {
    const { ctx } = this;
    const query = ctx.request.body;
    const res = await ctx.service.class.updateProcess(query);
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

  // 增加教学进度
  async addProcess() {
    const { ctx } = this;
    const query = ctx.request.body;
    const res = await ctx.service.class.addProcess(query);
    if (res.affectedRows ===1) {
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

  // 删除教学进度
  async deleteProcess() {
    const { ctx } = this;
    const query = ctx.request.body;
    const res = await ctx.service.class.deleteProcess(query);
    if (res.affectedRows === 1) {
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

  // 获取课程通知列表
  async getNoticeList() {
    const { ctx } = this;
    const query = ctx.request.body.classId;
    try {
      const res = await ctx.service.class.getClassNotice(query);
      if (res.code === 1) {
        const result = res.mes
        ctx.body = {
          code: 200,
          res: result
        }
      } else {
        ctx.body = {
          code: 201,
          mes: '教学通知获取失败'
        }
      }
    } catch (e) {
      console.log(e)
      ctx.status = 403;
      ctx.body = {
        code: 403,
        mes: e
      }
    }
  }

  // 获取教学通知详情
  async getNotice() {
    const { ctx } = this;
    const query = ctx.request.body.id;
    try {
      const res = await ctx.service.class.getNotice(query);
      if (res.code === 1) {
        const result = res.mes
        ctx.body = {
          code: 200,
          res: result
        }
      } else {
        ctx.body = {
          code: 201,
          mes: '信息获取失败'
        }
      }
    } catch (e) {
      console.log(e)
      ctx.body = {
        code: 403,
        mes: e
      }
    }    
  }

  // 修改课程通知
  async updateNotice() {
    const { ctx } = this;
    const query = ctx.request.body;
    let res = ''
    if (query.noticeId) {
      res = await ctx.service.class.updateNotice(query);
    } else {
      res = await ctx.service.class.addNotice(query);
    }
    if (res.affectedRows === 1) {
      ctx.body = {
        code: 200,
        res: '操作成功'
      }
    } else {
      console.log(res)
      ctx.body = {
        code: 201,
        res: '操作失败'
      }
    }
  }

  // 删除教学通知
  async deleteNotice() {
    const { ctx } = this;
    const query = ctx.request.body;
    const res = await ctx.service.class.deleteNotice(query);
    if (res.affectedRows === 1) {
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

  // 获取课程作业列表
  async getWorkList() {
    const { ctx } = this;
    const query = ctx.request.body.classId;
    try {
      const res = await ctx.service.class.getClassWork(query);
      if (res.code === 1) {
        const result = res.mes
        ctx.body = {
          code: 200,
          res: result
        }
      } else {
        ctx.body = {
          code: 201,
          mes: '获取失败'
        }
      }
    } catch (e) {
      console.log(e)
      ctx.status = 403;
      ctx.body = {
        code: 403,
        mes: e
      }
    }
  }

  // 获取作业详情
  async getWork() {
    const { ctx } = this;
    const query = ctx.request.body.id;
    try {
      const res = await ctx.service.class.getWork(query);
      if (res.code === 1) {
        const result = res.mes
        ctx.body = {
          code: 200,
          res: result
        }
      } else {
        ctx.body = {
          code: 201,
          mes: '信息获取失败'
        }
      }
    } catch (e) {
      console.log(e)
      ctx.body = {
        code: 403,
        mes: e
      }
    }    
  }

  // 修改或新增作业
  async updateWork() {
    const { ctx } = this;
    const query = ctx.request.body;
    let res = ''
    if (query.workId) {
      res = await ctx.service.class.updateWork(query);
    } else {
      res = await ctx.service.class.addWork(query);
    }
    if (res.affectedRows === 1) {
      ctx.body = {
        code: 200,
        res: '操作成功'
      }
    } else {
      console.log(res)
      ctx.body = {
        code: 201,
        res: '操作失败'
      }
    }
  }

  // 删除作业
  async deleteWork() {
    const { ctx } = this;
    const query = ctx.request.body;
    const res = await ctx.service.class.deleteWork(query);
    if (res.affectedRows === 1) {
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

  // 获取作业提交状态
  async getWorkStatus() {
    const { ctx } = this;
    const query = ctx.request.body;
    try {
      const res = await ctx.service.class.getWorkStatus(query);
      if (res.code === 1) {
        const result = res.mes
        ctx.body = {
          code: 200,
          res: result
        }
      } else {
        ctx.body = {
          code: 201,
          mes: '信息获取失败'
        }
      }
    } catch (e) {
      console.log(e)
      ctx.body = {
        code: 403,
        mes: e
      }
    }    
  }

  // 获取作业提交情况
  async getTotalList() {
    const { ctx } = this;
    const query = ctx.request.body.classId;
    try {
      // 获取当前课程的所有作业
      const res = await ctx.service.class.getClassWork(query);
      // 获取当前课程的所有选课学生
      const studentRes = await ctx.service.class.getClassStudent(query);
      console.log('studentRes', studentRes)
      const finalRes = []
      if (studentRes.length === 0) {
        ctx.body = {
          code: 200,
          res: []
        }
      }
      if (res.code === 1) {
        const workList = res.mes
        for(let i of workList) {
          console.log('i', i);
          let item = [];
          for(let items of studentRes) {
            const studentMessage = await ctx.service.user.userMessage(items.studentId)
            const _message = studentMessage.mes
            const _item = await ctx.service.class.getWorkStatus({ workId: i.id, studentId: items.studentId })
            console.log('_item', _item)
            const _res = _item.mes;
            console.log('_res', _res)
            if (_res.length > 0) {
              _message.point = _res[0].point;
              _message.submitStatus = 1;
            } else {
              _message.point = ''
              _message.submitStatus = 2;
            }
            console.log('studentMessage', _message)
            item.push(_message)
          }
          finalRes.push({workId: i.id, title: i.workTitle, sourceList: item})
        }
        ctx.body = {
          code: 200,
          res: finalRes
        }
      } else {
        ctx.body = {
          code: 201,
          mes: '当前课程没有作业'
        }
      }
    } catch (e) {
      console.log(e)
      ctx.body = {
        code: 403,
        mes: e
      }
    }  
  }

  // 修改或提交作业回答
  async submitWork() {
    const { ctx } = this;
    const query = ctx.request.body;
    let res = ''
    if (query.id) {
      res = await ctx.service.class.updateAnswer(query);
    } else {
      res = await ctx.service.class.addAnswer(query);
    }
    if (res.affectedRows === 1) {
      ctx.body = {
        code: 200,
        res: '操作成功'
      }
    } else {
      console.log(res)
      ctx.body = {
        code: 201,
        res: '操作失败'
      }
    }
  }

  // 获取课程下的所有帖子
  async getPostList() {
    const { ctx } = this;
    const query = ctx.request.body.classId;
    try {
      const res = await ctx.service.class.getPostList(query);
      if (res.code === 1) {
        const result = res.mes
        ctx.body = {
          code: 200,
          res: result
        }
      } else {
        ctx.body = {
          code: 201,
          mes: '获取失败'
        }
      }
    } catch (e) {
      console.log(e)
      ctx.status = 403;
      ctx.body = {
        code: 403,
        mes: e
      }
    }
  }

  // 修改或发表帖子
  async submitPost() {
    const { ctx } = this;
    const query = ctx.request.body;
    let res = ''
    if (query.postId) {
      res = await ctx.service.class.updatePost(query);
    } else {
      query.imgUrl = imgFun.changeImg(query.imgUrl)
      console.log('query', query)
      res = await ctx.service.class.addPost(query);
    }
    if (res.affectedRows === 1) {
      ctx.body = {
        code: 200,
        res: '操作成功'
      }
    } else {
      console.log(res)
      ctx.body = {
        code: 201,
        res: '操作失败'
      }
    }
  }

  // 删除帖子
  async deletePost() {
    const { ctx } = this;
    const query = ctx.request.body;
    const res = await ctx.service.class.deletePost(query);
    if (res.affectedRows === 1) {
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

  // 获取帖子详情
  async getPost() {
    const { ctx } = this;
    const query = ctx.request.body.id;
    try {
      const res = await ctx.service.class.getPost(query);
      if (res.code === 1) {
        const result = res.mes
        ctx.body = {
          code: 200,
          res: result
        }
      } else {
        ctx.body = {
          code: 201,
          mes: '信息获取失败'
        }
      }
    } catch (e) {
      console.log(e)
      ctx.body = {
        code: 403,
        mes: e
      }
    }  
  }

  // 获取帖子所有的评论
  async getPostReply() {
    const { ctx } = this;
    const query = ctx.request.body;
    try {
      const res = await ctx.service.class.getPostReply(query);
      if (res.code === 1) {
        const result = res.mes
        ctx.body = {
          code: 200,
          res: result
        }
      } else {
        ctx.body = {
          code: 201,
          mes: '信息获取失败'
        }
      }
    } catch (e) {
      console.log(e)
      ctx.body = {
        code: 403,
        mes: e
      }
    }  
  }

  // 发表评论
  async submitReply() {
    const { ctx } = this;
    const query = ctx.request.body;
    const res = await ctx.service.class.addReply(query);
    if (res.affectedRows === 1) {
      ctx.body = {
        code: 200,
        res: '操作成功'
      }
    } else {
      console.log(res)
      ctx.body = {
        code: 201,
        res: '操作失败'
      }
    }
  }
  
  // 删除评论
  async deleteReply() {
    const { ctx } = this;
    const query = ctx.request.body;
    const res = await ctx.service.class.deleteReply(query);
    if (res.affectedRows === 1) {
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
}

module.exports = ClassController;