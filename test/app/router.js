'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const checkAuth = app.middleware.auth;
  const checkStudentAuth = app.middleware.authStudent;
  const checkTeacherAuth = app.middleware.authTeacher;
  const checkManageAuth = app.middleware.authManage;
  const checkChooseAuth = app.middleware.checkChooseAuth;
  // 登陆接口
  router.post('/login', controller.login.login);
  // 获取账户列表
  router.get('/getUserList', checkAuth(), checkManageAuth(), controller.user.getUserList);
  // 获取用户信息
  router.get('/getUserMessage', checkAuth(), controller.user.getMessage);
  // 修改用户信息
  router.post('/updateUserMessage', checkAuth(), checkManageAuth(), controller.user.updateUserMessage);
  // 修改用户密码
  router.post('/updatePassword', checkAuth(), controller.user.updatePwd);
  // 增加用户
  router.post('/addUser', checkAuth(), checkManageAuth(), controller.user.addUser);
  // 删除用户
  router.post('/deleteUser', checkAuth(), checkManageAuth(), controller.user.deleteUser);
  // 验证用户权限
  router.get('/getUserAuth', checkAuth(), controller.user.getAuth);
  // 获取图片上传权限token
  router.get('/getUploadToken', checkAuth(), controller.uploadToken.getToken);
  // 创建课程
  router.post('/createClass', checkAuth(), checkTeacherAuth(), controller.class.createClass);
  // 删除课程
  router.post('/deleteClass', checkAuth(), checkTeacherAuth(), controller.class.deleteClass);
  // 开启课程
  router.post('/openClass', checkAuth(), checkTeacherAuth(), controller.class.openClass);
  // 关闭课程
  router.post('/offClass', checkAuth(), checkTeacherAuth(), controller.class.offClass);
  // 搜索所有课程
  router.post('/queryClass', controller.class.queryClass);
  // 查询单一课程的详细信息
  router.post('/getClassDetail', controller.class.getClassDetail);
  // 检测是否具有选课资格
  router.post('/checkChooseAuth', checkAuth(), checkStudentAuth(), checkChooseAuth(), controller.class.checkChooseAuth);
  // 选择课程
  router.post('/chooseClass', checkAuth(), checkStudentAuth(), checkChooseAuth(), controller.class.chooseClass);
  // 退课
  router.post('/quitClass', checkAuth(), checkStudentAuth(), controller.class.quitClass);
  // 获取个人课程列表
  router.post('/getUserClass', checkAuth(), controller.class.getUserClass);
  // 获取课程当前教学进度
  router.post('/getProcessList', checkAuth(), controller.class.getProcessList);
  // 修改教学进度
  router.post('/updateProcess', checkAuth(), checkTeacherAuth(), controller.class.updateProcess);
  // 增加教学进度
  router.post('/addProcess', checkAuth(), checkTeacherAuth(), controller.class.addProcess);
  // 删除教学进度
  router.post('/deleteProcess', checkAuth(), checkTeacherAuth(), controller.class.deleteProcess);
  // 获取课程当前教学通知
  router.post('/getNoticeList', checkAuth(), controller.class.getNoticeList);
  // 获取通知详情
  router.post('/getNotice', checkAuth(), controller.class.getNotice);
  // 修改教学通知
  router.post('/updateNotice', checkAuth(), checkTeacherAuth(), controller.class.updateNotice);
  // 删除教学通知
  router.post('/deleteNotice', checkAuth(), checkTeacherAuth(), controller.class.deleteNotice);
  
  // 获取课程作业
  router.post('/getWorkList', checkAuth(), controller.class.getWorkList);
  // 获取通知详情
  router.post('/getWork', checkAuth(), controller.class.getWork);
  // 修改教学作业
  router.post('/updateWork', checkAuth(), checkTeacherAuth(), controller.class.updateWork);
  // 删除教学作业
  router.post('/deleteWork', checkAuth(), checkTeacherAuth(), controller.class.deleteWork);
  // 获取学生提交作业状态
  router.post('/getWorkStatus', checkAuth(), controller.class.getWorkStatus);
  // 获取所有作业的完成情况
  router.post('/getTotalList', checkAuth(), checkTeacherAuth(), controller.class.getTotalList);
  // 提交作业
  router.post('/submitWork', checkAuth(), checkStudentAuth(), controller.class.submitWork);
  // 批改分数
  router.post('/submitPoint', checkAuth(), checkTeacherAuth(), controller.class.submitWork);
  // 获取所有帖子
  router.post('/getPostList', checkAuth(), controller.class.getPostList);
  // 发表或更新帖子
  router.post('/submitPost', checkAuth(), controller.class.submitPost);
  // 删除帖子
  router.post('/deletePost', checkAuth(), controller.class.deletePost);
  // 获取帖子详情
  router.post('/getPost', checkAuth(), controller.class.getPost);
  // 获取帖子的评论
  router.post('/getPostReply', checkAuth(), controller.class.getPostReply);
  // 发表评论
  router.post('/submitReply', checkAuth(), controller.class.submitReply);
  // 删除评论
  router.post('/deleteReply', checkAuth(), controller.class.deleteReply);
  // 获取资源列表
  router.post('/getResourceList', checkAuth(), controller.class.getResourceList);
  // 上传资源
  router.post('/uploadResource', checkAuth(), controller.class.uploadResource);
  // 删除资源
  router.post('/deleteResource', checkAuth(), controller.class.deleteResource);

};
