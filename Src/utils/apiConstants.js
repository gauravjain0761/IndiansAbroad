export const api = {
  BASE_URL: 'https://express.indiansabroad.online/api',
  IMAGE_URL: 'https://cdn.indiansabroad.online/',

  login: '/user/login',
  checkSession: '/user/check-session',
  getUser: '/user/getuser',
  getOtp: '/user/getotp',
  verifyotp: 'user/verifyotp',
  retryotp: 'user/retryotp',
  registerstepone: '/user/registerstepone',
  registersteptwo: 'user/registersteptwo',
  getSignupCountries: '/countries/list/0',
  forgotPassword: '/user/forgotpass',
  resetPass: '/user/resetpass?key=1',
  feedbackform: '/feedbackform/create',
  enquiry: '/enquiryform/create',
  updateProfile: '/user/updateprofile',
  deleteUserAccount: '/user/delete/account',

  // post
  getalluserposts: '/post/getalluserposts',
  likedislike: '/postlike/likedislike',
  likeduserlist: '/postlike/userlist',
  getsinglepost: 'post/getsinglepost',
  getallcomments: 'comment/allcomments',
  commentLike: '/comment/like',
  commentReplyList: '/reply/list',
  onreport: '/report/create',
  share: '/share/content',
  createComment: '/comment/create',
  addCommentReply: '/reply/create',
  deleteComment: '/comment/delete',
  deleteCommentReply: '/reply/delete',
  createPost: '/post/create',
  deletePost: '/post/deletepost',
  updatePost: '/post/update',
  deletepostmedia: '/post/deletepostmedia',

  //Indians
  indiansList: '/user/suggestion/filter',
  pageList: '/cp/tab/list',

  // other user
  followRequest: '/follow/request',
  unFollowRequest: '/followunfollow/unfollow',
  blockUser: '/blockuser/action',
  cancelRequest: '/follow/cancel/request',
  otherUserFollowList: '/followunfollow/followinglist',

  //profile
  blockUserList: '/blockuser/list',
  getallpostsOfUser: '/post/getallposts',

  // page
  getAllPagePostApi: '/cp/posts/',
  getAllPageFollowerApi: '/cp/followerlist',
  pageFollow: '/cp/follow',
  pageUnFollow: '/cp/unfollow',
  createPage: '/cp/create',
  getMyPage: '/cp/list/',
  updatePage: '/cp/update',
  deletePage: '/cp/delete',
  getPageDetail: '/cp/details/',

  // global search
  globalSearch: '/global/search',

  // discussion
  countriesList: '/countries/forums/list',
  threadList: '/thread/list',
  getThreadDetail: '/thread/detail',
  getThreadCommentList: '/thread/comment/list/',
  getThreadReplyList: '/thread/comment/reply/list/',
  createThreadComment: '/thread/comment/create',
  addThreadCommentReply: '/thread/comment/reply/create',
  deleteThreadComment: '/thread/comment/delete',
  deleteThreadCommentReply: '/thread/comment/reply/delete',
  deleteThread: '/thread/delete',
  updateThread: '/thread/update',
  deleteThreadmedia: '/thread/delete/media',
  createThread: '/thread/create',

  //chat
  chatRoom: '/chat/list/personal',
  message: '/message/listall',
};

export const POST = 'POST';
export const GET = 'GET';
export const PATCH = 'PATCH';
export const DELETE = 'DELETE';
