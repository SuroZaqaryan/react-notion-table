import { JSX } from 'react';
import { DataTypes } from '../utils/utils';
import { Hash, Copy, AlignLeft } from 'lucide-react';

interface DataTypeIconProps {
  dataType: string;
}

export default function DataTypeIcon({ dataType }: DataTypeIconProps) {
  function getPropertyIcon(dataType: string): JSX.Element | null {
    switch (dataType) {
      case DataTypes.NUMBER:
        return <Hash />;
      case DataTypes.TEXT:
        return <AlignLeft />;
      case DataTypes.SELECT:
        return <Copy />;
      default:
        return null;
    }
  }

  return getPropertyIcon(dataType);
}
