<template>
    <div>
        <div class="fade-back"></div>
      <div class="popup-box">
        <div class="close-button">×</div>
        <h5>Title</h5></div>
    </div>
</template>
<style scoped>
.popup-box{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--medium);
  border: 1px solid var(--bright);
  width: 800px;
  height: 500px;
  border-radius: 5px;
  z-index: 101;
  padding: 10px;
}
.close-button{
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  vertical-align: middle;
  text-align: center;
  cursor: pointer;
}
.fade-back{
  background-color: rgba(0,0,0,0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}

</style>