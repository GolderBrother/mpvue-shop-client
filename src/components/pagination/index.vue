<template>
    <div class="pagination">
        <ul class="pagination-box"> 
            <li :class="['pagination-item','pagination-prev',{'pagination-item-disabled':value === 1}]" @click="selectPage('prev',1)">上一页</li>
            <li :class="['pagination-item',{'pagination-item-active': curPage+1 === value}]" v-for="(curPage,index) in totalItems" :key="index" @click="selectPage('select',curPage)">{{ curPage }}</li>
            <li :class="['pagination-item', 'pagination-next',{'pagination-item-disabled':value === totalItems}]" @click="selectPage('next',1)">下一页</li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'pagination',
    props:{
        value:{
            type:Number,
            default:1
        },
        totalItems:{
            type:Number,
            default:0
        }
    },
    methods:{
        selectPage(type,page){
            this.$emit('change',type,page)
        }
    }
};
</script>
<style lang="scss" scoped>
    @import './index.scss';
</style>


