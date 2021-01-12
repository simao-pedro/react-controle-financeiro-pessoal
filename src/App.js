import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import InfoTransactions from './Components/InfoTransactions.js';
import Transaction from './Components/Transaction.js';

export default function App() {
  const periods = [];
  for (let i = 2019; i <= 2021; i++) {
    for (let j = 1; j <= 12; j++) {
      if (j < 10)
        periods.push({ period: `${i}-0${j}`, exibition: `0${j}/${i}` });
      else periods.push({ period: `${i}-${j}`, exibition: `${j}/${i}` });
    }
  }

  const sumArray = (transactions) => {
    const sum = transactions.reduce((acc, curr) => (acc += curr.value), 0);
    return sum;
  };

  const [transactionsArray, setTransactionsArray] = useState([]);
  const [dateFilter, setDateFilter] = useState('2019-01');
  const [textFilter, setTextFilter] = useState('');

  const [infoTransactionsArray, setInfoTransactionsArray] = useState({
    lancamentos: 0,
    receitas: 0,
    despesas: 0,
    saldo: 0,
  });

  const getTransactions = async () => {
    const dataArray = await axios.get(
      `http://localhost:3001/api/transaction?period=${dateFilter}&filter=${textFilter}`
    );
    setTransactionsArray(dataArray.data);
  };

  useEffect(() => {
    getTransactions();
  }, []);

  useEffect(() => {
    getTransactions();
  }, [dateFilter, textFilter]);

  useEffect(() => {
    const totalReceitas = sumArray(
      transactionsArray.filter((t) => t.type === '+')
    );
    const totalDespesas = sumArray(
      transactionsArray.filter((t) => t.type === '-')
    );
    const totalSaldo = totalReceitas - totalDespesas;
    setInfoTransactionsArray({
      lancamentos: transactionsArray.length,
      receitas: totalReceitas,
      despesas: totalDespesas,
      saldo: totalSaldo,
    });
  }, [transactionsArray]);

  const handleTextFilter = ({ target }) => {
    setTextFilter(target.value);
  };

  const handleDateFilter = ({ target }) => {
    setDateFilter(target.value);
  };

  const handleTypeAction = async (id, typeAction) => {
    if (typeAction === 'delete')
      await axios.delete(`http://localhost:3001/api/transaction`, {
        data: { id },
      });

    getTransactions();
  };

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div className="container">
      <h1 className="font-weight-bold text-center titulo">
		Controle Financeiro Pessoal
      </h1>

      <div className="row d-flex flex-wrap align-items-center">

        <div className="col s4">
          <div className="input-field">
            <select
              value={dateFilter}
              onChange={handleDateFilter}
              className="d-block bordered"
              id="slDate"
            >
              {periods.map(({ period, exibition }) => (
                <option key={period} value={period}>
                  {exibition}
                </option>
              ))}
            </select>
          </div>
        </div>
		
      </div>

      <div className="infos bordered text-center">
        <div className="row">
          <InfoTransactions
            labelField="Lançamentos:"
            valueField={infoTransactionsArray.lancamentos}
            classCSS="font-weight-bold"
          />

          <InfoTransactions
            labelField="Receitas:"
            valueField={formatter.format(infoTransactionsArray.receitas)}
            classCSS="color-green font-weight-bold"
          />

          <InfoTransactions
            labelField="Despesas:"
            valueField={formatter.format(infoTransactionsArray.despesas)}
            classCSS="color-red font-weight-bold"
          />

          <InfoTransactions
            labelField="Saldo:"
            valueField={formatter.format(infoTransactionsArray.saldo)}
            classCSS={
              infoTransactionsArray.saldo >= 0
                ? 'color-green font-weight-bold'
                : 'color-red font-weight-bold'
            }
          />
        </div>
      </div>

      <div className="row d-flex flex-wrap align-items-center">
        <div className="col s2">
          <label
            className="d-block text-center font-weight-bold label"
            htmlFor="txtFilter"
          >
            Pesquisar:{' '}
          </label>
        </div>
        <div className="col s10">
          <div className="input-field">
            <input
              placeholder="Filtro"
              type="text"
              id="txtFilter"
              className="validate"
              value={textFilter}
              onChange={handleTextFilter}
            />
          </div>
        </div>
      </div>

      <div>
        {transactionsArray.map((transactionItem) => {
          return (
            <Transaction
              key={transactionItem._id}
              transactionItem={transactionItem}
              handleTypeAction={handleTypeAction}
            />
          );
        })}
      </div>
    </div>
  );
}
