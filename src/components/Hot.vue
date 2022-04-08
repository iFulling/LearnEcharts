<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click="toLeft" :style="comStyle"></span>
    <span class="iconfont arr-right" @click="toRight" :style="comStyle"></span>
    <span class="cat-name" :style="comStyle">{{ catName }}</span>
  </div>
</template>

<script>
export default {
  name: "Hot",
  data() {
    return {
      echartsInstance: null,
      allData: null,
      currentIndex: 0,
      titleFontSize: 0,
    };
  },
  computed: {
    catName() {
      return this.allData ? this.allData[this.currentIndex].name : "";
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
      };
    },
  },
  methods: {
    initChart() {
      this.echartsInstance = this.$echarts.init(this.$refs.hot_ref, "chalk");
      const initOption = {
        title: {
          text: "▎热销商品的占比",
          top: 20,
          left: 20,
        },
        tooltip: {
          show: true,
          formatter: (arg) => {
            const thirdCategory = arg.data.children;
            let total = 0;
            thirdCategory.forEach((item) => {
              total += item.value;
            });
            let retStr = "";
            thirdCategory.forEach((item) => {
              retStr += `${item.name}:${
                parseFloat((item.value / total) * 100).toFixed(2) + "%"
              }<br/>`;
            });
            return retStr;
          },
        },
        legend: {
          top: "15%",
          icon: "circle",
        },
        series: [
          {
            type: "pie",
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: true,
              },
              labelLine: {
                show: false,
              },
            },
          },
        ],
      };
      this.echartsInstance.setOption(initOption);
    },
    async getData() {
      const { data } = await this.$axios.get("hotproduct");
      this.allData = data;
      this.updataChart();
    },
    updataChart() {
      const seriesData = this.allData[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
            value: item.value,
            children: item.children,
          };
        }
      );
      const legendData = this.allData[this.currentIndex].children.map(
        (item) => {
          return item.name;
        }
      );
      const dataOption = {
        series: [
          {
            data: seriesData,
          },
        ],
        legend: {
          data: legendData,
        },
      };
      this.echartsInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ["50%", "60%"],
            label: {
              textStyle: {
                fontSize: this.titleFontSize / 2,
              },
            },
          },
        ],
      };
      this.echartsInstance.setOption(adapterOption);
      this.echartsInstance.resize();
    },
    toLeft() {
      this.currentIndex--;
      if (this.currentIndex < 0) this.currentIndex = this.allData.length - 1;
      this.updataChart();
    },
    toRight() {
      this.currentIndex++;
      if (this.currentIndex > this.allData.length - 1) this.currentIndex = 0;

      this.updataChart();
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

<style>
.arr-left::before {
  content: "\e6ef";
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.arr-right::before {
  content: "\e6ed";
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: white;
}
</style>
