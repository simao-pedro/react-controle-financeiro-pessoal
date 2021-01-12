import React from 'react';

export default function Action({
  idTransaction,
  typeAction,
  handleTypeAction,
}) {
  const handleAction = () => {
    handleTypeAction(idTransaction, typeAction);
  };

  return (
    <button className="transaction__buttonAction" onClick={handleAction}>
      <i className="material-icons">{typeAction}</i>
    </button>
  );
}
