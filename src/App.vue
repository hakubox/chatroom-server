<template>
    <div class="page-root" :class="{'page-init': isLogin === undefined }">
        <!-- <router-link to="/">测试1</router-link>
        <router-link to="/example1">测试2</router-link>
        <router-link to="/example2">测试3</router-link>
        <a class="link" @click="runExample2">去测试3</a> -->
        <hr />

        <input type="text" v-model="newUserName" placeholder="请输入用户名">
        <a class="link" @click="createUser">增加新用户</a>
        <a class="link" @click="userDisconnect">下线</a>
        <hr />
        数据库所有用户
        <ul>
            <li v-for="item in userList" :key="item.user_id">用户名：<code>{{item.username}}</code>，昵称：<code>{{item.nickname}}</code>，当前积分：<code>{{item.score}}</code></li>
        </ul>
        当前用户

        聊天
        <hr>
        <div class="chatform">
            <div class="chatform-content">
                <div class="chatform-group" :class="{'active': item.nickname === '管理员'}" v-for="(item, index) in userMsgList" :key="index">
                    <div class="chatform-head" v-show="item.nickname !== '管理员'" :style="{'background-image':'url(https://www.agri35.com/UploadFiles/img_2_2365344459_2446449051_26.jpg)'}"></div>
                    <div class="chatform-item" :sid="item.userGId">
                        <dl>
                            <!-- <dt>{{item.nickname}}说</dt> -->
                            <dd>{{item.content}}</dd>
                        </dl>
                    </div>
                </div>
            </div>
            <!-- 底部输入框 -->
            <div class="chatform-inputform">
                <ul>

                </ul>
                <textarea class="input" v-model="userMsg" @keypress.ctrl.enter="sendMsg"></textarea>
                <button class="chatform-send" @click="sendMsg">→</button>
            </div>
        </div>


        <!-- 登录浮动层 -->
        <div class="login-body" v-show="isLogin === false">
            <!-- 登录 -->
            <form v-show="loginFormState == 1" class="login-form" @submit.prevent="login()" action="/api/login">
                <div class="header">
                    <img src="" />
                    <h2>欢迎登录</h2>
                </div>
                <div class="input" :class="{'invalid': !loginInfo.username}">
                    <i class="input-icon fal fa-fw fa-user"></i>
                    <input type="text" placeholder="用户名" v-model="loginInfo.username" />
                    <i class="tooltip tooltip-danger" :class="{'active': !loginInfo.username}">用户名不能为空</i>
                </div>
                <div class="input">
                    <i class="input-icon fal fa-fw fa-lock"></i>
                    <input type="password" placeholder="密码" v-model="loginInfo.password" />
                </div>
                <div>
                    <a class="link" @click="loginFormState = 2">注册</a>
                    <a class="link fr" @click="loginFormState = 3">忘记密码</a>
                </div>
                <button class="btn btn-block btn-lg btn-primary">登录</button>
            </form>
            <!-- 注册 -->
            <form v-show="loginFormState == 2" class="login-form" @submit.prevent="login()" action="/api/login">
                <div class="header">
                    <img src="" />
                    <h2>注册</h2>
                </div>
                <div class="input" :class="{'invalid': !registerInfo.username}">
                    <i class="input-icon fal fa-fw fa-user"></i>
                    <input type="text" placeholder="用户名" v-model="registerInfo.username" />
                    <i class="tooltip tooltip-danger" v-show="!registerInfo.username">用户名不能为空</i>
                </div>
                <div class="input">
                    <i class="input-icon fal fa-fw fa-lock"></i>
                    <input type="password" placeholder="密码" v-model="registerInfo.password" />
                </div>
                <div class="input">
                    <i class="input-icon fal fa-fw fa-email"></i>
                    <input type="email" placeholder="邮箱" v-model="registerInfo.email" />
                </div>
                <button class="btn btn-block btn-lg btn-primary">登录</button>
            </form>
        </div>

        <router-view></router-view>
    </div>
</template>
<script>
    import io from 'socket.io-client/dist/socket.io.js'
    import { debug } from 'util';
    const socket = io();

    export default {
        name: 'app',
        components:{
        },
        data: () => ({
            userList: [],
            newUserName: '',
            userMsgList: [],
            userMsg: '',
            isLogin: undefined,
            //登录页状态：1、登录 2、注册 3、忘记密码
            loginFormState: 1,
            userInfo: {},
            loginInfo: {
                username: '',
                password: ''
            },
            registerInfo: {
                username: '',
                password: '',
                email: ''
            }
        }),
        mounted() {
            this.getUserList();

            socket.on('server_adduser', d => {
                this.getUserList();
            });

            socket.on('client_message', d => {
                this.userMsgList.unshift(d.msg);
            })

            socket.on('server_message', d => {
                console.log(d);
                console.log('服务器说：' + d.msg);
            });

            //验证是否已登录
            this.$axios.post('/api/isLogin').then(d => {
                this.isLogin = !!d;
                this.$set(this, 'userInfo', d);
            });
            //获取旧消息
            this.$axios.get('/api/message/getHistory', {
                params: {
                    time: new Date().getTime(),
                    totype: 'group',
                    toid: 'f0f0a6a1-2ec0-11e9-80e0-00163e0515e9'
                }
            }).then(d => {
                this.$set(this, 'userMsgList', d);
            });
        },
        methods: {
            getUserList() {
                this.$axios.get('/api/user/getall', {
                    params: {
                        username: 'testtest'
                    }
                }).then(res => {
                    this.userList = res.data;
                });
            },
            createUser() {
                this.$axios.post('/api/user/createnew', `username=${this.newUserName}`).then(res => {
                    socket.emit('adduser', this.newUserName);
                    this.getUserList();
                })
            },
            runExample2() {
                this.$router.push({path:'/example2'})
            },
            sendMsg() {
                socket.emit('message', {
                    content: this.userMsg,
                    nickname: this.userInfo.nickname,
                    id: this.userInfo.id,
                    createtime: new Date(),
                    socketid: socket.id
                });
                this.$axios.post('/api/message/send', {
                    content: this.userMsg,
                    nickname: this.userInfo.nickname,
                    fromid: this.userInfo.id,
                    toid: 'f0f0a6a1-2ec0-11e9-80e0-00163e0515e9', //this.toid,
                    socketid: socket.id
                }).then(res => {
                })
                this.userMsg = '';
            },
            userDisconnect() {
                socket.emit('disconnect', '我下线了！');
            },
            login() {
                this.$axios.post('/api/login', {
                    username: this.loginInfo.username,
                    password: this.loginInfo.password
                }).then(d => {
                    this.isLogin = true;
                    this.$set(this, 'userInfo', d);
                    this.$root.saveToken(d);
                })
            }
        }
    }
</script>

<style lang="less">

    html {
        height: auto;
    }

    .page-root:after {
        content: '';
        opacity: 0;
        display: none;
    }

    .page-root.page-init:after {
        z-index: 999999;
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;

        transition: 0.2s;
        background-color: white;
        opacity: 1;
    }

    .login-body {
        position: fixed;
        background-color: rgba(0,0,0,0.2);
        transition: 0.15s;
        top: 0px;
        left: 0px;
        width: 99%;
        height: 100%;
    }

    .login-body > .login-form {
        position: absolute;
        margin: auto;
        height: 230px;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

    }

    //聊天窗口
    .chatform {
        width: 400px;
        height: 700px;
        margin: auto;
        background-color: #4C4A48;
        background-image: url(https://b-ssl.duitang.com/uploads/item/201508/01/20150801081048_ji5r3.thumb.1900_0.jpeg);
        background-size: cover;
        background-position: center center;

        //底部输入框
        > .chatform-inputform {
            background-color: white;
            height: 40px;
            border-top: 1px solid rgba(0,0,0,0.6);

            > textarea {
                height: 40px;
                min-height: 40px;
                width: calc(100% - 40px);
                border: none;
                resize: none;
                overflow: hidden;
                float: left;
                background-color: #e2e2f3;
            }

            > .chatform-send {
                height: 40px;
                width: 40px;
                vertical-align: top;
                border: none;
                background-color: #7877EC;
                color: white;
                font-size: 13px;
                font-weight: bold;
                line-height: 38px;
            }
        }

        > .chatform-content {
            padding: 20px 10px 20px 10px;
            overflow-y: auto;
            height: 660px;
            box-sizing: border-box;

            //对话组（单人多条消息）
            > .chatform-group {
                margin-bottom: 10px;

                > .chatform-head {
                    position: relative;
                    user-select: none;
                    display: inline-block;
                    margin-top: 2px;
                    margin-right: 5px;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    user-select: none;
                    background-size: cover;
                    background-position: center center;
                    background-repeat: no-repeat;
                }

                > .chatform-item {
                    text-align: left;
                    width: calc(100% - 50px);
                    display: inline-block;
                    vertical-align: top;

                    > dl {
                        display: inline-block;
                        margin: 0px 0px 0px 0px;
                        background-color: rgba(0,0,0,0.4);
                        padding: 10px;
                        border-radius: 10px;
                        border-top-left-radius: 0px;

                        > dt {
                            font-size: 12px;
                            min-width: 50px;
                            padding-left: 20px;
                            line-height: 20px;
                            padding-bottom: 5px;
                            text-align: right;
                            color: #FF798D;
                            font-weight: bold;
                        }

                        > dd {
                            font-size: 13px;
                            margin-left: 0px;
                            color: #DDD;
                            text-align: right;
                        }
                    }
                }

                &.active {

                    > .chatform-item {
                        text-align: right;
                        width: 100%;

                        > dl {
                            background-color: #7877ec;
                            border-top-right-radius: 0px;
                            border-top-left-radius: 10px;

                            > dt {
                                text-align: left;
                                padding-left: 0px;
                                padding-right: 20px;
                                color: #93D057;
                            }

                            > dd {
                                text-align: left;
                                color: #EEE;
                            }
                        }
                    }
                }
            }
        }

    }
</style>
