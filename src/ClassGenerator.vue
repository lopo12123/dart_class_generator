<script setup lang="ts">
import { ref } from "vue";
import { DartClassGenerator } from "./scripts";

const source = ref('')
const result = ref('')

const doGenerate = () => {
    if(source.value.trim() === '') return;

    const r = DartClassGenerator.parse('json', source.value)
    console.log(source.value, r)
    result.value = r
}

</script>

<template>
    <div class="class-generator">
        <textarea v-model="source" class="source" placeholder="source"></textarea>
        <div class="btn" @click="doGenerate">generate!</div>
        <textarea v-model="result" class="result" placeholder="result"></textarea>
    </div>
</template>

<style lang="scss" scoped>
.class-generator {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    .source, .result {
        width: calc(50% - 100px);
        height: calc(100% - 200px);
        border: solid 1px #ccc;
        border-radius: 8px;
        outline: none;
        padding: 16px;
        resize: none;
    }

    .btn {
        width: 120px;
        height: 32px;
        border: solid 1px #ccc;
        border-radius: 8px;
        color: #777;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
    }

}
</style>
