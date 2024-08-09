<template>
    <div class="layout-container">
        <div class="layout-padding">
            <el-form :inline="true" :model="queryForm" class="vue-query-form" ref="test1">
                <el-form-item label="文章标题">
                    <el-input v-model="queryForm.title" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="Search" @click="fetchColumnList()">搜索</el-button>
                </el-form-item>
            </el-form>
            <div class="left-panel">
                <el-button type="primary" icon="Plus" @click="isAddVisible=true">添加</el-button>
            </div>
            <el-table v-loading="loading" element-loading-text="Loading..." :data="ColumnList" border :header-cell-style="{ backgroundColor:'#f5f7fa' }" row-key="id" default-expand-all>
                <el-table-column prop="name" label="名称" width="180" />
                <el-table-column prop="sort" label="排序" width="180" align="center" />
                <el-table-column prop="url" label="路径" width="150" align="center" />
                <el-table-column prop="status" label="是否隐藏" width="150" align="center">
                    <template #default="scope">
                        <el-tag v-if="scope.row.is_top == 1">显示</el-tag>
                        <el-tag v-else type="success">隐藏</el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button link type="primary" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <ColumnAdd v-if="isAddVisible" v-bind:visible="isAddVisible" @update:visible="isAddVisible = $event" />
            <ColumnEdit v-if="isEditVisible" v-bind:ColumnId="ColumnId" v-bind:visible="isEditVisible" @update:visible="isEditVisible = $event" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, provide, onMounted, getCurrentInstance } from 'vue';
import { getColumnList, deleteColumn } from '@/api/column';
import ColumnAdd from './components/ColumnAdd';
import ColumnEdit from './components/ColumnEdit';

const { appContext } = getCurrentInstance();

const total = ref(0);

const loading = ref(false);

const isAddVisible = ref(false);

const isEditVisible = ref(false);

const ColumnId = ref(null);

const ColumnList = ref([]);

const queryForm = reactive({
    title: '',
    status: '',
    cateId: '',
})

const fetchColumnList = () => {
    return new Promise((resolve) => {
        loading.value = true;
        const params = {
            title: queryForm.title,
            cate_id: queryForm.cateId,
        };
        getColumnList(params).then((res) => {
            ColumnList.value = res.data;
            loading.value = false;
            resolve();
        })
    })
};

const handleEdit = (row) => {
    ColumnId.value = row.id;
    isEditVisible.value = true;
};

const handleDelete = (row) => {
    appContext.config.globalProperties.$confirm(
        '确定要删除该文章吗',
        '提示',
        {
            type: 'warning',
        }
    ).then(() => {
        const id = row.id;
        deleteColumn(id).then((res) => {
            appContext.config.globalProperties.$message({ type: 'success', message: res.msg });
            fetchColumnList();
        })
    }).catch(() => {
        appContext.config.globalProperties.$message({ type: 'info', message: '已取消' });
    });
};

provide('fetchColumnList', fetchColumnList);

onMounted(() => {
    fetchColumnList()
});
</script>

<style scoped>
.vue-query-form :deep(.el-form-item__content){width: 200px;}
.image-slot {display: flex;justify-content: center;align-items: center;width: 100%;height: 100%;background: var(--el-fill-color-light);color: var(--el-text-color-secondary);font-size: 30px;}
.image-slot .el-icon {font-size: 20px;}
</style>