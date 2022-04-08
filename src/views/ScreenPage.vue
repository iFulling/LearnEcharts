<template>
  <div class="screen-container">
    <header class="screen-header">
      <div>
        <img src="/static/img/header_border_dark.png" alt="" />
      </div>
      <span class="logo">
        <img src="/static/img/logo_dark.png" alt="" />
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img src="/static/img/qiehuan_dark.png" class="qiehuan" />
        <span class="datatime">2049-01-01 00:00:00</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top">
          <trend />
        </div>
        <div id="left-bottom">
          <seller />
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top">
          <Map />
        </div>
        <div id="middle-bottom">
          <rank />
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top">
          <hot />
        </div>
        <div id="right-bottom">
          <stock />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Trend from "@/components/Trend.vue";
import Seller from "@/components/Seller.vue";
import Map from "@/components/Map.vue";
import Rank from "@/components/Rank.vue";
import Hot from "@/components/Hot.vue";
import Stock from "@/components/Stock.vue";
export default {
  components: { Trend, Seller, Map, Rank, Hot, Stock },
  name: "ScreenPage",
};
</script>

<style lang="less" scoped>
.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
    img {
      width: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 35px;
      width: 128px;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
    }
  }
}
</style>
