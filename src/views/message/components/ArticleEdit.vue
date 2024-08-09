<template>
    <div class="wrap">
        <el-dialog :modelValue="visible" title="编辑文章" :before-close="handleClose" :close-on-click-modal="false">
            <div v-loading="loading">
                <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
                    <el-form-item label="文章标题" prop="title">
                        <el-input v-model="formData.title" />
                    </el-form-item>
                    <el-form-item label="所属分类" prop="cateId">
                        <el-select v-model="formData.cateId" >
                            <el-option v-for="(item, index) in categoryList" :key="index" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文章封面">
                        <div class="upload-box" @click="pickerVisible = true">
                            <el-image style="width: 100px; height: 100px" :src="imageSrc" v-if="imageSrc" />
                            <el-icon v-else>
                                <Plus />
                            </el-icon>
                        </div>
                    </el-form-item>
                    <el-form-item label="是否置顶">
                        <el-switch v-model="formData.isTop" :active-value="1" :inactive-value="0" />
                    </el-form-item>
                    <el-form-item label="文章内容" prop="content">
                        <wang-editor v-bind:valueHtml="formData.content" @update:valueHtml="formData.content = $event" />
                    </el-form-item>
                </el-form>
                <image-picker v-if="pickerVisible" v-bind:visible="pickerVisible" @update:visible="pickerVisible = $event" @selection-change="handleSelectionChange" />
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="handleSubmit">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, getCurrentInstance } from 'vue';
import { getCategoryList, getArticleDetail, updateArticle } from '@/api/article';
import WangEditor from '@/components/WangEditor';
import ImagePicker from '@/components/ImagePicker';

const { appContext } = getCurrentInstance();

const props = defineProps({
    visible: Boolean,
    articleId: Number
});

const emit = defineEmits(['update:visible']);

const fetchArticleList = inject('fetchArticleList');

const formRef = ref(null);

const loading = ref(true);

const imageSrc = ref('');

const categoryList = ref([]);

const pickerVisible = ref(false);

const formData = reactive({
    isTop: 0,
    title: '',
    cateId: '',
    imageId: '',
    content: '',
});

const rules = reactive({
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur'}
    ],
    cateId: [
        { required: true, message: '请选择所属分类', trigger: 'change'}
    ]
});

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

const fetchArticleInfo = () => {
    return new Promise((resolve) => {
        const id = props.articleId;
        getArticleDetail(id).then((res) => {
            imageSrc.value   = res.data.image;
            formData.title   = res.data.title;
            formData.isTop   = res.data.is_top;
            formData.cateId  = res.data.cate_id;
            formData.content = res.data.content;
            formData.imageId = res.data.image_id;
            resolve();
        })
    })
};

const handleSelectionChange = (event) => {
    const image = event.value[0];
    imageSrc.value = image.path;
    formData.imageId = image.id;
};

const handleClose = () => {
    emit('update:visible', false);
};

const handleSubmit = () => {
    const data = {
        id: props.articleId,
        title: formData.title,
        is_top: formData.isTop,
        cate_id: formData.cateId,
        content: formData.content,
        image_id: formData.imageId
    };

    formRef.value.validate((valid) => {
        if (valid) {
            updateArticle(data).then((res) => {
                emit('update:visible', false);
                appContext.config.globalProperties.$message({ type: 'success', message: res.msg });
                fetchArticleList();
            }).catch((err) => {
                console.log(err);
            })
        } else {
            return false;
        }
    })
    
};

onMounted(() => {
    try {
        Promise.all([
            fetchCategoryList(),
            fetchArticleInfo()
        ]);
        loading.value = false;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        loading.value = false;
    }
    
});
</script>

<style scoped>
.upload-box{width: 100px;height: 100px;background: #fff;border: 1px solid #dcdfe6;border-radius: 6px;cursor: pointer;position: relative;overflow: hidden;display: inline-flex;justify-content: center;align-items: center;}
.upload-box i{font-size: 28px;color: #8c939d;text-align: center;}
.btns{width: 100%;background: #fff;box-sizing: border-box;padding-top: 16px;padding-bottom: 16px;padding-left: 24px;}
</style>