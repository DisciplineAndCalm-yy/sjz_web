enum ComponentTypeEnum {
  INPUT = 'input',
  FORM = 'form',
  SELECT = 'select',
  RADIO = 'radio',
  UPLOAD = 'upload',
  SWITCH = 'switch',
  TIME = 'time',
  TREE_SELECT = 'treeSelect',
  TEXTAREA = 'textarea',
  DATA_PICKER = 'dataPicker',
  COMPOSITE_COMPONENT = 'compositeComponent',
  CUSTOM_NOTICE = 'customNotice',
}

enum DataPickerEnum {
  DATE = 'date',
  MONTH = 'month',
  DATARANGE = 'daterange',
}

// switch 选项值
enum SwitchEnum {
  OPEN = '1',
  CLOSE = '0'
}

export { ComponentTypeEnum, DataPickerEnum, SwitchEnum };
