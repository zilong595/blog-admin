<template>
    <div class="layout-container">
        <div class="layout-padding">
            <el-form :inline="true" :model="queryForm" class="vue-query-form" ref="test1">
                <el-form-item label="文章标题">
                    <el-input v-model="queryForm.title" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="Search" @click="fetchMessageList()">搜索</el-button>
                </el-form-item>
            </el-form>
            <div class="left-panel">
                <el-button type="danger" icon="Delete" :disabled="isDisableBtn" @click="batchDelete()">删除</el-button>
            </div>
            <el-table v-loading="loading" element-loading-text="Loading..." :data="messageList" border :header-cell-style="{ backgroundColor:'#f5f7fa' }" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column type="index" label="序号" width="100" align="center" >
                    <template #default="scope">
                        <span>{{(queryForm.page - 1) * queryForm.limit + scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="nickname" label="昵称" width="180" align="center" />
                <el-table-column prop="ip" label="IP" width="180" align="center" />
                <el-table-column prop="region" label="归属地" width="180" align="center" />
                <el-table-column prop="content" label="留言内容" min-width="300" align="center" show-overflow-tooltip />
                <el-table-column prop="model" label="是否已读" width="150" align="center">
                    <template #default="scope">
                        <el-tag v-if="scope.row.is_top == 1">是</el-tag>
                        <el-tag v-else type="success">否</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间" width="200" align="center" />
                <el-table-column fixed="right" label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-bind:total="total" v-bind:current-page="queryForm.page" v-bind:page-size="queryForm.limit" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, provide, onMounted, getCurrentInstance } from 'vue';
import { getMessageList, deleteMessage, deleteAllMessage } from '@/api/message';
import pagination from '@/components/PaginationView';

const { appContext } = getCurrentInstance();

const total = ref(0);

const loading = ref(false);

const messageList = ref([]);

const isDisableBtn = ref(true);

const multipleSelection = ref([]);

const queryForm = reactive({
    title: '',
    status: '',
    cateId: '',
    page: 1,
    limit: 20
})

const fetchMessageList = () => {
    return new Promise((resolve) => {
        loading.value = true;
        const params = {
            title: queryForm.title,
            cate_id: queryForm.cateId,
            page: queryForm.page,
            limit: queryForm.limit
        };
        getMessageList(params).then((res) => {
            total.value = res.data.count;
            messageList.value = res.data.list;
            loading.value = false;
            resolve();
        })
    })
};

const handleDelete = (row) => {
    appContext.config.globalProperties.$confirm(
        '确定要删除该留言吗',
        '提示',
        {
            type: 'warning',
        }
    ).then(() => {
        const id = row.id;
        deleteMessage(id).then((res) => {
            appContext.config.globalProperties.$message({ type: 'success', message: res.msg });
            fetchMessageList();
        })
    }).catch(() => {
        appContext.config.globalProperties.$message({ type: 'info', message: '已取消' });
    });
};

const batchDelete = () => {
    appContext.config.globalProperties.$confirm(
        '确定要删除选中的留言吗',
        '提示',
        {
            type: 'warning',
        }
    ).then(() => {
        let ids = multipleSelection.value.map((item) => item.id);
        deleteAllMessage(ids).then((res) => {
            appContext.config.globalProperties.$message({ type: 'success', message: res.msg });
            fetchMessageList();
        })
    }).catch(() => {
        appContext.config.globalProperties.$message({ type: 'info', message: '已取消' });
    });
};

const handleSelectionChange = (value) => {
    multipleSelection.value = value;
    isDisableBtn.value = value.length > 0 ? false : true;
};

const handleSizeChange = (size) => {
    queryForm.limit = size;
    fetchMessageList();
};

const handleCurrentChange = (page) => {
    queryForm.page = page;
    fetchMessageList();
};

provide('fetchMessageList', fetchMessageList);

onMounted(() => {
    fetchMessageList()
});
</script>

<style scoped>
.vue-query-form :deep(.el-form-item__content){width: 200px;}
.image-slot {display: flex;justify-content: center;align-items: center;width: 100%;height: 100%;background: var(--el-fill-color-light);color: var(--el-text-color-secondary);font-size: 30px;}
.image-slot .el-icon {font-size: 20px;}
</style>