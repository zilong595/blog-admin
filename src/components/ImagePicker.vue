<template>
    <div class="wrap">
        <el-dialog :modelValue="visible" width="975px" title="选择图片" :before-close="handleClose" :close-on-click-modal="false" :lock-scroll="false">
            <el-row>
                <el-col>
                    <div class="conter">
                        <el-row class="conter-handle">
                            <div class="handle-btn">
                                <el-upload :auto-upload="false" :show-file-list="false" :on-change="uploadFile" class="upload-btn">
                                    <el-button type="primary">上传图片</el-button>
                                </el-upload>
                                <el-button type="danger" :disabled="selectedImageIds.length <= 0" @click="handleDeleteImage()">删除图片</el-button>
                            </div>
                            <div class="handle-input">
                                <el-input v-model="queryForm.name" placeholder="请输入图片名字">
                                    <template #append>
                                        <el-button icon="Search" @click="fetchImageList()"/>
                                    </template>
                                </el-input>
                            </div>
                        </el-row>
                        <el-row class="conter-body">
                            <el-scrollbar>
                                <div class="imgage-list">
                                     <div class="item" v-for="(item, index) in imageList" :key="index" @click="selectImage(item, index)">
                                        <div class="image-wrap">
                                            <el-image style="width: 100px; height: 100px" :src="item.path"/>
                                            <div class="imgage-selected" v-if="item.isSelect == true">
                                                <el-icon color="#fff">
                                                    <Check />
                                                </el-icon>
                                            </div>
                                        </div>
                                        <div class="imgage-name">{{ item.name }}</div>
                                    </div>
                                </div>
                            </el-scrollbar>
                        </el-row>
                        <pagination v-bind:total="total" v-bind:current-page="queryForm.page" v-bind:page-size="queryForm.limit" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" />
                    </div>
                </el-col>
            </el-row>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="handleSubmit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import { getImageList, uploadImage, deleteImage } from '@/api/image';
import pagination from '@/components/PaginationView';

defineProps({
    visible: Boolean
});

const emit = defineEmits(['update:visible', 'selection-change']);

const { appContext } = getCurrentInstance();

const total = ref(0);

const imageList = ref([]);

const selectedImages = ref([]);

const selectedImageIds = ref([]);

const queryForm = reactive({
    name: '',
    page: 1,
    limit: 16
});

const fetchImageList = () => {
    const params = queryForm;
    getImageList(params).then((res) => {
        total.value = res.data.count;
        imageList.value = res.data.list;
    })
};

const uploadFile = (file) => {
    var fd = new FormData();
    fd.append('file', file.raw);

    uploadImage(fd).then((res) => {
        appContext.config.globalProperties.$message({ type: 'success',message: res.msg });
        fetchImageList();
    })
};

const handleDeleteImage = () => {
    appContext.config.globalProperties.$confirm(
        '确定要删除选中的图片吗',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        const ids = selectedImageIds.value.join(",");

        deleteImage(ids).then((res) => {
            appContext.config.globalProperties.$message({ type: 'success',message: res.msg });
            selectedImages.value = [];
            selectedImageIds.value = [];
            fetchImageList();
        })

    }).catch(() => {
    });
};

const selectImage = (item, index) => {
    imageList.value[index].isSelect = item.isSelect == undefined ? true : !item.isSelect;
    selectedImages.value = imageList.value.filter(image => image.isSelect);
    selectedImageIds.value = selectedImages.value.map(image => image.id);
};

const handleSizeChange = (size) => {
    queryForm.limit = size;
    fetchImageList();
};

const handleCurrentChange = (page) => {
    queryForm.page = page;
    fetchImageList();
};

const handleClose = () => {
    emit('update:visible', false);
};

const handleSubmit = () => {
    if (selectedImages.value.length <= 0) {
        appContext.config.globalProperties.$message({ type: 'error',message: '请选择图片' });
        return;
    }
    emit('update:visible', false);
    emit('selection-change', selectedImages);
};

onMounted(() => {
    fetchImageList();
});
</script>

<style scoped>
.conter{flex: 1;display: flex;flex-direction: column;height: 100%;}
.conter .conter-handle{display: flex;padding-bottom: 10px;justify-content: space-between;}
.conter .conter-handle .handle-btn{display: flex;}
.conter .conter-handle .handle-btn .upload-btn{margin-right: 10px;}
.conter .conter-body{flex: 1;flex-direction: column;overflow: hidden;}
.conter .imgage-list{display: grid;justify-content: space-between;grid-template-columns: repeat(auto-fill, 110px);}
.conter .imgage-list .item{cursor: pointer;margin-bottom: 10px;}
.conter .imgage-list .item .image-wrap{position: relative;height: 100px;width: 100px;background-color: hsl(0, 0%, 90%);}
.conter .imgage-list .imgage-name{width: 100px;margin-top: 10px;text-align: center;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
.imgage-selected{position: absolute;top: 0;left: 0;width: 100%;height: 100%;border-radius: 4px;background-color: rgba(0,0,0,.5);box-sizing: border-box;}
.imgage-selected i{position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);font-size: 22px;font-weight: 700;z-index: 100;}
</style>