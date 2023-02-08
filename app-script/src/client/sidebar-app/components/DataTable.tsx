import React from 'react';
import { ValueRangeObj } from '../types';

import './DataTable.style.css';

const DUMMY_DATA: ValueRangeObj = {
  range: 'A1:B2',
  values: `[["Name","Height","Eye color","Email"],["Kyle Stone, test","4.48","red","kyle.stone@gmail.com"],["Reese Reilly","4.61","blue","r.reilly@hotmail.com"]]`,
};

function DataTable({ data }: { data: ValueRangeObj | '' }) {
  //   if (!data?.values) return null;

  if (!data) {
    return null;
  }

  const dataArr = JSON.parse(data.values);

  console.log(dataArr);

  return (
    <div className="table-wrapper">
      <table className="table">
        {dataArr.map((row: any, rowIndex: number) => {
          return (
            <tr key={`row-${rowIndex}`}>
              {rowIndex === 0
                ? row.map((col: any) => {
                    return <th key={col}>{col}</th>;
                  })
                : row.map((col: any) => {
                    return <td key={col}>{col}</td>;
                  })}
            </tr>
          );
        })}
      </table>
    </div>
  );
}

export default DataTable;
