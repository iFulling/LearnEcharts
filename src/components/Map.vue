<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from "axios";
import { getProvinceMapInfo } from "@/utils/map_utils.js";
import { mapState } from "vuex";
export default {
  name: "Map",
  data() {
    return {
      echartsInstance: null,
      allDate: null,
      mapData: {},
    };
  },
  methods: {
    async initChart() {
      this.echartsInstance = this.$echarts.init(this.$refs.map_ref, this.theme);
      const ret = await axios.get(
        "http://192.168.177.77:8088/static/map/china.json"
      );
      this.$echarts.registerMap("china", ret.data);
      const initOption = {
        title: {
          text: "▎商家分布",
          left: 20,
          top: 20,
        },
        geo: {
          type: "map",
          map: "china",
          top: "5%",
          bottom: "5%",
          itemStyle: {
            areaColor: "#2E72Bf",
            borderColor: "#333",
          },
        },
        legend: {
          left: "5%",
          bottom: "5%",
          orient: "vertical",
        },
      };
      this.echartsInstance.setOption(initOption);
      this.echartsInstance.on("click", async (arg) => {
        this.nowTime = Date.now();
        const provinceInfo = getProvinceMapInfo(arg.name);
        if (!provinceInfo.key) {
          return;
        }
        if (!this.mapData[provinceInfo.key]) {
          const ret = await axios.get(
            "http://192.168.177.77:8088" + provinceInfo.path
          );
          this.mapData[provinceInfo.key] = ret.data;
          this.$echarts.registerMap(provinceInfo.key, ret.data);
        }
        const changeOption = {
          geo: {
            map: provinceInfo.key,
          },
        };
        this.echartsInstance.setOption(changeOption);
      });
    },
    getData(realData) {
      this.allDate = realData;
      this.updateChart();
    },
    updateChart() {
      const legendArr = this.allDate.map((item) => {
        return item.name;
      });
      const seriesArr = this.allDate.map((item) => {
        return {
          type: "effectScatter",
          name: item.name,
          data: item.children,
          coordinateSystem: "geo",
          rippleEffect: {
            scale: 5,
            brushType: "stroke",
          },
        };
      });
      const dataOption = {
        series: seriesArr,
        legend: {
          data: legendArr,
        },
      };
      this.echartsInstance.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6;
      const adopterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize * 0.4,
          },
        },
      };
      this.echartsInstance.setOption(adopterOption);
      this.echartsInstance.resize();
    },
    revertMap() {
      const revertOption = {
        geo: {
          map: "china",
        },
      };
      this.echartsInstance.setOption(revertOption);
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
      this.updateChart();
    },
  },
  created() {
    this.$socket.registerCallback("mapData", this.getData);
  },
  mounted() {
    this.initChart();
    this.$socket.send({
      action: "getData",
      socketType: "mapData",
      chartName: "map",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.timer);
    this.$socket.unRegisterCallback("mapData");
  },
};
</script>

<style></style>
