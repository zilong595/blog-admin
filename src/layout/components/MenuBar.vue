<template>
    <div class="menu-wrap">
        <el-menu default-active="2" class="el-menu-vertical-demo" background-color="rgb(33, 37, 43)" text-color="#fff">
            <template v-for="menuItem in menuList" :key="menuItem.id">
                <el-sub-menu v-if="menuItem.children.length > 0" :index="menuItem.id">
                    <template #title>
                        <span>{{ menuItem.name }}</span>
                    </template>
                    <el-menu-item v-for="subMenuItem in menuItem.children" :index="subMenuItem.id" :key="subMenuItem.id" @click="handleMenuClick(subMenuItem)">{{ subMenuItem.name }}</el-menu-item>
                </el-sub-menu>
                <el-menu-item v-else :index="menuItem.id" @click="handleMenuClick(menuItem)">
                    <span>{{ menuItem.name }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const menuList = ref([]);

const emit = defineEmits(['menu-click']);

const fetchMenuList = () => {
    const res = [
        {
            id: '1',
            name: '内容管理',
            path: '',
            children: [
                { id: '1-1', name: '文章管理', path: '/content/article' },
                { id: '1-2', name: '留言管理', path: '/content/message' },
            ]
        },
        {
            id: '2',
            name: '系统管理',
            path: '',
            children: [
                { id: '2-1', name: '系统日志', path: '/system/log' },
                { id: '2-2', name: '栏目管理', path: '/system/columnManagement' }
            ]
        },
    ]
    menuList.value = res;
};

const handleMenuClick  = (menuItem) => {
    emit('menu-click', menuItem);
};

onMounted(() => {
    fetchMenuList();
})
</script>

<style scoped>
.menu-wrap .el-menu{border: 0;}
</style>