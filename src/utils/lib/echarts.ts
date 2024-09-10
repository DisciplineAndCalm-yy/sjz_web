/*
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-12-28 16:27:46
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-03-15 15:07:38
 * @FilePath: \yst-city-shijiazhuang-web\src\utils\lib\echarts.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as echarts from 'echarts/core';

import { BarChart, LineChart, PieChart, MapChart, PictorialBarChart, RadarChart, ScatterChart } from 'echarts/charts';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  LegendComponent,
  RadarComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  GraphicComponent,
  DatasetComponent,
} from 'echarts/components';

// TODO 如果想换成SVG渲染，就导出SVGRenderer，
//  并且放到 echarts.use 里，注释掉 CanvasRenderer
import { /*SVGRenderer*/ CanvasRenderer } from 'echarts/renderers';

echarts.use([
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  BarChart,
  LineChart,
  PieChart,
  MapChart,
  RadarChart,
  ScatterChart,
  // TODO 因为要兼容Online图表自适应打印，所以改成 CanvasRenderer，可能会模糊
  CanvasRenderer,
  PictorialBarChart,
  RadarComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  GraphicComponent,
  DatasetComponent,
]);

export default echarts;
