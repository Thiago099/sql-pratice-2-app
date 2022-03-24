<template>

    <div v-for="{item, depth} in displayData" :key="item.id">
        <div 
            v-html="tabs(depth)" 
            style="display:inline"
        ></div> 
        <span 
        class="hover" 
        :class="{'success':filter_function=='abstraction_filter','info':filter_function == 'containing_filter'}" 
        @click="$emit('action',item)">{{ item.name }}</span>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
// import nodeTree from './node-tree.vue'
export default defineComponent({
    components:{
        // nodeTree
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
        get_tree(depth = 0, filter = null){
            var result = []
            for(const i in this.data)
            {
                if(this[this.filter_function](this.data[i],filter))
                {
                    const children = this.get_tree(depth+1, this.data[i].id)
                    if(depth != 0 || children.length != 0)
                    {
                        result.push({depth,item:this.data[i]})
                        result = result.concat(children)   
                    }
                }
            }
            // show illegal nodes that whuld not otherwise apear
            if(depth == 0)
            {
                for(const i in this.data)
                {
                    if
                    (
                           this.data[i].generalization.filter(item => !item.delete && item.id_entity_generic != null).length == 0 
                        && this.data[i].containing.filter(item => !item.delete && item.id_entity_container != null).length == 0
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
                        result.push({depth,item:this.data[i]})
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
                return item.containing?.filter(item => item.id_entity_container != null && !item.delete)?.length == 0
            }
            for(const i in item.containing)
            {
                if(item.containing[i].id_entity_container == filter && !item.containing[i].delete)
                {
                    return true
                }
            }
            return false
        }
    }
})
</script>
<style scoped>
.invisible{
    color:transparent
}
</style>