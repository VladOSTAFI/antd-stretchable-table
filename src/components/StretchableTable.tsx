import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Table } from 'antd';
import styled from 'styled-components';
import type { TableProps } from 'antd/es/table/Table';

type FullHeightTableProps<DataType = object> = Omit<TableProps<DataType>, 'scroll'>;

const StyledContainer = styled.div`
  height: 100%;
`;

const TABLE_HEADER_HEIGHT = 56;
const TABLE_PAGINATION_HEIGHT = 103;

const StretchableTable = <DataType extends object>(props: FullHeightTableProps<DataType>) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [tableHeight, setTableHeight] = useState(0);

  const handleResizeWindow = useCallback(() => {
    if (containerRef.current?.parentElement) {
      const { height, paddingTop, paddingBottom } = getComputedStyle(containerRef.current.parentElement);

      const outsideHeight = props.pagination ? TABLE_HEADER_HEIGHT + TABLE_PAGINATION_HEIGHT : TABLE_HEADER_HEIGHT;

      setTableHeight(parseFloat(height) - parseFloat(paddingTop) - parseFloat(paddingBottom) - outsideHeight);
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
    <StyledContainer ref={containerRef}>
      <Table {...props} scroll={{ y: tableHeight }} />
    </StyledContainer>
  );
};

export default memo(StretchableTable);
