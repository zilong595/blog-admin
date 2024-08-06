<template>
    <div class="layout-container pd20">
        <el-form :model="formData" ref="form" label-width="100px">
            <el-row>
                <el-col :span="20">
                    <el-form-item label="文章标题">
                        <el-input v-model="formData.title" />
                    </el-form-item>
                    <el-form-item label="所属分类">
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
                    <el-form-item label="文章内容">
                        <wang-editor v-bind:valueHtml="formData.content" @update:valueHtml="formData.content = $event" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSubmit()">保存</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <image-picker v-if="pickerVisible" v-bind:visible="pickerVisible" @update:visible="pickerVisible = $event" @selection-change="handleSelectionChange" />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import { getCategoryList, createArticle } from '@/api/article';
import { useRouter } from 'vue-router';
import WangEditor from '@/components/WangEditor';
import ImagePicker from '@/components/ImagePicker';

const { appContext } = getCurrentInstance();

const router = useRouter();

const imageSrc = ref('');

const categoryList = ref([]);

const pickerVisible = ref(false);

const formData = reactive({
    title: '',
    cateId: '',
    imageId: '',
    content: '',
});

// 获取分类列表
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

// 图片选择处理
const handleSelectionChange = (event) => {
    const image = event.value[0];
    imageSrc.value = image.path;
    formData.imageId = image.id;
};

// 提交
const handleSubmit = () => {
    const data = {
        title: formData.title,
        cate_id: formData.cateId,
        content: formData.content,
        image_id: formData.imageId
    };

    createArticle(data).then((res) => {
        appContext.config.globalProperties.$message({ type: 'success', message: res.msg });
    }).catch((err) => {
        console.log(err);
    })
};

onMounted(() => {
    fetchCategoryList();
});
</script>

<style scoped>
.upload-box{width: 100px;height: 100px;background: #fbfdff;border: 1px dashed #c0ccda;border-radius: 6px;cursor: pointer;position: relative;overflow: hidden;display: inline-flex;justify-content: center;align-items: center;}
.upload-box i{font-size: 28px;color: #8c939d;text-align: center;}
.btns{width: 100%;background: #fff;box-sizing: border-box;padding-top: 16px;padding-bottom: 16px;padding-left: 24px;}
</style>