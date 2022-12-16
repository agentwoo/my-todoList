<!-- 个人信息 -->
<script lang='ts' setup>
import { reactive, toRefs, ref } from 'vue'
import { useUserStore } from '@/store';

const userStore = useUserStore()
const radio = ref(3)

</script>

<template>
    <div class="container">
        <div class="container-inner">
            <div class="userInfo">
                <img :src="userStore.userInfo.head_img_url" alt="用户头像">
                <div class="userInfo-item">
                    <div>{{ userStore.userInfo.user_name }}</div>
                    <div>{{ userStore.userInfo.email }}</div>
                </div>
            </div>
            <div>
                <el-button @click=useUserStore().logout()>退出登录</el-button>
            </div>
        </div>
        <div class="container-theme">
            <div class="container-theme-title">主题</div>
            <div>
                <el-radio-group v-model="radio">
                    <el-radio :label="3">深色主题</el-radio>
                    <el-radio :label="6">浅色主题</el-radio>
                </el-radio-group>
            </div>
        </div>
    </div>
</template>

<style lang='scss' scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;

    &-inner {
        width: 600px;
        padding: 60px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid gray;

        .userInfo {
            display: flex;

            img {
                border-radius: 50%;
                width: 80px;
            }

            &-item {
                margin-top: 10px;
                margin-left: 5px;

                div:nth-child(1) {
                    font-size: 30px;
                }
            }
        }
    }

    &-theme {
        padding: 40px 0;
        margin-right: 400px;

        &-title {
            font-size: 40px;
            padding-bottom: 20px;
        }
    }
}
</style>