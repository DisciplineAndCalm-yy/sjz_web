<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2024-03-18 14:34:00
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-03-25 18:07:24
 * @FilePath: \yst-city-shijiazhuang-web\src\views\businessScreen\components\businessAction.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="scorll-list">
    <vue3-seamless-scroll :list="dataSource" class="scroll" hover :step="0.3">
      <div class="body">
      <div class="li" v-for="(item, index) in dataSource" :key="index">
        <div class="li-content">
          <div class="li-left">
            <div class="time">
              <span>{{ item.finishYear }}</span><span>{{ item.finishMonth }}</span>
            </div>
            <div class="arrow"></div>
            <div class="bars">
              <div class="bar"></div>
            </div>
          </div>
          <div :class="{'li-right': true, 'li-right-null': Object.keys(item).length == 0 }">
            <div v-if="item.title" class="li-right-title" :title="item.title">{{ item.title }}</div>
            <div v-if="item.supType" class="li-right-content">
              <div>
                <div class="text"><span>类型：</span><span>{{ item.supType }}</span></div>
              </div>
              <div></div>
            </div>
            <div v-if="item.finishTime" class="li-right-bottom">
              <span>于<span class="highlight">{{ item.finishTime }}</span>由{{item.responsibleDepartDesc}}完成，共耗时<span class="highlight">{{ item.days }}</span>天</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 如果数据小于2,列表不会滚动，需要最后添加一个节点装饰 -->
      <div class="last-joint" v-if="dataSource.length <= 2 && dataSource.length > 0"></div>
      </div>
    </vue3-seamless-scroll>
  </div>
</template>

<script lang='ts' setup>
import { ref, computed, unref, watch } from 'vue';
import { getBusinessAction } from '/@/api/businessScreen/businessScreen'

const dataSource = ref([{}, {}])

async function init() {
  let data = await getBusinessAction() || []
  if (!data || data.length === 0) {
    dataSource.value = [{},{}]
  } else {
    dataSource.value = data
  }
}
init()
</script>

<style lang="less" scoped>
.scorll-list {
  height: 100%;
  padding-left: 20px;
  box-sizing: border-box;
  // overflow: hidden;
  .body {
    height: 100%;
    .li {
      height: 177.5px;
      box-sizing: border-box;
      padding-top: 5px;
      width: 100%;
      .li-content {
        display: flex;
        align-items: center;
        height: 100%;
        min-height: 0;
        .li-left {
          position: relative;
          height: 100%;
          width: 82px;

          .time {
            // position: absolute;
            display: flex;
            height: 100%;
            justify-content: center;
            flex-direction: column;
            font-family: Microsoft-YaHei, Microsoft-YaHei;
            font-weight: bold;
            font-size: 16px;
            color: #FFFFFF;
          }

          .arrow {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translate(0, -50%);
            width: 100%;
            height: 10px;
            background: url(/@/assets/images/businessScreen/arrow.png) no-repeat;
            background-size: 100% 100%;
            z-index: 2;
          }

          .bars {
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            box-sizing: border-box;
            padding: 3px 3px;
            width: 11px;

            .bar {
              height: 100%;
              width: 100%;
              background: #28449D;
              border-radius: 10px;
            }

            &::before {
              content: '';
              position: absolute;
              top: -5px;
              left: 0;
              width: 100%;
              height: 5px;
              border-radius: 5px;
              background: #ACE6FC;
            }

            // &::after {
            //   content: '';
            //   display: none;
            //   position: absolute;
            //   bottom: -8px;
            //   left: 0;
            //   width: 100%;
            //   height: 8px;
            //   border-radius: 5px;
            //   background: blueviolet;
            // }
          }
        }

        .li-right {
          // flex: 1;
          margin-left: 22px;
          width: 286px;
          height: 157px;
          background: url(/@/assets/images/businessScreen/action-card.png) no-repeat;
          background-size: 100% 100%;
          box-sizing: border-box;
          padding-top: 8px;
          transform: translate(0, -4px);

          &-title {
            height: 42px;
            padding-left: 50px;
            line-height: 42px;
            font-family: Microsoft-YaHei, Microsoft-YaHei;
            font-weight: bold;
            font-size: 14px;
            color: #FFFFFF;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          &-content {
            height: 72px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;

            >div {
              height: 12px;
              padding-left: 22px;

              .text {
                span {
                  font-family: MicrosoftYaHei;
                  font-size: 12px;

                  &:nth-child(1) {
                    color: #5898DD;
                  }

                  &:nth-child(2) {
                    color: #FFFFFF;
                  }
                }
              }
            }
          }

          &-bottom {
            margin-top: 3px;
            height: 32px;
            line-height: 32px;
            padding-left: 19px;
            font-family: MicrosoftYaHei;
            font-size: 12px;
            color: #FFFFFF;

            .highlight {
              color: #FFE400;
              padding: 0 3px;
            }
          }
        }
        .li-right-null {
          background: url(/@/assets/images/businessScreen/action-card-null.png) no-repeat;
          background-size: 100% 100%;
        }
      }
      
    }
    .last-joint {
      width: 11px;
      margin-left: 71px;
      height: 5px;
      border-radius: 5px;
      background: #ACE6FC;
    }
  }
  .scroll {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
}
</style>