import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd/es/table/Table';

export type StretchableTableProps<DataType = {}> = Omit<
  TableProps<DataType>,
  'scroll'
> & { wrapperClassName?: string };

const TABLE_HEADER_HEIGHT = 56;
const TABLE_PAGINATION_HEIGHT = 103;

const StretchableTable = <DataType extends {}>(
  props: StretchableTableProps<DataType>,
) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [tableHeight, setTableHeight] = useState(0);

  const handleResizeWindow = useCallback(() => {
    if (containerRef.current?.parentElement) {
      const { height, paddingTop, paddingBottom } = getComputedStyle(
        containerRef.current.parentElement,
      );

      const outsideHeight = props.pagination
        ? TABLE_HEADER_HEIGHT + TABLE_PAGINATION_HEIGHT
        : TABLE_HEADER_HEIGHT;

      setTableHeight(
        parseFloat(height) -
          parseFloat(paddingTop) -
          parseFloat(paddingBottom) -
          outsideHeight,
      );
    }
  }, [props.pagination]);

  useEffect(() => {
    if (containerRef.current?.parentElement) {
      const observer = new ResizeObserver(() => handleResizeWindow());
      observer.observe(containerRef.current.parentElement);

      return () => {
        observer.disconnect();
      };
    }

    return undefined;
  }, [handleResizeWindow]);

  return (
    <div
      ref={containerRef}
      className={`antd-stretchable-table ${props.wrapperClassName}`}
    >
      <Table {...props} scroll={{ y: tableHeight }} />
    </div>
  );
};

export default memo(StretchableTable);
