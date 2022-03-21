<template>
  <div class="container">
    <div class="row">
    <div class="col-2">
    <node-tree 
      :data="entity" 
      @action="data = $event"
      filter_function="abstraction_filter"
    >
    </node-tree>
    </div>
      <div class="col-10">
        <div class="card">
          <div class="card-body">
            <input-container name= "Name">
              <input 
              type="text" 
              id="Name" 
              class="form-control"
              v-model="data.name"
              >
            </input-container>
            <multi-select 
                :data="data.generalization" 
                @data="data.generalization = $event.target.value"
                label="Generalization"
                color="green"
                field="id_entity_generic"
                :list_data="entity"
                :name_source="entity_name"
            >
            </multi-select>
            <multi-select 
                :data="data.containing" 
                @data="data.containing = $event.target.value"
                label="Containing"
                color="cyan"
                field="id_entity_content"
                :list_data="entity"
                :name_source="entity_name"
            >
            </multi-select>
          </div>
        </div>
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
      data:{name:""},
      entity:[] as entity[],
      entity_name:{} as Record<string, any>,
      grouped_entities:{} as Record<string, any>,
    }
  },
  async created(){
    this.entity = await new Promise(resolve => axios('entity','get', 
    {
      callback(result:any){
        resolve(result);
      }
    }))
    for(const i in this.entity){
      this.entity_name[this.entity[i].id] = this.entity[i].name;
    }
    this.entity_name[0] = 'root';
    this.grouped_entities = this.groupBy(this.entity, (item:any) => (item.generalization[0] || {id_entity_generic:'0'}).id_entity_generic);
  },
  methods:{
    groupBy (x:any, f:any) {
          return x.reduce((a:any, b:any) => ((a[f(b)] ||= []).push(b), a), {})
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