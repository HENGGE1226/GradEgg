'use strict';

// 对选课的资格进行验证
module.exports = () => {
  return async function (ctx, next) {
    try {
      if(ctx.id) {
        const userId = ctx.id;
        const classId = ctx.request.body.id;
        const res = await ctx.service.class.checkChooseAuth(classId, userId);
        if (res.classResult) {
          const { studentNum, limted } = res.classResult;
          console.log('dasdasdas', studentNum, limted)
          if(res.chooseResult.length === 0) {
            if(limted > studentNum) {
              await next();
            } else {
              ctx.body = {
                code: 403,
                classType: 2,
                mes: '课程已选满'
              }
            }
          } else {
            ctx.body = {
              code: 200,
              classType: 3,
              mes: '已选中该课程'
            }
          }
        } else {
          ctx.status = 403;
          ctx.body = {
            mes: '课程不存在'
          }
        }
      } else {
        ctx.status = 403;
        ctx.body = {
          mes: '权限不足'
        }
      }      
    } catch (e) {
      console.log('错误二', e);
      ctx.body = {
        code: 403,
        e
      }
    }
  };
};