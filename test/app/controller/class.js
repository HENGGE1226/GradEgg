'use strict';

const Controller = require('egg').Controller;

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
}

module.exports = ClassController;