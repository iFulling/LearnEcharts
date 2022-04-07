<template>
  <div class="com-container">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Map",
  data() {
    return {
      echartsInstance: null,
      allDate: null,
    };
  },
  methods: {
    async initChart() {
      this.echartsInstance = this.$echarts.init(this.$refs.map_ref);
      const ret = await axios.get(
        "http://192.168.177.77:8088/static/map/china.json"
      );
      this.$echarts.registerMap('china',ret.data);
      const initOption = {
          geo:{
              type:"map",
              map:'china'
          }
      };
      this.echartsInstance.setOption(initOption);
    },
    async getData() {
      const { data } = await this.$axios.get("map");
      this.allDate = data;
      console.log(this.allDate);
      this.updateChart();
    },
    updateChart() {
      const dataOption = {};
      this.echartsInstance.setOption(dataOption);
    },
    screenAdapter() {
      const adopterOption = {};
      this.echartsInstance.setOption(adopterOption);
      this.echartsInstance.resize();
    },
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
};
</script>

<style></style>
