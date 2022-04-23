<template>
    <div>
        <i class="fa fa-minus-square hover warning icon" @click="collapse_all()"></i>
        <i class="fa fa-plus-square hover warning icon" @click="expand_all()"></i>
        <div v-for="{item, depth,children, parent, tid} in displayData" :key="item.id">
            <div 
                v-html="tabs(depth)" 
                style="display:inline"
                v-if="is_displayed(parent)"
            ></div> 
            <i 
            v-if="is_displayed(parent)"
            class="fa warning hover" 
            :class="{'fa-caret-down':displayed[tid],'fa-caret-right':!displayed[tid],'invisible':children == 0 || children == undefined}" 
            style="margin-right:5px"
            @click="displayed[tid] = !displayed[tid]"
            ></i>
            <span 
            class="hover" 
            v-if="is_displayed(parent)"
            :class="{'success':filter_function=='abstraction_filter','info':filter_function == 'containing_filter'}" 
            @click="$emit('action',item)" 
            :draggable="item.id != 0"
            @dragstart="function drag(ev){
                ev.dataTransfer.setData('text', item.id)
            }"
            >{{ item.name }}</span>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { displayed_generalization, displayed_containing } from '@/global/displayed_persistent.ts'
// import nodeTree from './node-tree.vue'
export default defineComponent({
    components:{
        // nodeTree
    },
    data(){
        return{
            displayed:this.filter_function == 'abstraction_filter' ? displayed_generalization : displayed_containing,
        }
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
        },
        empety:{
            type:Boolean,
            default:false
        }
    },
    computed:{
        displayData(){
            return this.get_tree()
        },
        
    },
    methods:{
        tabs(depth){
            var result = ''
            for(let i = 0; i < depth; i++)
            {
                result += '&nbsp;&nbsp;&nbsp;&nbsp;'
            }
            return result;
        },
        get_tree(depth = 0, filter = null,tid = {id:null}){
            var result = []
            
            const ptid = tid.id
            for(const i in this.data)
            {
                if(this[this.filter_function](this.data[i],filter))
                {
                    const ctid = ++tid.id
                    const children = this.get_tree(depth+1, this.data[i].id,tid)
                    if(this.displayed[ctid] == undefined)
                    {
                        this.displayed[ctid] = false
                    }
                    if(depth != 0 || children.length != 0)
                    {
                        result.push({depth,item:this.data[i],children:children.length,parent:ptid,tid:ctid})
                        result = result.concat(children)   
                    }
                }
            }
            // show illegal nodes that would not otherwise aper
            if(depth == 0)
            {
                for(const i in this.data)
                {
                    if
                    (
                          !this.data[i].delete &&
                           this.data[i].generalization.filter(item => !item.delete && item.id_entity_generic != null).length == 0 
                        && this.data[i].containing_read_only.filter(item => !item.delete && item.id_entity_container != null).length == 0
                        && this.data.filter(item => 
                              !item.delete 
                            && item.generalization.filter(item => 
                                      !item.delete 
                                    && item.id_entity_generic == this.data[i].id
                                    ).length != 0
                                ).length == 0
                        && this.data.filter(item => 
                                  !item.delete 
                                && item.containing.filter(item => 
                                      !item.delete 
                                    && item.id_entity_container == this.data[i].id
                                    ).length != 0
                                ).length == 0
                    )
                    {
                        console.log(this.data[i])
                        result.push({depth,item:this.data[i],tid:tid++})
                    }
                }
            }
            return result;
        },
        abstraction_filter(item, filter)
        {
            if(item.delete == true)
            {
                return false
            }
            if(filter == null)
            {
                return item.generalization?.filter(item => item.id_entity_generic != null && !item.delete)?.length == 0 
            }
            for(const i in item.generalization)
            {
                if(item.generalization[i].id_entity_generic == filter && !item.generalization[i].delete)
                {
                    return true
                }
            }
            return false
        },
        containing_filter(item, filter)
        {
            if(item.delete == true)
            {
                return false
            }
            if(filter == null)
            {
                return item.containing_read_only?.filter(item => item.id_entity_container != null && !item.delete)?.length == 0
            }
            for(const i in item.containing_read_only)
            {
                if(item.containing_read_only[i].id_entity_container == filter && !item.containing_read_only[i].delete)
                {
                    return true
                }
            }
            return false
        },
        is_displayed(parent)
        {
            const parent_obj = this.displayData.find(item => item.tid == parent)
            if(parent == null)
            {
                return true
            }
            const stack_result = this.is_displayed(parent_obj.parent)
            if(stack_result == true)
            {
                return this.displayed[parent]
            }
            return false
        },
        collapse_all()
        {
            for(const i in this.displayed)
            {
                this.displayed[i] = false
            }
        },
        expand_all()
        {
            for(const i in this.displayed)
            {
                this.displayed[i] = true
            }
        }
    }
})
</script>
<style scoped>
.invisible{
    color:transparent
}
.invisible::selection{
    color:transparent;
}
::selection{
    background:transparent;
}
.fa-caret-right{
    margin-left: 3.45px;
    margin-right: 3.45px;
}
.fa{
    transition: none;
}
.icon{
    margin:3px
}
</style>