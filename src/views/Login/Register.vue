<!-- 登录 -->
<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { createAesEncryption } from '@/utils/cipher'
import { errMessage, successMessage } from '@/utils';
import router from '@/router';

// 加密对象
const Aes = createAesEncryption({ key: 'abcdefgabcdefg12' })

const checkPassWord = (rule: any, value: string, callback: any) => {
    if (!value.trim()) {
        callback('输入不能为空')
    } else if (value.trim() !== data.registerForm.confirmPassWord) {
        callback('密码输入不一致')
    } else {
        return callback()
    }
}

const data = reactive({
    registerForm: {
        userName: '',
        email: '',
        passWord: '',
        confirmPassWord: ''
    },
    rules: {
        userName: [{ required: true, message: '请输入昵称' }],
        email: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 6, max: 24, message: '账号长度需要在6-24之间', trigger: 'blur' },
        ],
        passWord: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 24, message: '密码长度需要在6-24之间', trigger: 'blur' },
        ],
        confirmPassWord: [{ validator: checkPassWord, required: true, trigger: 'blur' }]
    }
})

const registerFormRef = ref()

async function submitForm() {
    const $form = registerFormRef.value
    if (!$form) return
    const valid = await $form.validate()
    if (!valid) return

    let res = await $api.pv.register({
        user_name: data.registerForm.userName.trim(),
        email: data.registerForm.email.trim(),
        password: data.registerForm.passWord.trim()
    })

    // console.log('res', res);

    if (res.ok) {
        router.push({
            path: '/login'
        })
        successMessage('注册成功')

        data.registerForm.userName = ''
        data.registerForm.email = ''
        data.registerForm.passWord = ''
        data.registerForm.confirmPassWord = ''
    } else {
        errMessage(res.err)
    }
}

</script>

<template>
    <div class="login-box">
        <el-form ref="registerFormRef" :model="data.registerForm" status-icon :rules="data.rules" label-width="90px"
            class="loginForm">
            <h2>注册</h2>
            <el-form-item label="昵称:" prop="userName">
                <el-input v-model="data.registerForm.userName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="邮箱:" prop="telNum">
                <el-input v-model="data.registerForm.email" autocomplete="off" />
            </el-form-item>
            <el-form-item label="密码:" prop="passWord">
                <el-input v-model="data.registerForm.passWord" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="确认密码:" prop="confirmPassWord">
                <el-input v-model="data.registerForm.confirmPassWord" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()" class="sub-btn">注册</el-button>
            </el-form-item>
            <RouterLink to="/login" class="link">已有账号，点击登录</RouterLink>
        </el-form>
    </div>
</template>

<style scoped lang="scss">
.login-box {
    height: 100vh;
    background-color: #5C8ABB;
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

        .link {
            margin-left: 205px;
            text-decoration: none;
        }
    }
}
</style>
