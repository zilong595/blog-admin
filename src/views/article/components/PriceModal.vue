<template>
    <div class="wrap">
        <el-dialog :modelValue="visible" title="设置价格" :before-close="handleClose" :close-on-click-modal="false">
            <el-form :model="formData" :rules="rules" ref="formRef" label-width="80px">
                <el-form-item label="基准价" prop="basicPrice">
                    <el-input v-model="formData.basicPrice" placeholder="请输入基准价" v-on:input="checkPrice('basicPrice', formData.basicPrice)" autocomplete="off" />
                </el-form-item>
                <el-form-item label="指导价" prop="guidePrice">
                    <el-input v-model="formData.guidePrice" placeholder="请输入指导价" v-on:input="checkPrice('guidePrice', formData.guidePrice)" autocomplete="off" />
                </el-form-item>
                <el-form-item label="省代价" prop="provincePrice">
                    <el-input v-model="formData.provincePrice" placeholder="请输入省代价" v-on:input="checkPrice('provincePrice', formData.provincePrice)" autocomplete="off" />
                </el-form-item>
                <el-form-item label="市代价" prop="cityPrice">
                    <el-input v-model="formData.cityPrice" placeholder="请输入市代价" v-on:input="checkPrice('cityPrice', formData.cityPrice)" autocomplete="off" />
                </el-form-item>
                <el-form-item label="县代价" prop="countyPrice">
                    <el-input v-model="formData.countyPrice" placeholder="请输入县代价" v-on:input="checkPrice('countyPrice', formData.countyPrice)" autocomplete="off" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="handlerSubmit">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import { verifyNumberIntegerAndFloat } from '@/utils/validate';
import { getProductInfo, setPrice } from '@/api/product';

const { appContext } = getCurrentInstance();

const props = defineProps({
    visible: Boolean,
    itemId: String
});

const emit = defineEmits(['update:visible']);

const formRef = ref(null);

const formData = reactive({
    basicPrice: '',
    cityPrice: '',
    guidePrice: '',
    countyPrice: '',
    provincePrice: ''
});

const rules = reactive({
    basicPrice: [
        { required: true, message: '请输入基准价格', trigger: 'blur'}
    ],
    guidePrice: [
        { required: true, message: '请输入指导价格', trigger: 'blur'}
    ],
    provincePrice: [
        { required: true, message: '请输入省代基数', trigger: 'blur'}
    ],
    cityPrice: [
        { required: true, message: '请输入市代基数', trigger: 'blur'}
    ],
    countyPrice: [
        { required: true, message: '请输入县代基数', trigger: 'blur'}
    ]
});

const fetchProductInfo = () => {
    return new Promise((resolve) => {
        const id = props.itemId;
        getProductInfo(id).then((res) => {
            formData.cityPrice = res.data.city_price;
            formData.basicPrice = res.data.basic_price;
            formData.guidePrice = res.data.guide_price;
            formData.countyPrice = res.data.county_price;
            formData.provincePrice = res.data.province_price;
            resolve();
        })
    })
};

const checkPrice = (key, value) => {
    formData[key] = verifyNumberIntegerAndFloat(value);
};

const handleClose = () => {
    emit('update:visible', false);
};

const handlerSubmit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            const data = {
                id: props.itemId,
                basic_price: formData.basicPrice,
                guide_price: formData.guidePrice,
                city_price: formData.cityPrice,
                county_price: formData.countyPrice,
                province_price: formData.provincePrice
            };
            setPrice(data).then((res) => {
                emit('update:visible', false);
                appContext.config.globalProperties.$message({ type: 'success', message: res.msg });
            }).catch(() => {
            })
        } else {
            return false;
        }
    })
};

onMounted(() => {
    fetchProductInfo();
});
</script>

<style scoped>
.suffix{width: 24px;height: 24px;top: 0;right: 0;cursor: pointer;}
.iconfont{font-size: 18px;color: #22b6bd;}
.visible{background: url('~@/assets/image/ic_pwd_visible.png');}
.invisible{background: url('~@/assets/image/ic_pwd_invisible.png');}
</style>