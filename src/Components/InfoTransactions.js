import React from 'react';

export default function InfoTransactions({ labelField, valueField, classCSS }) {
  return (
    <div className="col s3">
      <strong>{labelField} </strong>
      <span className={classCSS}>{valueField}</span>
    </div>
  );
}
