import { DataTypes } from '../utils/utils';
import { Hash , Copy, AlignLeft } from 'lucide-react';

export default function DataTypeIcon({ dataType }) {
  function getPropertyIcon(dataType) {
    switch (dataType) {
      case DataTypes.NUMBER:
        return <Hash  />;
      case DataTypes.TEXT:
        return <AlignLeft />;
      case DataTypes.SELECT:
        return <Copy  />;
      default:
        return null;
    }
  }

  return getPropertyIcon(dataType);
}
