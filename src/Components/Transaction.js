import React from 'react';
import Action from './Action';

export default function Transaction({ transactionItem, handleTypeAction }) {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const classType = (type) => {
    let classElement = 'd-flex flex-wrap align-items-center transaction';
    if (type === '+') classElement += ' bg-green transaction';
    else if (type === '-') classElement += ' bg-red transaction';
    return classElement;
  };

  return (
    <div className={classType(transactionItem.type)}>
      <div className="transaction__boxDay">
        <strong className="transaction__day">{transactionItem.day}</strong>
      </div>
      <div className="transaction__boxDescription">
        <strong className="transaction__category">
          {transactionItem.category}
        </strong>
        <p className="transaction__description">
          {transactionItem.description}
        </p>
      </div>
      <div className="transaction__boxValue">
        <span className="transaction__value">
          {formatter.format(transactionItem.value)}
        </span>
      </div>
      <div className="transaction__boxActions">
        <Action
          idTransaction={transactionItem._id}
          typeAction="edit"
          handleTypeAction={handleTypeAction}
        />
        <Action
          idTransaction={transactionItem._id}
          typeAction="delete"
          handleTypeAction={handleTypeAction}
        />
      </div>
    </div>
  );
}
