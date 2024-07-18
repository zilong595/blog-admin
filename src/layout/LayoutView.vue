<template>
    <el-container class="admin-wrapper" v-bind:class="classObject">
        <div class="layout-side">
            <div class="logo">
                <span>Blog Admin</span>
            </div>
            <menu-bar @menu-click="handleMenuClick" />
        </div>
        <el-container class="layout-main">
            <el-scrollbar>
                <el-header class="layout-header">
                    <div class="layout-navbars-container">
                        <div class="layout-navbars-breadcrumb">
                            <div class="left-panel">
                                <el-icon v-if="isCollapse==true" @click="isCollapse=false"><Fold /></el-icon>
                                <el-icon v-else @click="isCollapse=true"><Expand /></el-icon>
                            </div>
                            <div class="right-panel">
                                <div class="action">
                                    <div class="item">
                                        <i class="iconfont icon-home" @click="goHome()"></i>
                                    </div>
                                    <div class="item">
                                        <i class="iconfont" v-bind:class="[isFullscreen ? 'icon-full-exit' : 'icon-full-screen']"></i>
                                    </div>
                                    <div class="item">
                                        <el-badge value="99">
                                            <i class="iconfont icon-notification"></i>
                                        </el-badge>
                                    </div>
                                    <div class="item">
                                        <i class="iconfont icon-refresh"></i>
                                    </div>
                                </div>
                                <el-dropdown @command="handleCommand" trigger="click">
                                    <span class="avatar-dropdown">
                                        <el-avatar class="user-avatar" :src="avatarUrl" :size="35"></el-avatar>
                                        <span>{{ username }}</span>
                                        <el-icon class="el-icon--right">
                                            <arrow-down />
                                        </el-icon>
                                    </span>
                                    <template v-slot:dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
                                            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </div>
                        </div>
                        <div class="layout-navbars-tagsview">
                            <el-tabs v-model="activeName" type="card" class="layout-navbars-tagsview-card" @tab-click="tabClick" @tab-remove="removeTab">
                                <el-tab-pane :label="item.title" :name="item.name" v-for="item in openedTabs" :key="item.name" :closable="item.closable"></el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </el-header>
                <el-main>
                    <div class="layout-parent">
                        <router-view v-slot="{ Component }">
                            <KeepAlive :include="cachedTabs" :max="10">
                                <component :is="Component" />
                            </KeepAlive>
                        </router-view>
                    </div>
                </el-main>
            </el-scrollbar>
        </el-container>
        <div class="shade" v-if="isCollapse == false && windowWidth < 920" @click="isCollapse=true"></div>
    </el-container>
</template>

<script setup>
import { ref, watch, computed, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import MenuBar from './components/MenuBar';

const { appContext } = getCurrentInstance();

const store = useStore();

const router = useRouter();

const avatarUrl = ref('https://api.quhwa.cn/static/images/avatar.jpg');

const activeName = ref('');

const isCollapse = ref(false);

const isPwdVisible = ref(false);

const isFullscreen = ref(false);

const windowWidth = ref(document.documentElement.clientWidth);

const classObject = computed(() => {
    return {
        'side-shrink': isCollapse.value == true && windowWidth.value > 920,
        'side-spread-sm': isCollapse.value == false && windowWidth.value < 920
    }
});

const username = computed(() => store.state.admin.name);

const openedTabs = computed(() => store.state.tagsView.openedTabs);

const cachedTabs = computed(() => store.state.tagsView.cachedTabs);

const goHome = () => {
    router.push('/console');
};

const handleMenuClick = async (menuItem) => {
    router.push(menuItem.path);
};

const addTab = route => {
    let newTab = { title: route.meta.title, name: route.name, path: route.path, closable: true };
    openedTabs.value.push(newTab);
    cachedTabs.value.push(newTab.name);
    activeName.value = newTab.name;
    store.dispatch('setOpenedTabs', openedTabs.value);
    store.dispatch('setCachedTabs', cachedTabs.value);
};

const removeTab = (targetName) => {
    const tabs = openedTabs.value;
    let activeTab = activeName.value;
    if (activeTab === targetName) {
        tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
                const nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                    activeName.value = nextTab.name;
                    router.push({ path: nextTab.path });
                }
            }
        })
    }
    store.dispatch('setOpenedTabs', tabs.filter(tab => tab.name !== targetName));
    store.dispatch('setCachedTabs', cachedTabs.value.filter(name => name !== targetName));
};

const tabClick = (tab) => {
    let thisTab = openedTabs.value.find((item) => item.title == tab.props.label);
    router.push({ path: thisTab.path });
};

const handleCommand = (command) => {
    if (command == 'logout') {
        appContext.config.globalProperties.$confirm(
            '是否确认退出登录',
            '退出提醒',
            {
                type: 'warning',
            }
        ).then(() => {
            store.dispatch('logout');
        }).catch(() => {
            appContext.config.globalProperties.$message({ type: 'info', message: '已取消' });
        });
    } else if( command == 'changePwd') {
        isPwdVisible.value = true;
    }
};

watch(() => router.currentRoute.value,(toRoute) => {
    let exist = openedTabs.value.some(tab => tab.name === toRoute.name);
    if (!exist) addTab(toRoute);
    activeName.value = toRoute.name;
},{ immediate: true });
</script>
<style scoped>
/*侧边菜单栏*/
.layout-side{width: 200px!important;height: 100vh;z-index: 2001;position: fixed;background: #21252b;}
.layout-side .el-menu{border-right: none;}
.layout-side .el-menu i{margin-right: 5px;}
.layout-side .logo{text-align: center;}
.layout-side .logo span{display: inline-block;overflow: hidden;font-size: 24px;line-height: 55px;color: #fff;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;max-width: 196px;}

.side-shrink .layout-main{margin-left: 0;}
.side-shrink .layout-side{-webkit-transform: translate3d(-200px,0,0);}
.side-spread-sm .layout-side{transform: translateZ(0);-webkit-transform: translateZ(0);}

/*顶部导航栏*/
.layout-header{height: auto!important;padding: 0!important;box-shadow: 0 1px 4px rgb(0 21 41 / 8%);}
.layout-navbars-container{display: flex;flex-direction: column;width: 100%;height: 100%;}
.layout-navbars-breadcrumb{height: 60px;display: flex;align-items: center;background: #ffffff;border-bottom: 1px solid #f1f2f3;}
.layout-navbars-breadcrumb .left-panel{display: flex;align-items: center;flex: 1;}
.layout-navbars-breadcrumb .left-panel i{width: 40px;color: #606266;opacity: .8;cursor: pointer;}
.layout-navbars-breadcrumb .right-panel{display: flex;align-items: center;justify-content: flex-end;flex: 1;padding-right: 15px!important;}
.layout-navbars-breadcrumb .right-panel i{color: rgba(0,0,0,.65);cursor: pointer;}
.layout-navbars-breadcrumb .right-panel .action{display: flex;align-items: center;justify-content: flex-end;}
.layout-navbars-breadcrumb .right-panel .action .item{padding-right: 20px;}
.layout-navbars-breadcrumb .avatar-dropdown{height: 100%;display: flex;align-items: center;white-space: nowrap;}
.layout-navbars-breadcrumb .avatar-dropdown i{padding-right: 0;}
.layout-navbars-breadcrumb .user-avatar{margin-right: 5px!important;}
.layout-navbars-tagsview{background: #ffffff;padding: 0 20px;display: flex;align-items: center;justify-content: space-between;min-height: 50px;}
.layout-navbars-tagsview-card{height: 38px;}
.layout-navbars-tagsview :deep(.el-tabs__header){border: 0;}
.layout-navbars-tagsview :deep(.el-tabs__header) .el-tabs__nav {border: 0;}
.layout-navbars-tagsview :deep(.el-tabs__header) .el-tabs__item{border: 0;margin-top: 5.98px;height: 38px;line-height: 38px;padding: 0 30px !important;}
.layout-navbars-tagsview :deep(.el-tabs__header) .el-tabs__item.is-active{padding: 0 30px 0 30px !important;mask: url('@/assets/tabs_mask.png');mask-size: 100% 100%;background: #e8f4ff;}
.layout-navbars-tagsview :deep(.el-tabs__header) .el-tabs__item:hover{mask: url('@/assets/tabs_mask.png');mask-size: 100% 100%;background: #dee1e6;color: #515a6e;}
.layout-navbars-tagsview :deep(.el-tabs__header) .el-tabs__item.is-active:hover{background: #e8f4ff;color: #409eff;}
</style>