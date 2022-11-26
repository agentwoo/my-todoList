import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true, // 监听局域网和公网地址
    strictPort: false, // 端口占用则尝试下一个端口
    proxy: {
      '/todo/': {
        target: 'https://ngx.weimember.cn/',  // 代理目标
        changeOrigin: true,  // 将主机头的来源更改为目标 URL
        ws: true, // 代理 websocket
      },
    },
  },
})
