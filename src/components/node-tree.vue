<template>
    <div v-for="item in displayData" :key="item.id">
        <div 
            v-html="tabs" 
            style="display:inline"
        ></div> 
        <span class="hover" :class="{'success':filter_function=='abstraction_filter','info':filter_function == 'containing_filter'}" @click="$emit('action',item)">{{ item.name }}</span>
        <node-tree 
            :data="data" 
            :filter="item.id" 
            :distance="distance+1" 
            @action="$emit('action',$event)"
            :filter_function="filter_function"
        >
        </node-tree>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import nodeTree from './node-tree.vue'
export default defineComponent({
    components:{
        nodeTree
    },
    props:{
        data:{
            type:Array,
            default:()=>[]
        },
        filter:{
            type:Number,
            default:null
        },
        distance:{
            type:Number,
            default:0
        },
        filter_function:{
            type:String,
            default:null
        }
    },
    computed:{
        displayData(){
            return this.data.filter(this[this.filter_function])
        },
        tabs(){
            var result = ''
            for(let i = 0; i < this.distance; i++)
            {
                result += '&nbsp;&nbsp;&nbsp;&nbsp;'
            }
            return result;
        }
    },
    methods:{
        abstraction_filter(item){
            if(item.delete == true)
            {
                return false
            }
            if(this.filter == null)
            {
                return item.generalization.length == 0 
            }
            for(const i in item.generalization)
            {
                if(item.generalization[i].id_entity_generic == this.filter)
                {
                    return true
                }
            }
            return false
        },
        both_filter(item){
            if(this.filter == null)
            {
                return item.generalization.length == 0 && item.containing_read_only.length == 0
            }
            for(const i in item.generalization)
            {
                if(item.generalization[i].id_entity_generic == this.filter)
                {
                    return true
                }
            }
            for(const i in item.containing_read_only)
            {
                if(item.containing_read_only[i].id_entity_container == this.filter)
                {
                    return true
                }
            }
            return false
        },
        containing_filter(item){
            if(this.filter == null)
            {
                return item.containing_read_only.length == 0
            }
            for(const i in item.containing_read_only)
            {
                if(item.containing_read_only[i].id_entity_container == this.filter)
                {
                    return true
                }
            }
            return false
        }
    }
})
</script>
