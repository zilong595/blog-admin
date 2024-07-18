<template>
    <div class="pagination">
        <el-pagination
            :background="true"
            :page-size="pageSize"
            :page-sizes="pageSizes"
            :layout="layout"
            :total="total"
            :current-page="currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange" 
        />
    </div>
</template>

<script setup>
defineProps({
    total: {
        type: Number,
        default: 0
    },
    pageSize: {
        type: Number,
        default: 10
    },
    pageSizes: {
        type: Array,
        default: () => [10, 20, 30, 40, 50]
    },
    currentPage: {
        type: Number,
        default: 1
    },
    layout: {
        type: String,
        default: 'total, prev, pager, next'
    }
})

const emit = defineEmits(['size-change', 'current-change']);

const handleSizeChange = ((val) => {
    emit('size-change', val);
})

const handleCurrentChange = ((val) => {
    emit('current-change', val);
})
</script>

<style scoped>
.pagination{width: 100%;}
.el-pagination{justify-content: center;margin-top: 20px;}
</style>