import {LabeledOption} from '../types/types'

export type DataType =
  | 'checkbox'
  | 'drag-handle'
  | 'plus'
  | 'text'
  | 'select';

export interface Column {
  id: string;
  label: string;
  accessor: string;
  dataType: DataType;
  className?: string;
  width?: number;
  disableResizing?: boolean;
  options?: LabeledOption | [];
}

const columns: Column[] = [
  {
    id: 'selection',
    label: '',
    accessor: 'selection',
    dataType: 'checkbox',
    className: 'hidden-col',
    width: 40,
    disableResizing: true,
  },
  {
    id: 'drag-handle',
    label: '',
    accessor: 'drag-handle',
    dataType: 'drag-handle',
    className: 'hidden-col',
    width: 40,
    disableResizing: true,
  },
  {
    id: 'plus',
    label: '',
    accessor: 'plus',
    dataType: 'plus',
    className: 'hidden-col',
    width: 40,
    disableResizing: true,
  },
  {
    id: 'name',
    label: 'Наименование характеристики',
    accessor: 'name',
    dataType: 'text',
    className: 'name-col',
    options: [],
  },
  {
    id: 'value',
    label: 'Значение',
    accessor: 'value',
    dataType: 'select',
    width: 340,
    options: [],
  },
  {
    id: 'unit',
    label: 'Ед. изм.',
    accessor: 'unit',
    dataType: 'text',
    width: 160,
    className: 'unit-col',
    options: [],
  },
];

export default columns;
