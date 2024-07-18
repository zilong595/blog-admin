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
                <el-button icon="CopyDocument">添加</el-button>
            </div>
            <el-table v-loading="loading" element-loading-text="Loading..." :data="articleList" border :header-cell-style="{ backgroundColor:'#f5f7fa' }" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column type="index" label="序号" width="100" align="center" >
                    <template #default="scope">
                        <span>{{(queryForm.page - 1) * queryForm.limit + scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="文章标题" min-width="300" align="center" show-overflow-tooltip />
                <el-table-column  label="文章封面" width="150" align="center">
                    <template #default="scope">
                        <el-image style="width: 40px; height: 40px" :src="scope.row.image">
                            <template #error>
                                <div class="image-slot">
                                    <el-icon><Picture /></el-icon>
                                </div>
                            </template>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="cate_name" label="所属分类" width="180" align="center" />
                <el-table-column prop="model" label="是否置顶" min-width="200" align="center" show-overflow-tooltip />
                <el-table-column prop="create_time" label="创建时间" width="200" align="center" />
                <el-table-column fixed="right" label="操作" width="180" align="center">
                    <template #default="scope">
                        <router-link :to="{path: '/article/edit',query: { id: scope.row.id } }">
                            <el-button link type="primary" size="small">编辑</el-button>
                        </router-link>
                        <el-button link type="primary" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-bind:total="total" v-bind:current-page="queryForm.page" v-bind:page-size="queryForm.limit" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import { getArticleList, getCategoryList } from '@/api/article';
import pagination from '@/components/PaginationView';

const { appContext } = getCurrentInstance();

const total = ref(0);

const loading = ref(false);

const isDisableBtn = ref(true); // 是否禁用按钮

// 搜索条件
const queryForm = reactive({
    title: '',
    status: '',
    cateId: '',
    page: 1,
    limit: 20
})

const articleList = ref([]); // 文章列表

const categoryList = ref([]); // 分类列表

const multipleSelection = ref([]); //多选集合

// 获取分类列表
const fetchCategoryList = () => {
    return new Promise((resolve) => {
        const params = {
            status: 1,
        };
        getCategoryList(params).then((res) => {
            categoryList.value = res.data.list;
            resolve();
        })
    })
};

// 获取文章列表
const fetchArticleList = () => {
    return new Promise((resolve) => {
        loading.value = true;
        const params = {
            title: queryForm.title,
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

// 删除文章
const handleDelete = (row) => {
    console.log(row);
};

// 修改table选中状态
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

onMounted(() => {
    //fetchCategoryList();
    fetchArticleList();
});
</script>

<style scoped>
.vue-query-form :deep(.el-form-item__content){width: 200px;}
.image-slot {display: flex;justify-content: center;align-items: center;width: 100%;height: 100%;background: var(--el-fill-color-light);color: var(--el-text-color-secondary);font-size: 30px;}
.image-slot .el-icon {font-size: 20px;}
</style>