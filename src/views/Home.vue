<template>
  <div class="container" :key="reactivity">
    <div class="row">
    <div class="col-2">
    <node-tree 
      :data="entity" 
      @action="handleSelection"
      filter_function="abstraction_filter"
    >
    </node-tree>
    </div>
    <div class="col-2">
    <node-tree 
      :data="entity" 
      @action="handleSelection"
      filter_function="containing_filter"
    >
    </node-tree>
    </div>
      <div class="col-8">
        <div class="card">
          <div class="card-body">
            <!-- message if there is no selection -->
            <div v-if="!data">
              <p style="text-align:center">Select a entity</p>
            </div>
            <div v-else class="row">
              <input-container name= "Name">
                <input 
                type="text" 
                id="Name" 
                class="form-control"
                v-model="data.name"
                >
              </input-container>
              <!-- <input-container name= "Type" >
              <select id="Type" v-model="data.type" class="form-select">
                <option value="enum">enum</option>
                <option value="number">number</option>
                <option value="text">text</option>
              </select>
              </input-container> -->
              <multi-select 
                  class="col-md-6 col-sm-12"
                  :data="data.generalization" 
                  @data="data.generalization = $event"
                  label="Generalization"
                  color="green"
                  field="id_entity_generic"
                  :list_data="entity"
                  :name_source="entity_name"
              >
              </multi-select>
              <multi-select 
                  class="col-md-6 col-sm-12"
                  :data="data.containing" 
                  @data="data.containing = $event"
                  label="Container"
                  color="cyan"
                  field="id_entity_container"
                  :list_data="entity"
                  :name_source="entity_name"
              >
              </multi-select>
              
            </div>
          </div>
        </div>
        <button 
          class="btn btn-medium success" 
          @click="handleNew"
        >
          <i class="fa fa-plus spaced"></i>
          New
        </button>
        <button 
          class="btn btn-medium danger" 
          style="margin-left:10px"
          @click="handleDelete"
        >
          <i class="fa fa-trash spaced"></i>
          Delete
        </button>
        <button 
          class="btn btn-medium info" 
          style="float:right"
          @click="handleSave"
        >
          <i class="fa fa-file spaced"></i>
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import inputContainer from '@/components/input-container.vue';
import nodeTree from '@/components/node-tree.vue'
import { defineComponent } from 'vue';
import axios from '@/global/http'
import multiSelect from '@/components/multi-select.vue'

interface generalization {
  id: number,
  id_entity_generic: string
}
interface containing{
  id:number,
  id_entity_content:number
}
interface entity{
  id: number;
  name: string;
  generalization: generalization[]
  containing: containing[]
  delete:boolean

}
export default defineComponent({
  name: 'Home',
  components:{
    nodeTree,
    inputContainer,
    multiSelect
  },
 
  data(){
    return {
      data:null as any,
      entity:[] as entity[],
      entity_name:{} as Record<string, any>,
      reactivity:0,
    }
  },
  created(){
    this.load()
  },
  methods:{
    groupBy(x:any, f:any) {
          return x.reduce((a:any, b:any) => ((a[f(b)] ||= []).push(b), a), {})
      },
    handleSelection(item:any){
      this.data = item;
      this.reactivity++
    },
    handleSave()
    {
      for(const i in this.entity.filter(item=>item.name != ''))
      {
        if(this.entity[i].delete == true)
        {
          axios('entity/'+this.entity[i].id,'delete')
        }
        else
        {
          console.log(this.entity[i])
          axios('entity/','post',{data:this.entity[i]})
        }
      }
      this.load()
    },
    handleNew()
    {
      const entity = {
        id:0,
        name:'',
        generalization:[],
        containing:[],
        delete:false
      }
      this.entity.push(entity)
      this.data = entity
      this.reactivity++
    },
    handleDelete()
    {
      this.data.delete = true
    },
    async load(){
      this.entity = await new Promise(resolve => axios('entity','get', 
      {
        callback(result:entity[]){
          resolve(result);
        }
      }))
      for(const i in this.entity){
        this.entity_name[this.entity[i].id] = this.entity[i].name;
      }
      this.entity_name[0] = 'root';
    },
  },
  computed:{
    sorted_data(){
      const entity = JSON.parse(JSON.stringify(this.entity))
      return entity.sort((a:entity,b:entity)=>a.name.localeCompare(b.name))
    },
  }
}) 
</script>
<style scoped>
.button{
  cursor: pointer;
  float:right;
  font-size: 15pt;
  padding: 5px;
}
</style>