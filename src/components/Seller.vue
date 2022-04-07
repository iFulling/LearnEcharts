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
      this.echartsInstance.on("mouseover", () => {
        clearInterval(this.timer);
      });
      this.echartsInstance.on("mouseout", () => {
        this.startInterval();
      });
    },

    // 获取数据
    async getData() {
      const { data } = await this.$axios.get("seller");
      // 排序
      this.allData = data.sort((a, b) => {
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
      const option = {
        title: {
          text: "▍商家销售统计",
          textStyle: {
            fontSize: 66,
          },
          left: 40,
          top: 40,
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
          data: sellerNames,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z:0,
            lineStyle: {
              width: 66,
              color: "#2D3443",
            },
          },
        },
        series: [
          {
            type: "bar",
            data: sellerValue,
            barWidth: 66,
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "white",
              },
            },
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0],
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
      window.onresize = this.echartsInstance.resize;
      this.echartsInstance.setOption(option);
    },
    startInterval() {
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPage) this.currentPage = 1;
        this.updataChart();
      }, 3000);
    },
  },
  mounted() {
    this.initChart();
    this.getData();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="less" scoped></style>
