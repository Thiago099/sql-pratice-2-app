<template>
        <div v-if="data != undefined">
            <label :class="color">{{ label }}:</label>
            <div class="form-group" v-for="(veb_parameters, index) in filteredData" :key="veb_parameters">
                <div class="input-group">
                    <input type="text" class="form-control" :class="color" v-if="show_text" v-model="veb_parameters.name"/>
                    <select v-model="veb_parameters[field]" class="form-select">  
                        <option :value="data.id" v-for="data in list_data" :key="data.id">{{data.name}}</option>
                    </select>
                    <button 
                        class="btn danger" 
                        type="button"
                        @click="removeParameter(veb_parameters)"
                    >
                        <i class="fa fa-trash"/>
                    </button>
                    <button 
                        class="btn success" 
                        type="button"
                        @click="addParameter(veb_parameters, index)"
                        v-if="index == filteredData.length - 1"
                    >
                        <i class="fa fa-plus"/>
                    </button>
                    
                </div>
            </div>
            
            <div v-if="data.filter(item=>item.delete != 1).length == 0" style="width:100%">
                <button 
                style=""
                    class="btn success" 
                    type="button"
                    @click="addParameter(veb, 0)"
                >
                    <i class="fa fa-plus"/>
                </button>
                
            </div>
        </div>
</template>
<script >
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'MultiSelect',
    props: [
        'data',
        'label',
        'color',
        'field',
        'list_data',
        'show_text',
        'name_source',
    ],
    data(){
        return{
            form_data: this.data
        }
    },
    methods:{
        addParameter(data, index){
            const object = {
            }
            object[this.field] = null
            if(this.form_data == undefined)
            {
                this.form_data.push(object)
            }
            else
            {
                this.form_data.splice(index+1, 0,object)
            }
            this.$emit('data', this.form_data)
        },
        removeParameter(data){
            data.delete = true
            this.$emit('data', this.form_data)
        },
    },
    computed:{
        filteredData(){
            return this.data.filter(item=>item.delete != true)
        }
    }
})
</script>
<style scoped>
.form-group{
    margin-bottom: 10px;
}
</style>