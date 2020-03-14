'use strict';

// 对教师的权限进行验证
module.exports = () => {
  return async function  (ctx, next) {
    if (ctx.id) {
      const mes = await ctx.service.user.userMessage(ctx.id);
      if(mes.code === 1) {
        const res = mes.mes
        if(res.userType === 2) {
          ctx.teacherName = res.userName
          await next();
        } else {
          ctx.body = {
            code: 401,
            mes: '权限不足'
          }
        }
      } else {
        ctx.body = {
          code: 404,
          mes: '登陆信息失效'
        }
      }
    }
  };
};