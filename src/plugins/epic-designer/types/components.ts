import { EventModel, ActionModel } from '@coderlt/form-designer';
import { ComponentTypeEnum } from '..';

export interface CommonComponentConfig {
  id?: string;
  label: string;
  isUnique?: boolean;
  field: string;
  type: string;
}

// 自定义配置项
type NodeItem = {
  label?: string;
  field?: string;
  name?: string;
  slotName?: string;
  componentProps?: any;
  id?: string;
  noFormItem?: boolean;
  input?: boolean;
  immovable?: boolean;
  childImmovable?: boolean;
  labelCol?: any;
  wrapperCol?: any;
  children?: NodeItem[];
  slots?: { [slotName: string]: NodeItem[] };
  editData?: any;
  isUnique?: boolean;
  hideCopy?: boolean;
  hideDel?: boolean;
  isRequired?: boolean;
  [propName: string]: any;
};

// 自定义配置单项 schema
export type SchemaItem = {
  defaultSchema: NodeItem;
  config?: {
    attribute?: NodeItem[];
    style?: NodeItem[];
    event?: EventModel[];
    action?: ActionModel[];
  };
  groupName?: string[];
  hide?: boolean;
  componentType: `${ComponentTypeEnum}`;
};

// 添加自定义配置表单组
export interface SchemaGroup {
  title: string;
  list: SchemaItem[];
}

export interface ComponentManagerParmas {
  mode?: 'cover' | 'merge';
}
