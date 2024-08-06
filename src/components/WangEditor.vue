<template>
	<div style="border: 1px solid #dcdfe6;border-radius: 4px;overflow: auto;width: 100%;">
		<Toolbar
			style="border-bottom: 1px solid #dcdfe6"
			:editor="editorRef"
			:defaultConfig="toolbarConfig"
			:mode="mode"
		/>
		<Editor
			style="height: 300px; overflow-y: hidden;"
			:modelValue="valueHtml"
			:defaultConfig="editorConfig"
			:mode="mode"
			@onChange="handleChange"
			@onCreated="handleCreated"
		/>
    </div>
    <image-picker v-if="pickerVisible" v-bind:visible="pickerVisible" @update:visible="pickerVisible = $event" @selection-change="handleSelectionChange" />
</template>
<script setup>
import '@wangeditor/editor/dist/css/style.css';
import { ref, reactive, shallowRef, onBeforeUnmount } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import ImagePicker from '@/components/ImagePicker';

const props = defineProps({
    valueHtml: String
});

const emit = defineEmits(['update:valueHtml']);

const mode = ref('simple');

const pickerVisible = ref(false);

const editorRef = shallowRef();

const toolbarConfig = {};

const editorConfig = {
	placeholder: '请输入内容...',
	MENU_CONF: {}
};

editorConfig.MENU_CONF['uploadImage'] = {
	customBrowseAndUpload(insertFn) {
		pickerVisible.value = true;
	}
}

editorConfig.MENU_CONF['codeSelectLang'] = {
    // 代码语言
    codeLangs: [
        { text: 'Javascript', value: 'javascript' }
    ]
}


const handleSelectionChange = (res) => {
	res.value.forEach(item => {
		editorRef.value.dangerouslyInsertHtml(`<img src="${ item.path }">`);
	})
}

const handleChange = (editor) => {
	const html = editor.getHtml();
    emit('update:valueHtml', html);
    //console.log(editorRef.value.getMenuConfig('codeSelectLang').codeLangs);
}

const handleCreated = (editor) => {
	editorRef.value = editor 
}

onBeforeUnmount(() => {
	const editor = editorRef.value
	if (editor == null) return
	editor.destroy()
})
</script>