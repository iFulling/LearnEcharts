<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div>
        <img :src="headerSrc" alt="" />
      </div>
      <span class="logo">
        <!-- <img :src="logoSrc" alt="" /> -->
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img @click="handleChangeTheme" :src="themeSrc" class="qiehuan" />
        <span class="datetime">{{ dateTime }}</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div
          id="left-top"
          :class="[fullScreenStatus.trend ? 'fullscreen' : '']"
        >
          <trend ref="trend" />
          <div class="resize">
            <span
              @click="changeSize('trend')"
              :class="[
                'iconfont',
                fullScreenStatus.trend
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
        <div
          id="left-bottom"
          :class="[fullScreenStatus.seller ? 'fullscreen' : '']"
        >
          <seller ref="seller" />
          <div class="resize">
            <span
              @click="changeSize('seller')"
              :class="[
                'iconfont',
                fullScreenStatus.seller
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div
          id="middle-top"
          :class="[fullScreenStatus.theMap ? 'fullscreen' : '']"
        >
          <theMap ref="theMap" />
          <div class="resize">
            <span
              @click="changeSize('theMap')"
              :class="[
                'iconfont',
                fullScreenStatus.theMap
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
        <div
          id="middle-bottom"
          :class="[fullScreenStatus.rank ? 'fullscreen' : '']"
        >
          <rank ref="rank" />
          <div class="resize">
            <span
              @click="changeSize('rank')"
              :class="[
                'iconfont',
                fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <hot ref="hot" />
          <div class="resize">
            <span
              @click="changeSize('hot')"
              :class="[
                'iconfont',
                fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
        <div
          id="right-bottom"
          :class="[fullScreenStatus.stock ? 'fullscreen' : '']"
        >
          <stock ref="stock" />
          <div class="resize">
            <span
              @click="changeSize('stock')"
              :class="[
                'iconfont',
                fullScreenStatus.stock
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Trend from "@/components/Trend.vue";
import Seller from "@/components/Seller.vue";
import theMap from "@/components/Map.vue";
import Rank from "@/components/Rank.vue";
import Hot from "@/components/Hot.vue";
import Stock from "@/components/Stock.vue";
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils";
import dayjs from "dayjs";
export default {
  name: "ScreenPage",
  components: { Trend, Seller, theMap, Rank, Hot, Stock },
  data() {
    return {
      fullScreenStatus: {
        trend: false,
        seller: false,
        theMap: false,
        rank: false,
        hot: false,
        stock: false,
      },
      dateTime: null,
      timer: null,
    };
  },
  methods: {
    changeSize(chartName) {
      const targetValue = !this.fullScreenStatus[chartName];
      this.$socket.send({
        action: "fullScreen",
        socketType: "fullScreen",
        chartName,
        value: targetValue,
      });
    },
    receiveData(data) {
      const chartName = data.chartName;
      const targetValue = data.value;
      this.fullScreenStatus[chartName] = targetValue;
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter();
      });
    },
    handleChangeTheme() {
      this.$socket.send({
        action: "themeChange",
        socketType: "themeChange",
        chartName: "",
        value: "",
      });
    },
    receiveTheme() {
      this.$store.commit("changeTheme");
    },
  },
  computed: {
    ...mapState(["theme"]),
    logoSrc() {
      return "/static/img/" + getThemeValue(this.theme).logoSrc;
    },
    headerSrc() {
      return "/static/img/" + getThemeValue(this.theme).handerBorderSrc;
    },
    themeSrc() {
      return "/static/img/" + getThemeValue(this.theme).themeSrc;
    },
    containerStyle() {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor,
      };
    },
  },
  created() {
    this.$socket.registerCallback("fullScreen", this.receiveData);
    this.$socket.registerCallback("themeChange", this.receiveTheme);
  },
  mounted() {
   this.timer =  setInterval(() => {
      this.dateTime = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    }, 1000);
  },
  beforeDestroy() {
    this.$socket.unRegisterCallback("fullScreen");
    this.$socket.unRegisterCallback("themeChange");
  },
};
</script>

<style lang="less" scoped>
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

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
    top: 10%;
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
      position: relative;
      height: 53%;
    }
    #left-bottom {
      position: relative;
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
      position: relative;
      width: 100%;
      height: 56%;
    }
    #middle-bottom {
      position: relative;
      margin-top: 25px;
      width: 100%;
      height: 28%;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      position: relative;
      height: 46%;
    }
    #right-bottom {
      position: relative;
      height: 38%;
      margin-top: 25px;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
