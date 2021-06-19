<template>
    <section class="w3l-form-36">
			<div class="form-36-mian section-gap">
				<div class="wrapper">
					<div class="form-inner-cont">
						<h3>Register now</h3>
                        <el-form ref="register" :model="registerData" :rules="registerRules" method="post" class="signin-form" id="register">
                            <el-form-item prop="username">
                                <div class="form-input">
                                    <span class="fa fa-envelope-o" aria-hidden="true"></span>
                                    <el-input v-model="registerData.username"
                                              placeholder="Username"
                                              name="username"/>
                                </div>
                            </el-form-item>
                            <el-form-item prop="password">
                                <div class="form-input">
                                    <span class="fa fa-key" aria-hidden="true"></span>
                                    <el-input v-model="registerData.password"
                                              placeholder="Password"
                                              name="password"
                                              type="password"/>
                                </div>
                            </el-form-item>
                            <el-form-item prop="confirm_password">
                                <div class="form-input">
                                    <span class="fa fa-key" aria-hidden="true"></span>
                                    <el-input v-model="registerData.confirm_password"
                                              placeholder="Confirm_password"
                                              name="confirm_password"
                                              type="password"/>
                                </div>
                            </el-form-item>
                            <el-form-item prop="register_password">
                                <div class="form-input">
                                    <span class="fa fa-key" aria-hidden="true"></span>
                                    <el-input v-model="registerData.register_password"
                                              placeholder="Register_password"
                                              name="register_password"
                                              type="password"/>
                                </div>
                            </el-form-item>
                            <div class="login-remember d-grid">
                                <button class="btn theme-button" type="button" @click.prevent="register">Register</button>
                            </div>
                        </el-form>
					</div>
				</div>
			</div>
		</section>
</template>

<script type = "text/javascript">
export default {
    name:'register',
    data (){
        const validateUsername = (rule, value, callback) => {
            if (!value) {
                callback(new Error('username不能为空'))
            } else {
                callback()
            }
        }
        const validatePassword = (rule, value, callback) => {
            if (!value) {
                callback(new Error('password不能为空'))
            } else {
                callback()
            }
        }
        const validateConfirm = (rule, value, callback) => {
            if (!value) {
                callback(new Error('confirm_password不能为空'))
            } else {
                callback()
            }
        }
        const validateRegister = (rule, value, callback) => {
            if (!value) {
                callback(new Error('register_password不能为空'))
            } else {
                callback()
            }
        }
        return {
            registerData: {
                username: '',
                password: '',
                confirm_password: '',
                register_password: ''
            },
            registerRules: {
                username: [{ required: true, trigger: 'blur', validator: validateUsername }],
                password: [{ required: true, trigger: 'blur', validator: validatePassword }],
                confirm_password: [{ required: true, trigger: 'blur', validator: validateConfirm }],
                register_password: [{ required: true, trigger: 'blur', validator: validateRegister }]
            },
        }
    },
    methods: {
        register (){
            this.$refs.register.validate(valid => {
                if (valid) {
                    this.gt.httpPost('/register', this.registerData)
                        .then(response => {
                            const status = response.data.status;
                            if (status === 'ok') {
                                this.$router.push({ path: '/login' });
                            } else {
                                alert(status);
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

