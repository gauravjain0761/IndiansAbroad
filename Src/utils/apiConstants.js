export const api = {
    BASE_URL: "https://express.indiansabroad.online/api",
    IMAGE_URL: "https://cdn.indiansabroad.online/",


    login: '/user/login',

    checkSession: '/user/check-session',
    getUser: '/user/getuser',



    // post
    getalluserposts: '/post/getalluserposts',
    likedislike: '/postlike/likedislike',
    likeduserlist: '/postlike/userlist',



    // other user
    followRequest: '/follow/request',
    unFollowRequest: '/followunfollow/unfollow',
    blockUser: '/blockuser/action',


    //profile
    blockUserList: "/blockuser/list",

}

export const POST = "POST";
export const GET = "GET";
export const PATCH = "PATCH";
export const DELETE = "DELETE";