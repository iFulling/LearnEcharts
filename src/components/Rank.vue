<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
export default {
  name: "Rank",
  data() {
    return {
      echartsInstance: null,
      allData: null,
    };
  },
  methods: {
    initChart() {
      this.echartsInstance = this.$echarts.init(this.$refs.rank_ref, "chalk");
      const initOption = {
        title: {
          text: "▎地区销售排行",
          left: 20,
          top: 20,
        },
        grid: {
          top: "40%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
          },
        ],
      };
      this.echartsInstance.setOption(initOption);
      this.screenAdapter();
    },
    async getData() {
      const { data } = await this.$axios.get("rank");
      this.allData = data;
      this.allData.sort((a, b) => {
        return b.value - a.value;
      });
      console.log(data);
      this.updataChart();
    },
    updataChart() {
      const provinceArr = this.allData.map((item) => {
        return item.name;
      });
      const valueArr = this.allData.map((item) => {
        return item.value;
      });
      const dataOption = {
        xAxis: {
          data: provinceArr,
        },
        series: [
          {
            data: valueArr,
          },
        ],
      };
      this.echartsInstance.setOption(dataOption);
    },
    screenAdapter() {
      const adapterOption = {};
      this.echartsInstance.setOption(adapterOption);
      this.echartsInstance.resize();
    },
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.screenAdapter);
  },
};
</script>

<style></style>
