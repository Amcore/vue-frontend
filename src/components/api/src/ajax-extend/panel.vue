<template>
  <div class="x-proxy-panel">
    <div class="x-proxy-panel__icon" @click="toggleDialog(true)">api</div>
      <el-dialog
        :visible="show"
        v-if="panelMounted"
        title="切换请求环境"
        width="450px"
        custom-class="x-proxy-panel__dialog"
        @close="toggleDialog(false)">
        <el-form :model="$data">
          <el-form-item label="环境">
            <el-radio
              v-model="targetType"
              label="test">
              标准环境
            </el-radio>
            <el-radio
              v-model="targetType"
              label="custom">
              自定义
            </el-radio>
          </el-form-item>
          <el-form-item
            v-for='match in matchMap'
            :key='`${match}-标准环境`'
            :label="match"
            v-show="targetType === 'test'">
            <el-select
              v-model="martchTargetMap[match].apiTarget"
              placeholder="请选择测试环境"
              size="small">
              <el-option
                :label="target"
                :value="target"
                v-for="target in targets"
                :key="target" />
            </el-select>
          </el-form-item>
        <el-form-item
          v-for='match in matchMap'
          :key='`${match}-自定义`'
          label="自定义"
          v-show="targetType === 'custom'"
          prop="customTarget">
          <el-input
            v-model="martchTargetMap[match].customTarget"
            size="small"/>
        </el-form-item>
        <el-form-item label="接口维度">
          <el-checkbox
            v-model="useApiForward"
            size="small">
            启用接口转发
          </el-checkbox>
        </el-form-item>
        <el-form-item
          label="接口地址"
          v-if="useApiForward"
          prop="apiPattern">
          <el-input v-model="apiPattern" size="small"/>
        </el-form-item>
        <el-form-item class="action">
          <el-button
            type="primary"
            @click="onSubmit"
            size="small">
            确认
          </el-button>
          <el-button
            @click="toggleDialog(false)"
            size="small">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getStorageItem,
  setStorageItem,
  STORE_KEY
} from './utils'
export default {
  name: 'api',

  data() {
    return {
      matchMap: [],
      show: false,
      apiTarget: '',
      customTarget: '',
      panelMounted: false,
      expireTime: '',
      targetType: 'test',
      useApiForward: false,
      useApiMock: false,
      apiPattern: '',
      targetMap: {},
      martchTargetMap: {}
    }
  },

  methods: {
    toggleDialog (value) {
      this.show = value
    },
    /**
     * @submit
     */
    onSubmit() {
      const apiTargetCache = {}

      apiTargetCache.targetType = this.targetType
      apiTargetCache.useApiForward = this.useApiForward
      apiTargetCache.customTarget = this.customTarget
      apiTargetCache.apiTarget = this.apiTarget
      apiTargetCache.useApiMock = this.useApiMock
      apiTargetCache.apiPattern = this.apiPattern
      apiTargetCache.martchTargetMap = this.martchTargetMap

      setStorageItem(STORE_KEY, apiTargetCache, this.expireTime)
      this.toggleDialog(false)
      window.location.reload()
    }
  },

  watch: {
    matchMap: {
      handler: function (val) {
        if (val) {
          Object.keys(this.martchTargetMap).forEach((key) => {
            if (
              Object.prototype.hasOwnProperty.call(this.matchMap.hasOwnProperty, [key])
            ) delete this.martchTargetMap[key]
          })
          this.matchMap.forEach((val) => {
            console.log(val)
            if (!Object.prototype.hasOwnProperty.call(this.martchTargetMap, [val])) {
              this.martchTargetMap[val] = {
                apiTarget: '',
                customTarget: ''
              }
            }
          })
        }
      }
    }
  },

  created() {
    const apiTargetCache = getStorageItem(STORE_KEY)
    if (apiTargetCache) {
      this.targetType = apiTargetCache.targetType || 'test'
      this.useApiForward = apiTargetCache.useApiForward
      this.useApiMock = apiTargetCache.useApiMock
      this.apiPattern = apiTargetCache.apiPattern
      this.apiTarget = apiTargetCache.apiTarget
      this.customTarget = apiTargetCache.customTarget
      this.apiExpands = apiTargetCache.apiExpands || {}
      this.apiExpandsMap = apiTargetCache.apiExpandsMap || {}
      this.martchTargetMap = apiTargetCache.martchTargetMap || {}
    }
  },

  mounted() {
    this.targets = Object.keys(this.targetMap)
    this.panelMounted = true
  }
}
</script>

<style lang="less">
.x-proxy-panel {
  &__icon {
    position: fixed;
    width: 40px;
    bottom: 10px;
    left: 10px;
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    background: #38f;
    text-align: center;
    border-radius: 50%;
    color: white;
    box-shadow: 2px 3px 5px #999;
    cursor: pointer;
  }

  &__dialog {
    .el-form-item {
      display: flex;

      &__expand {
        border-top: 1px solid lightgray;
        .env-name {
          color: #909399;
          font-weight: 400;
        }
      }

      .el-form-item__label {
        width: 75px;
      }
      .mock {
        display: inline-flex;
        align-items: center;

        .el-icon-question {
          color: #5E7BE4;
          margin-left: 8px;
        }
      }

      &.action {
        justify-content: center;
      }
      .el-input {
        width: 230px;
      }
    }
  }
}
</style>
