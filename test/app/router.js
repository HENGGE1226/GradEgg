'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const checkAuth = app.middleware.auth;
  const checkStudentAuth = app.middleware.authStudent;
  const checkTeacherAuth = app.middleware.authTeacher;
  const checkChooseAuth = app.middleware.checkChooseAuth;
  // 登陆接口
  router.post('/login', controller.login.login);
  // 获取用户信息
  router.get('/getUserMessage', checkAuth(), controller.user.getMessage);
  // 验证用户权限
  router.get('/getUserAuth', checkAuth(), controller.user.getAuth);
  // 获取图片上传权限token
  router.get('/getUploadToken', checkAuth(), controller.uploadToken.getToken);
  // 创建课程
  router.post('/createClass', checkAuth(), checkTeacherAuth(), controller.class.createClass);
  // 搜索所有课程
  router.post('/queryClass', controller.class.queryClass);
  // 查询单一课程的详细信息
  router.post('/getClassDetail', controller.class.getClassDetail);
  // 检测是否具有选课资格
  router.post('/checkChooseAuth', checkAuth(), checkStudentAuth(), checkChooseAuth(), controller.class.checkChooseAuth);
  // 选择课程
  router.post('/chooseClass', checkAuth(), checkStudentAuth(), checkChooseAuth(), controller.class.chooseClass);
  // 获取个人课程列表
  router.post('/getUserClass', checkAuth(), controller.class.getUserClass);

};
