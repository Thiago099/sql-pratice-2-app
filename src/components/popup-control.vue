<template>
    <div class="popup-message-container" ref="messageContainer">
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods:{
    addMessage(message:string, color:string){
      const element = document.createElement('div')
      const container = this.$refs.messageContainer as HTMLElement
      element.classList.add('popup-message')
      element.classList.add(color)
      element.innerHTML = message
      const end = () => {
          element.classList.add('popup-fade-out')
      }
      element.addEventListener('click', end)
      container.appendChild(element)
      element.ontransitionend = () => {
        element.remove()
      };
      setTimeout(end, 1000)
    }
  }
})
</script>

<style>
.popup-message-container{
  position: fixed;
  top: 0px;
  z-index: 1000;
  --width: 500px;
  width: 500px;
  left: calc(50% - var(--width)/2);
}
.popup-message{
  background-color: var(--color-background);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 1.2em;
  text-align: center;
  position: relative;
  top: calc(50% - 20px);
  margin-top: 10px;
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}
.popup-fade-out{
  opacity: 0;
  transform: translate(0, -100px);
}
</style>