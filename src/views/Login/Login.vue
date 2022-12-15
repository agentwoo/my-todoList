<!-- 登录 -->
<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import router from '../../router';
import { createAesEncryption } from '@/utils/cipher'
import { errMessage, successMessage } from '@/utils';
import { useMenusStore, useTodoListStore, useUserStore } from '@/store'

// 加密对象
const Aes = createAesEncryption({ key: 'abcdefgabcdefg12' })

const data = reactive({
    loginForm: {
        email: 'test2@qq.com',
        passWord: '123456'
    },
    rules: {
        email: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 6, max: 24, message: '账号长度需要在6-24之间', trigger: 'blur' },
        ],
        passWord: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 24, message: '密码长度需要在6-24之间', trigger: 'blur' },
        ]
    }
})

const loginFormRef = ref()
async function submitForm() {
    const $form = loginFormRef.value
    if (!$form) return
    const valid = await $form.validate()
    if (!valid) return


    let res = await $api.pv.login({
        email: Aes.encryptByAES(data.loginForm.email.trim()),
        password: Aes.encryptByAES(data.loginForm.passWord.trim())
    })
    if (res.ok) {
        router.push('/myOneDay')
        successMessage('登录成功')

        useTodoListStore().testTodo = res.data.tasks
        useMenusStore().testMenus = res.data.task_cates
        useUserStore().userInfo = res.data.user

        data.loginForm.email = ''
        data.loginForm.passWord = ''
    } else {
        errMessage(res.err)
    }
}


</script>

<template>
    <div class="login-box">
        <el-form ref="loginFormRef" :model="data.loginForm" status-icon :rules="data.rules" label-width="70px"
            class="loginForm">
            <h2>todoList</h2>
            <el-form-item label="邮箱:" prop="email">
                <el-input v-model="data.loginForm.email" autocomplete="off" />
            </el-form-item>
            <el-form-item label="密码:" prop="passWord">
                <el-input v-model="data.loginForm.passWord" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()" class="sub-btn">登录</el-button>
            </el-form-item>
            <RouterLink to="/register" class="link">没有账号?点击注册</RouterLink>
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
            margin-left: 210px;
            text-decoration: none;
        }
    }
}
</style>
