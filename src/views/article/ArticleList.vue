<template>
    <div class="layout-container">
        <div class="layout-padding">
            <el-form :inline="true" :model="queryForm" class="vue-query-form" ref="test1">
                <el-form-item label="文章标题">
                    <el-input v-model="queryForm.title" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="文章分类">
                    <el-select v-model="queryForm.cateId" placeholder="请选择" clearable>
                        <el-option :label="item.name" :value="item.id" v-for="(item, key) in categoryList" :key="key" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="Search" @click="fetchArticleList()">搜索</el-button>
                </el-form-item>
            </el-form>
            <div class="left-panel">
                <el-button type="primary" icon="Plus" @click="isAddVisible=true">添加</el-button>
            </div>
            <el-table v-loading="loading" element-loading-text="Loading..." :data="articleList" border :header-cell-style="{ backgroundColor:'#f5f7fa' }" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column type="index" label="序号" width="100" align="center" >
                    <template #default="scope">
                        <span>{{(queryForm.page - 1) * queryForm.limit + scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="文章标题" min-width="300" align="center" show-overflow-tooltip />
                <el-table-column prop="cate_name" label="所属分类" width="180" align="center" />
                <el-table-column prop="model" label="是否置顶" width="150" align="center">
                    <template #default="scope">
                        <el-tag v-if="scope.row.is_top == 1">是</el-tag>
                        <el-tag v-else type="success">否</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间" width="200" align="center" />
                <el-table-column prop="update_time" label="修改时间" width="200" align="center" />
                <el-table-column fixed="right" label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button link type="primary" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-bind:total="total" v-bind:current-page="queryForm.page" v-bind:page-size="queryForm.limit" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" />
            <ArticleAdd v-if="isAddVisible" v-bind:visible="isAddVisible" @update:visible="isAddVisible = $event" />
            <ArticleEdit v-if="isEditVisible" v-bind:articleId="articleId" v-bind:visible="isEditVisible" @update:visible="isEditVisible = $event" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, provide, onMounted, getCurrentInstance } from 'vue';
import { getCategoryList, getArticleList, deleteArticle } from '@/api/article';
import pagination from '@/components/PaginationView';
import ArticleAdd from './components/ArticleAdd';
import ArticleEdit from './components/ArticleEdit';

const { appContext } = getCurrentInstance();

const total = ref(0);

const loading = ref(false);

const isDisableBtn = ref(true);

const isAddVisible = ref(false);

const isEditVisible = ref(false);

const articleId = ref(null);

const articleList = ref([]);

const categoryList = ref([]);

const multipleSelection = ref([]);

const queryForm = reactive({
    title: '',
    status: '',
    cateId: '',
    page: 1,
    limit: 20
})

const fetchCategoryList = () => {
    return new Promise((resolve) => {
        const params = {
            status: 1,
        };
        getCategoryList(params).then((res) => {
            categoryList.value = res.data;
            resolve();
        })
    })
};

const fetchArticleList = () => {
    return new Promise((resolve) => {
        loading.value = true;
        const params = {
            title: queryForm.title,
            cate_id: queryForm.cateId,
            page: queryForm.page,
            limit: queryForm.limit
        };
        getArticleList(params).then((res) => {
            total.value = res.data.count;
            articleList.value = res.data.list;
            loading.value = false;
            resolve();
        })
    })
};

const handleEdit = (row) => {
    articleId.value = row.id;
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
        deleteArticle(id).then((res) => {
            appContext.config.globalProperties.$message({ type: 'success', message: res.msg });
            fetchArticleList();
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
    fetchArticleList();
};

const handleCurrentChange = (page) => {
    queryForm.page = page;
    fetchArticleList();
};

provide('fetchArticleList', fetchArticleList);

onMounted(() => {
    fetchCategoryList(),
    fetchArticleList()
});
</script>

<style scoped>
.vue-query-form :deep(.el-form-item__content){width: 200px;}
.image-slot {display: flex;justify-content: center;align-items: center;width: 100%;height: 100%;background: var(--el-fill-color-light);color: var(--el-text-color-secondary);font-size: 30px;}
.image-slot .el-icon {font-size: 20px;}
</style>