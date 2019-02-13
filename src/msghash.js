export default {
    getMsg(info, data) {
        if(typeof(info) === 'string') {
            if(info[0] === '!') {
                return this.info[info.substr(1)];
            } else {
                return info;
            }
        } else {
            return info.toString();
        }
    },
    info: {
        username_blank: '请输入用户名',
        password_blank: '请输入密码',
        email_blank: '请输入邮箱',

        login_user_not_found: '用户不存在',
        login_password_error: '密码输入错误',

        userinfo_not_found: '未获取用户相关信息',
        user_add_error: '新增用户失败',

        token_expired: '用户Token过期',

        system_error: '系统错误，请联系管理员'
    }
}
