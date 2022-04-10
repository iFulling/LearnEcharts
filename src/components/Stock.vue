<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Stock",
  data() {
    return {
      echartsInstance: null,
      allData: null,
      currentIndex: 0,
      timer: null,
    };
  },
  methods: {
    initChart() {
      this.echartsInstance = this.$echarts.init(
        this.$refs.stock_ref,
        this.theme
      );
      const initOption = {
        title: {
          text: "▎库存和销量分析",
          left: 20,
          top: 20,
        },
      };
      this.echartsInstance.setOption(initOption);
      this.echartsInstance.on("mouseover", () => {
        clearInterval(this.timer);
      });
      this.echartsInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    getData(realData) {
      this.allData = realData;
      this.updataChart();
      this.startInterval();
    },
    updataChart() {
      const centerArr = [
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["34%", "75%"],
        ["66%", "75%"],
      ];
      const colorArr = [
        ["#4FF778", "#0BA82C"],
        ["#E5DD45", "#E8B11C"],
        ["#E8821C", "#E55445"],
        ["#5052EE", "#AB6EE5"],
        ["#23E5E5", "#2E72BF"],
      ];
      const start = this.currentIndex * 5;
      const end = (this.currentIndex + 1) * 5;
      const showData = this.allData.slice(start, end);
      const seriesArr = showData.map((item, index) => {
        const color = colorArr[index];
        return {
          type: "pie",
          center: centerArr[index],
          hoverAnimation: false,
          labelLine: {
            show: false,
          },
          label: {
            position: "center",
            color: color[0],
          },
          data: [
            {
              name: item.name + "\n\n" + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: color[0] },
                  { offset: 1, color: color[1] },
                ]),
              },
            },
            { value: item.stock, itemStyle: { color: "#333843" } },
          ],
        };
      });
      const dataOption = {
        series: seriesArr,
      };
      this.echartsInstance.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.stock_ref.offsetWidth / 100) * 3.6;
      const innerRadius = titleFontSize * 2.8;
      const outterRadius = innerRadius * 1.125;
      const seriesArr = {
        type: "pie",
        radius: [outterRadius, innerRadius],
        label: {
          fontSize: titleFontSize * 0.8,
        },
      };
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series: [seriesArr, seriesArr, seriesArr, seriesArr, seriesArr],
      };
      this.echartsInstance.setOption(adapterOption);
      this.echartsInstance.resize();
    },
    startInterval() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setInterval(() => {
        this.currentIndex++;
        if (this.currentIndex > 1) this.currentIndex = 0;
        this.updataChart();
      }, 5000);
    },
  },
  computed: {
    ...mapState(["theme"]),
  },
  watch: {
    theme() {
      this.echartsInstance.dispose();
      this.initChart();
      this.screenAdapter();
      this.updataChart();
    },
  },
  created() {
    this.$socket.registerCallback("stockData", this.getData);
  },
  mounted() {
    this.initChart();
    this.$socket.send({
      action: "getData",
      socketType: "stockData",
      chartName: "stock",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.timer);
    this.$socket.unRegisterCallback("stockData");
  },
};
</script>

<style></style>
