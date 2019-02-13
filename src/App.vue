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
        <div class="form cols1">
            <dl :sid="item.userGId" v-for="(item, index) in userMsgList" :key="index">
                <dt>{{item.nickname}}说</dt>
                <dd>{{item.content}}</dd>
            </dl>
        </div>
        <textarea class="input" v-model="userMsg" @keypress.ctrl.enter="sendMsg"></textarea>
        <a class="btn btn-primary" @click="sendMsg">发送</a>


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

<style>

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
        width: 100%;
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
</style>
