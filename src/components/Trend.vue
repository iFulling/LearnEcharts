<template>
  <div class="com-container">
    <div class="title">
      <div
        :style="comStyle"
        class="iconfont title-icon"
        @click="showChoice = !showChoice"
      >
        {{ "▍" + showTitle }} &#xe6eb;
        <div class="select-con" v-show="showChoice" :style="marginStyle">
          <div
            class="select-item"
            v-for="item in selectTypes"
            :key="item.key"
            @click="handleSelect(item.key)"
          >
            {{ item.text }}
          </div>
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      showChoice: false,
      choiceType: "map",
      choiceType: "map",
      titleFontSize: 0,
    };
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, "chalk");
      const initOption = {
        grid: {
          left: "3%",
          top: "35%",
          left: "4%",
          bottom: "1%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          left: 20,
          top: "15%",
          icon: "circle",
        },
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const { data } = await this.$axios.get("trend");
      this.allData = data;
      console.log(data);
      this.updataChart();
    },
    updataChart() {
      const startColor = [
        "rgba(11,168,44,0.5)",
        "rgba(44,110,225,0.5)",
        "rgba(22,242,217,0.5)",
        "rgba(254,33,30,0.5)",
        "rgba(250,105,0,0.5)",
      ];
      const endColor = [
        "rgba(11,168,44,0)",
        "rgba(44,110,225,0)",
        "rgba(22,242,217,0)",
        "rgba(254,33,30,0)",
        "rgba(250,105,0,0)",
      ];
      // 时间 类目轴 x轴
      const timeArr = this.allData.common.month;
      // series下的数据 y轴
      const valueArr = this.allData[this.choiceType].data;
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          data: item.data,
          stack: this.choiceType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: startColor[index],
              },
              {
                offset: 1,
                color: endColor[index],
              },
            ]),
          },
        };
      });
      const legendArr = valueArr.map((item) => {
        return item.name;
      });
      const dataOption = {
        xAxis: {
          data: timeArr,
        },
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdopter() {
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6;
      const adopterOption = {
        legend: {
          itemWidth: this.titleFontSize * 0.8,
          itemHeight: this.titleFontSize * 0.8,
          itemGap: this.titleFontSize * 0.8,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
      };
      this.chartInstance.setOption(adopterOption);
      this.chartInstance.resize();
    },
    handleSelect(key) {
      this.choiceType = key;
      this.updataChart();
    },
  },
  computed: {
    selectTypes() {
      if (this.allData) {
        return this.allData.type.filter((item) => {
          return item.key !== this.choiceType;
        });
      } else {
        return [];
      }
    },
    showTitle() {
      return this.allData ? this.allData[this.choiceType].title : "";
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
      };
    },
    marginStyle() {
      return {
        marginLeft: this.titleFontSize * 0.6 + "px",
      };
    },
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdopter);
    this.screenAdopter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdopter);
  },
};
</script>
<style lang="less" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  color: #fff;
  z-index: 10;
}
.title-icon {
  transform: rotate(0turn);
  cursor: pointer;
}
.select-con{
    background-color: #222733;
}
</style>
