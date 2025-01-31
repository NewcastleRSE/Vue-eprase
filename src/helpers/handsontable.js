// the base module
import Handsontable from 'handsontable/base';

// cell type modules
import {
  AutocompleteCellType,
  CheckboxCellType,
  DateCellType,
  DropdownCellType,
  HandsontableCellType,
  NumericCellType,
  PasswordCellType,
  TextCellType,
  TimeCellType
} from 'handsontable/cellTypes';

// renderer modules
import {
  baseRenderer,
  autocompleteRenderer,
  checkboxRenderer,
  dropdownRenderer,
  htmlRenderer,
  numericRenderer,
  passwordRenderer,
  textRenderer
} from 'handsontable/renderers';

// editor modules
import {
  AutocompleteEditor,
  BaseEditor,
  CheckboxEditor,
  DateEditor,
  DropdownEditor,
  HandsontableEditor,
  NumericEditor,
  PasswordEditor,
  SelectEditor,
  TextEditor
} from 'handsontable/editors';

// validator modules
import {
  autocompleteValidator,
  dateValidator,
  dropdownValidator,
  numericValidator,
  timeValidator
} from 'handsontable/validators';

// plugin modules
import {
  AutoColumnSize,
  AutoRowSize,
  Autofill,
  BasePlugin,
  BindRowsWithHeaders,
  CollapsibleColumns,
  ColumnSorting,
  ColumnSummary,
  Comments,
  ContextMenu,
  CopyPaste,
  CustomBorders,
  DragToScroll,
  DropdownMenu,
  ExportFile,
  Filters,
  Formulas,
  HiddenColumns,
  HiddenRows,
  ManualColumnFreeze,
  ManualColumnMove,
  ManualColumnResize,
  ManualRowMove,
  ManualRowResize,
  MergeCells,
  MultiColumnSorting,
  MultipleSelectionHandles,
  NestedHeaders,
  NestedRows,
  PersistentState,
  Search,
  StretchColumns,
  TouchScroll,
  TrimRows,
  UndoRedo
} from 'handsontable/plugins'

// translation modules
import {
  enUS
} from 'handsontable/i18n'

// registering functions that let you quickly register all modules at once
import {
  registerAllCellTypes,
  registerAllRenderers,
  registerAllEditors,
  registerAllValidators,
  registerAllPlugins
} from 'handsontable/registry'

registerAllCellTypes()

// register all renderers at once
registerAllRenderers()

// register all editors at once
registerAllEditors()

// register all validators at once
registerAllValidators()

// register all plugins at once
registerAllPlugins()

export function patientIdValidator(query, callback) {
  console.debug('patientIdValidator on', query)
  callback(query == null || (Number.isInteger(query) && query > 0))
}

export function patientCodeValidator(query, callback) {
  console.debug('patientCodeValidator on', query)
  callback(query.match(/^P\d{3}$/) != null)
}  

export function patientFirstNameValidator(query, callback) {
  console.debug('patientFirstNameValidator on', query)
  callback(query != null && query.length > 0)
}  

export function patientSurnameValidator(query, callback) {
  console.debug('patientSurnameValidator on', query)
  callback(query != null && query.length > 0)
}  

export function patientHeightValidator(query, callback) {
  console.debug('patientHeightValidator on', query)
  callback(query != null && query > 0.5)
}

export function patientWeightValidator(query, callback) {
  console.debug('patientWeightValidator on', query)
  callback(query != null && query.length > 0)
}

export function patientIsAdultValidator(query, callback) {
  console.debug('patientIsAdultValidator on', query)
  callback(query === true || query === false)
}
  
// Does the equivalent of HoT API method getSourceDataAtRow but works when sorting applied
export function rowDataArrayToColumnObject(rowArr, colDefs) {
  console.assert(Array.isArray(rowArr) && Array.isArray(colDefs) && rowArr.length == colDefs.length)
  const colObj = {}
  rowArr.forEach((elt, idx) => {
    colObj[colDefs[idx].data] = elt
  })
  return colObj
}

export function noEditRenderer(_instance, td, _row, _col, _prop, value) {
  td.setAttribute('title', 'This value cannot be edited')
  td.classList.add('non-editable-cell')
  td.innerText = value
  return td
}