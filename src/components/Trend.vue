<template>
  <div class="com-container">
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
    };
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref);
      const initOption = {};
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const allData = await this.$axios.get("trend");
      console.log(allData);
      this.updataChart();
    },
    updataChart() {
      const dataOption = {};
      this.chartInstance.setOption(dataOption);
    },
    screenAdopter() {
      const adopterOption = {};
      this.chartInstance.setOption(adopterOption);
      this.chartInstance.resize();
    },
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdopter);
    this.screenAdopter()
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdopter);
  },
};
</script>
