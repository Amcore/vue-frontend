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
          <el-radio v-model="targetType" label="test">标准环境</el-radio>
          <el-radio v-model="targetType" label="custom">自定义</el-radio>
        </el-form-item>
        <el-form-item label="标准环境" v-if="targetType === 'test'" prop="apiTarget">
          <el-select v-model="apiTarget" placeholder="请选择测试环境" size="small">
            <el-option :label="target" :value="target" v-for="target in targets" :key="target" />
          </el-select>
        </el-form-item>
        <el-form-item label="自定义" v-if="targetType === 'custom'" prop="customTarget">
          <el-input v-model="customTarget" size="small"/>
        </el-form-item>
        <el-form-item label="接口维度">
          <el-checkbox v-model="useApiForward" size="small">启用接口转发</el-checkbox>
          <!-- <div v-if="useApiForward" class="mock">
            <el-checkbox v-model="useApiMock" size="small" >启用mock</el-checkbox>
            <el-tooltip class="item" effect="dark" content="启动之后会把接口转发到easymock" placement="top-start">
              <i class="el-icon-question" />
            </el-tooltip>
          </div> -->
        </el-form-item>
        <el-form-item label="接口地址" v-if="useApiForward" prop="apiPattern">
          <el-input v-model="apiPattern" size="small"/>
        </el-form-item>
        <el-form-item label="扩展环境" class="el-form-item__expand" v-if="expands && expands.length > 0">
          <div class="env-name">（不会影响代理请求头）</div>
        </el-form-item>
        <el-form-item
          v-for="expand in expands"
          :label="expand.label"
          :key="expand.key">
          <el-select
            filterable
            allow-create
            v-model="apiExpands[expand.key]"
            placeholder="请选择测试环境"
            size="small">
            <el-option :label="target" :value="expand.targetMap[target]" v-for="target in Object.keys(expand.targetMap)" :key="target" />
          </el-select>
        </el-form-item>
        <el-form-item class="action">
          <el-button type="primary" @click="onSubmit" size="small">确认</el-button>
          <el-button @click="toggleDialog(false)" size="small">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable*/
import { getStorageItem, setStorageItem, STORE_KEY } from './utils';

export default {
  data () {
    return {
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
      apiExpands: {},
      apiExpandsMap: {},
      expands: []
    };
  },

  methods: {
    toggleDialog (value) {
      this.show = value;
    },

    onSubmit () {
      const apiTargetCache = {};

      apiTargetCache.targetType = this.targetType;
      apiTargetCache.useApiForward = this.useApiForward;
      apiTargetCache.customTarget = this.customTarget;
      apiTargetCache.apiTarget = this.apiTarget;
      apiTargetCache.useApiMock = this.useApiMock;
      apiTargetCache.apiPattern = this.apiPattern;
      apiTargetCache.apiExpands = this.apiExpands || {};
      apiTargetCache.apiExpandsMap = this.getExpandsMap();

      setStorageItem(STORE_KEY, apiTargetCache, this.expireTime);
      this.toggleDialog(false);
      window.location.reload();
    },

    initExpands () {
      const expands = this.apiExpands || {};
      const expandsMap = this.apiExpandsMap || {};
      const keys = Object.keys(expands);
      if(keys && keys.length <= 0) {
        return ;
      }

      (this.expands || []).map(expand => {
        const { key } = expand;
        const value = expands[key];
        let mapValues = [];
        let hisValues = expandsMap[key] || [];
        if(!expand.targetMap) {
          expand.targetMap = {};
        }

        mapValues = Object.values(expand.targetMap);

        if(value && !mapValues.includes(value)) {
          expand.targetMap[value] = value;
        }
        hisValues.forEach(hv => {

          if(!mapValues.includes(hv)) {
            expand.targetMap[hv] = hv;
          }

        });
      });
    },

    getExpandsMap() {
      const expands = this.expands || [];
      const currentExpands = this.apiExpands || {};
      const map = {};
      expands.forEach(expand => {
        const {
          key,
          targetMap = {}
        } = expand;
        const set = new Set();
        const values = Object.values(targetMap);
        if(currentExpands[key]) {
          set.add(currentExpands[key]);
        }
        values.map(val => {
          set.add(val);
        });
        map[key] = Array.from(set);
      });
      return map;
    }
  },

  watch: {
    expands(val) {
      this.initExpands();
    }
  },

  created () {

    const apiTargetCache = getStorageItem(STORE_KEY);
    if (apiTargetCache) {
      this.targetType = apiTargetCache.targetType || 'test';
      this.useApiForward = apiTargetCache.useApiForward;
      this.useApiMock = apiTargetCache.useApiMock;
      this.apiPattern = apiTargetCache.apiPattern;
      this.apiTarget = apiTargetCache.apiTarget;
      this.customTarget = apiTargetCache.customTarget;
      this.apiExpands = apiTargetCache.apiExpands || {};
      this.apiExpandsMap = apiTargetCache.apiExpandsMap || {};
    }
  },
  mounted () {
    this.targets = Object.keys(this.targetMap);
    this.panelMounted = true;
    this.initExpands();
  }
};
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
