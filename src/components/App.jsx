// src/components/App.jsx
import React, { useState, useMemo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "../index.css";
import groupOptions from "../groups.json"; // імпортуємо JSON зі списком груп

export const App = () => {
  const [group, setGroup] = useState("");
  const [moneyInput, setMoneyInput] = useState("");
  const [sum, setSum] = useState(0);
  const [percentValue, setPercentValue] = useState(0);
  const [costOneLesson, setCostOneLesson] = useState(0);
  const [quantityPerMonth, setQuantityPerMonth] = useState(0);
  const [koLessonsCount, setKoLessonsCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [missedDates, setMissedDates] = useState([]);
  const [koCost, setKoCost] = useState(200);
  const [entries, setEntries] = useState([]);

  // Після завантаження встановимо першу групу
  useEffect(() => {
    if (groupOptions.length > 0) setGroup(groupOptions[0]);
  }, []);

  const percentAmount = useMemo(() => (percentValue ? Math.ceil((sum * percentValue) / 100) : 0), [sum, percentValue]);
  const koTrainerSum = useMemo(() => koLessonsCount * koCost, [koLessonsCount, koCost]);
  const costAllMissed = useMemo(() => costOneLesson * missedCount, [costOneLesson, missedCount]);
  const totalIncome = useMemo(() => entries.reduce((acc, e) => acc + e.income, 0), [entries]);

  const handleCalcSum = () => {
    const nums = moneyInput.split(" ").map((s) => Number.parseInt(s) || 0);
    setSum(nums.reduce((a, b) => a + b, 0));
  };

  const handleClear = () => {
    setMoneyInput("");
    setSum(0);
    setPercentValue(0);
    setCostOneLesson(0);
    setQuantityPerMonth(0);
    setKoLessonsCount(0);
    setMissedCount(0);
    setMissedDates([]);
  };

  const handlePercentChange = (val) => {
    setPercentValue(val);
    if (quantityPerMonth) setCostOneLesson(Math.round(Math.ceil((sum * val) / 100) / quantityPerMonth));
  };

  const handleQuantityChange = (val) => {
    setQuantityPerMonth(val);
    if (val) setCostOneLesson(Math.round(percentAmount / val));
  };

  const handleKoLessonsChange = (val) => setKoLessonsCount(val);

  const handleMissedCountChange = (val) => {
    setMissedCount(val);
    setMissedDates((prev) => {
      const next = [...prev];
      while (next.length < val) next.push("");
      while (next.length > val) next.pop();
      return next;
    });
  };

  const handleMissedDateChange = (index, value) => {
    setMissedDates((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleCreateEntry = () => {
    const id = uuidv4();
    const income = percentAmount + koTrainerSum - costAllMissed;
    const entry = {
      id,
      group,
      percentAmount,
      koTrainerSum,
      missedDates: missedDates.filter(Boolean),
      costOneLesson,
      costAllMissed,
      income,
    };
    setEntries((prev) => [...prev, entry]);
    handleClear();
  };

  const handleDeleteEntry = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="salary-app">
      <h1 className="title">Підрахунок ЗП</h1>

      <div style={{ marginBottom: 12 }}>
        <button className="clean" onClick={() => {handleClear(); setEntries([])}} type="button">
          Очистити форму і таблицю
        </button>
      </div>

      <div className="calc-row">
        <div style={{ flex: 1 }}>
          <label>Сума (через пробіл):</label>
          <input
            className="all-money"
            type="text"
            value={moneyInput}
            onChange={(e) => setMoneyInput(e.target.value)}
            placeholder="100 200 300"
            autoFocus
          />
        </div>
        <div>
          <button className="calc-total" type="button" onClick={handleCalcSum}>
            Додати (порахувати)
          </button>
        </div>
      </div>
      <p className="total">Сума = <span className="total-num">{sum}</span></p>

      <div style={{ marginTop: 12 }}>
        <h2 className="name-group">Група</h2>
        <select
          className="select-group"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          style={{ width: 200 }} // компактне меню
        >
          {groupOptions.map((g, idx) => (
            <option key={idx} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Далі все без змін */}
      <div style={{ marginTop: 12 }}>
        <p>Відсоток кураторських:</p>
        <label style={{ marginRight: 8 }}>
          <input type="radio" name="percent" value="30" checked={percentValue === 30} onChange={() => handlePercentChange(30)} /> 30%
        </label>
        <label>
          <input type="radio" name="percent" value="40" checked={percentValue === 40} onChange={() => handlePercentChange(40)} /> 40%
        </label>
        <p>Кураторські (сума): <strong>{percentAmount}</strong></p>
      </div>

      <div style={{ marginTop: 12 }}>
        <p>Кількість занять в місяці:</p>
        <label style={{ marginRight: 8 }}>
          <input type="radio" name="quantity" value="4" checked={quantityPerMonth === 4} onChange={() => handleQuantityChange(4)} /> 4
        </label>
        <label>
          <input type="radio" name="quantity" value="5" checked={quantityPerMonth === 5} onChange={() => handleQuantityChange(5)} /> 5
        </label>
        <p>Вартість одного заняття = <span className="cost-lesson">{costOneLesson}</span></p>
      </div>

      <div style={{ marginTop: 12 }}>
        <p>Ко-тренерські (сума за заняття):</p>
        <input
          type="number"
          value={koCost}
          onChange={(e) => setKoCost(Number(e.target.value))}
          style={{ width: 100, marginBottom: 6 }}
        />
        <select className="select-ko-lesson" value={koLessonsCount} onChange={(e) => handleKoLessonsChange(Number(e.target.value))}>
          <option value={0}>0 Занять</option>
          <option value={1}>1 Заняття</option>
          <option value={2}>2 Заняття</option>
          <option value={3}>3 Заняття</option>
          <option value={4}>4 Заняття</option>
          <option value={5}>5 Занять</option>
        </select>
        <p>Ко-тренерські = <span className="sum-ko-tr">{koTrainerSum}</span></p>
      </div>

      <div style={{ marginTop: 12 }}>
        <p>Кількість пропусків занять:</p>
        <select className="select-missed-lesson" value={missedCount} onChange={(e) => handleMissedCountChange(Number(e.target.value))}>
          <option value={0}>0 Занять</option>
          <option value={1}>1 Заняття</option>
          <option value={2}>2 Заняття</option>
          <option value={3}>3 Заняття</option>
        </select>

        <div className="wrapper-date">
          {Array.from({ length: missedCount }).map((_, idx) => (
            <label key={idx}>
              Дата пропуску заняття
              <input type="date" className="missed-date" value={missedDates[idx] || ""} onChange={(e) => handleMissedDateChange(idx, e.target.value)} />
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="create-table" type="button" onClick={handleCreateEntry}>Побудувати таблицю</button>
      </div>

      <div className="wrapper-table">
        {entries.map((entry) => (
          <div key={entry.id} className="entry-table">
            <button className="delete-entry" onClick={() => handleDeleteEntry(entry.id)}>×</button>
            <table>
              <thead>
                <tr><th colSpan="2">{entry.group}</th></tr>
              </thead>
              <tbody>
                <tr><td>Кураторські</td><td>{entry.percentAmount}</td></tr>
                <tr><td>Ко-тренерські</td><td>{entry.koTrainerSum}</td></tr>
                {entry.missedDates.map((d, i) => (
                  <tr key={i}><td>Пропуск {formatDateForDisplay(d)}</td><td>{entry.costOneLesson}</td></tr>
                ))}
                <tr><td>Всього:</td><td>{entry.income}</td></tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <p>Загальний дохід: <strong className="total-income">{totalIncome}</strong></p>
      </div>
    </div>
  );
};

function formatDateForDisplay(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const day = d.getDate();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}`;
}

export default App;
