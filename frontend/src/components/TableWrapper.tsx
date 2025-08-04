import React from 'react';

type Props = {
  loading: boolean;
  dataLength: number;
  emptyMessage: string;
  children: React.ReactNode;
};

const TableWrapper = ({
  loading,
  dataLength,
  emptyMessage,
  children,
}: Props) => {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (dataLength === 0) {
    return (
      <div className="py-12 text-center text-lg text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return <div className="overflow-x-auto p-8">{children}</div>;
};

export default TableWrapper;
