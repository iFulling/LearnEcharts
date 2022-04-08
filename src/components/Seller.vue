<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
export default {
  name: "Seller",
  data() {
    return {
      echartsInstance: null,
      allData: null,
      currentPage: 1,
      totalPage: 0,
      timer: null,
    };
  },
  methods: {
    // 初始化echartsInstance对象
    initChart() {
      this.echartsInstance = this.$echarts.init(this.$refs.seller_ref, "chalk");
      const initOption = {
        title: {
          text: "▍商家销售统计",
          left: 20,
          top: 20,
        },
        grid: {
          top: "20%",
          left: "6%",
          right: "6%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              color: "#2D3443",
            },
          },
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "white",
              },
            },
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#5052EE",
                },
                {
                  offset: 1,
                  color: "#AB6EE5",
                },
              ]),
            },
          },
        ],
      };
      this.echartsInstance.setOption(initOption);
      this.echartsInstance.on("mouseover", () => {
        clearInterval(this.timer);
      });
      this.echartsInstance.on("mouseout", () => {
        this.startInterval();
      });
    },

    // 获取数据
     getData(realData) {
      // 排序
      this.allData = realData.sort((a, b) => {
        return a.value - b.value;
      });
      // 每五个元素显示一页
      let dataLen = this.allData.length;
      this.totalPage = dataLen % 5 === 0 ? dataLen / 5 : Math.ceil(dataLen / 5);
      this.updataChart();
      this.startInterval();
    },

    // 更新图标
    updataChart() {
      // 只展示一部分
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.allData.slice(start, end);
      const sellerNames = showData.map((item) => {
        return item.name;
      });
      const sellerValue = showData.map((item) => {
        return item.value;
      });
      const dataOption = {
        yAxis: {
          data: sellerNames,
        },
        series: [
          {
            data: sellerValue,
          },
        ],
      };
      this.echartsInstance.setOption(dataOption);
    },

    // 自动切换
    startInterval() {
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPage) this.currentPage = 1;
        this.updataChart();
      }, 3000);
    },

    // 屏幕适配
    screenAdapter() {
      const titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            },
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
          },
        ],
      };
      this.echartsInstance.setOption(adapterOption);
      // 手动调用产生效果
      this.echartsInstance.resize();
    },
  },
  created(){
    this.$socket.registerCallback("sellerData", this.getData);
  },
  mounted() {
    this.initChart();
    this.$socket.send({
      action: "getData",
      socketType: "sellerData",
      chartName: "seller",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallback("sellerData");
  },
};
</script>

<style lang="less" scoped></style>
