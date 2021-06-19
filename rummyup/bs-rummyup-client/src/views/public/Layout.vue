<template>
    <el-container class="color-bg">
        <LSidebar/>
        <el-container>
            <el-header>
                <THeader/>
            </el-header>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<style>
    .color-bg {
        background: rgb(247, 247, 252);
        height: 100%;
        border: 1px solid #eee;
    }
</style>

<script>
import LSidebar from '@/views/public/LSidebar.vue'
import THeader from '@/views/public/THeader.vue'
export default {
    name: 'Layout',
    components: {
        LSidebar,
        THeader
    }
}
</script>