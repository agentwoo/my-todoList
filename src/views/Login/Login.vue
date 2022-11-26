<!-- 登录 -->
<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { loginApi, getLoginInfoApi } from '../../http/api'
import router from '../../router';
import { useMenusStore, useUserStore } from '../../store/index'


interface ILoginForm {
    userName: string;
    passWord: string;
}

const loginForm = ref<ILoginForm>({
    userName: '',
    passWord: ''
})

const rules = reactive({
    userName: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 6, max: 24, message: '账号长度需要在6-24之间', trigger: 'blur' },
    ],
    passWord: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 24, message: '密码长度需要在6-24之间', trigger: 'blur' },
    ]
})

const loginFormRef = ref()


// 登录
const menusStore = useMenusStore()
const userInfo = useUserStore()
const submitForm = () => {
    loginFormRef.value.validate().then(() => {
        loginApi({
            userName: loginForm.value.userName,
            passWord: loginForm.value.passWord
        }).then((res: any) => {
            if (res.code === 200) {
                localStorage.setItem('token', res.data.token)
                getLoginInfoApi().then(res => {
                    menusStore.nemus = res.data.menus


                    router.push('/homePage')
                })
            }
        })
    }).catch(() => {
        console.log('验证不通过');
    })
}




</script>

<template>
    <div class="login-box">
        <el-form ref="loginFormRef" :model="loginForm" status-icon :rules="rules" label-width="70px" class="loginForm">
            <h2>todoList</h2>
            <el-form-item label="账号:" prop="userName">
                <el-input v-model="loginForm.userName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="密码:" prop="passWord">
                <el-input v-model="loginForm.passWord" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()" class="sub-btn">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped lang="scss">
.login-box {
    height: 100vh;
    background-image: url('../../assets/loginBgm.jpg');
    background-repeat: repeat;
    box-sizing: border-box;
    padding-top: 200px;

    .loginForm {
        width: 350px;
        padding: 20px;
        background: white;
        border-radius: 20px;
        margin: 0 auto;

        h2 {
            text-align: center;
        }

        .sub-btn {
            width: 100%;
        }
    }
}
</style>
