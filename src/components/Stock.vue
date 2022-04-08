<template>
    <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
  </div>
</template>

<script>
export default {
    name:"Hot",
    data() {
        return {
            echartsInstance :null,
            allData:null
        }
    },
    methods:{
        initOption(){
            this.echartsInstance = this.$echarts.init(this.$refs.hot_ref)
            const initOption = {}
            this.echartsInstance.setOption(initOption)
        },
        async getData(){
            const {data} = await this.$axios.get("hot")
            this.allData = data
    this.updataOption()
        },
        updataOption(){
            const dataOption = {}
            this.echartsInstance.setOption(dataOption)
        },
        screenAdapter(){
            const adapterOption = {}
            this.echartsInstance.setOption(adapterOption)
            this.echartsInstance.resize()
        }
    },
    mounted(){
        this.initOption()
        this.getData()
        window.addEventListener("resize", this.screenAdapter)
        this.screenAdapter()
    },
    beforeDestroy(){
        window.removeEventListener("resize", this.screenAdapter)
    }
}
</script>

<style>

</style>