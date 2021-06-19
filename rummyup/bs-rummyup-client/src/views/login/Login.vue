<template>
    <section class="w3l-form-36">
        <div class="form-36-mian section-gap">
            <div class="wrapper">
                <div class="form-inner-cont">
                    <h3 class="chear_font">Login now</h3>
                    <el-form ref="login" :model="login" :rules="loginRules" method="post" class="signin-form" id="form">
                        <el-form-item prop="username">
                            <div class="form-input">
                                <span class="fa fa-envelope-o" aria-hidden="true"></span>
                                 <el-input ref="username"
                                           v-model="login.username"
                                           placeholder="Username"
                                           name="username"/>
                            </div>
                        </el-form-item>
                        <el-form-item prop="password">
                            <div class="form-input">
                                <span class="fa fa-key" aria-hidden="true"></span>
                                <el-input ref="password"
                                          v-model="login.password"
                                          placeholder="Password"
                                          type="password"
                                          name="password"/>
                            </div>
                        </el-form-item>
                        <div class="login-remember d-grid">
                            <label class="check-remaind">
                                <input type="checkbox">
                                <span class="checkmark"></span>
                                <p class="remember">Remember me</p>
                            </label>
                            <button class="btn theme-button" @click.prevent="handleLogin">Login</button>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
    </section>
</template>


<script type = "text/javascript">
import "@/../static/css/style.css"
import "@/../static/css/font-awesome.css"
import { setToken, setUser } from '@/utils/Cookies.js'
export default {
    name: 'Login',
    data () {
        const validateUsername = (rule, value, callback) => {
            if (!value) {
                callback(new Error('username不能为空'))
            } else {
                callback()
            }
        }
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('password能小于6位'))
            } else {
                callback()
            }
        }
        return {
            msg: null,
            login: {
                username: '',
                password: ''
            },
            loginRules: {
                username: [{ required: true, trigger: 'blur', validator: validateUsername }],
                password: [{ required: true, trigger: 'blur', validator: validatePassword }]
            },
        }
    },
    mounted () {
    },
    methods: {
        handleLogin () {
            this.$refs.login.validate(valid => {
                if (valid) {
                    this.gt.httpPost('/login', this.login).then(response => {
                            console.log('login response.data : ', response);
                            const { token, user } = response.data;
                            if (token) {
                                setToken(token);
                                setUser(user);
                                this.$router.push({ path: '/realtime_data' });
                            } else {
                                alert(response.data.msg)
                            }
                        })
                } else {
                    return false
                }
            })
        }
    }
}
</script>

<style>
    .el-form-item {
        margin-bottom: 0
    }
</style>
