<!-- 用户信息 -->
<script lang='ts' setup>
import { reactive, toRefs, ref } from 'vue'
import { useUserStore } from '../../store/index'

const userStore = useUserStore()

interface IuserInfo {
    img: string;
    userName: string;
    // userRemark: string;
    // mobile: string;
    passWord: string;
}

const userInfo = reactive<IuserInfo>({
    img: userStore.userImg,
    userName: userStore.userInfo.user_name,
    // userRemark: userStore.userInfo.user_remark,
    // mobile: userStore.userInfo.mobile,
    passWord: userStore.userInfo.password
})

const formRef = ref()
const rules = reactive({
    userName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
    userRemark: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
    mobile: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
    passWord: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
})



</script>

<template>
    <div class="userInfo">
        <div class="userInfo_container">
            <el-form label-width="80px" class="userInfoForm" ref="formRef" :rules="rules">
                <img :src="userInfo.img" alt="用户头像">
                <el-form-item label="名称:" prop="userName">
                    <el-input type="text" v-model="userInfo.userName" autocomplete="off" />
                </el-form-item>
                <!-- <el-form-item label="备注:" prop="userRemark">
                    <el-input type="text" v-model="userInfo.userRemark" autocomplete="off" />
                </el-form-item>
                <el-form-item label="手机:" prop="mobile">
                    <el-input type="text" v-model="userInfo.mobile" autocomplete="off" />
                </el-form-item> -->
                <el-form-item label="密码:" prop="passWord">
                    <el-input type="password" v-model="userInfo.passWord" autocomplete="off" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="editBtn">确定修改</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style lang='scss' scoped>
.userInfo {
    display: flex;
    justify-content: center;

    &_container {
        margin-top: 10%;
        width: 300px;
        border-radius: 20px;
        background-color: white;

        .userInfoForm {
            width: 250px;

            img {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                margin-left: 50%;
            }

            .editBtn {
                width: 100%;
            }
        }


    }
}
</style>