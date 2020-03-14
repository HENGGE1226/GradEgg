'use strict';

// 对所有人的权限进行验证
module.exports = () => {
  return async function  (ctx, next) {
    const authorization = ctx.get('Authorization');
    if (!authorization) { // 判断请求头有没有携带 token ,没有直接返回 401
      ctx.throw(401, 'no token detected in http header "Authorization"');
    }
    const token = authorization.split(' ')[1];
    try { 
      const auth = await ctx.service.token.decodeJwt(token);
      ctx.id = auth.data.id;
      await next();
    } catch (e) {
      console.log('错误', e)
      ctx.status = 401;
      ctx.body = {
        mes: '登陆信息失效' 
      }
    }
  };
};