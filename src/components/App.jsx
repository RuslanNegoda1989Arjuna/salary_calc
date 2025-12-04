// src/components/App.jsx
import React, { useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import "../../index.css"; // шлях до index.css у src

export const App = () => {
  const [group, setGroup] = useState("Пн 17:00");
  const [moneyInput, setMoneyInput] = useState("");
  const [sum, setSum] = useState(0);
  const [percentValue, setPercentValue] = useState(0);
  const [costOneLesson, setCostOneLesson] = useState(0);
  const [quantityPerMonth, setQuantityPerMonth] = useState(0);
  const [koLessonsCount, setKoLessonsCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [missedDates, setMissedDates] = useState([]);
  const [entries, setEntries] = useState([]);
  const costKoTrainer = 200;

  const percentAmount = useMemo(() => (percentValue ? Math.ceil((sum * percentValue) / 100) : 0), [sum, percentValue]);
  const koTrainerSum = useMemo(() => koLessonsCount * costKoTrainer, [koLessonsCount]);
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
    setEntries([]);
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
  };

  const handleRemoveEntry = (id) => setEntries((prev) => prev.filter((e) => e.id !== id));

  return (
    <div className="salary-app" style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1 className="title">Підрахунок ЗП</h1>

      <div style={{ marginBottom: 12 }}>
        <button className="clean" onClick={handleClear} type="button">
          Очистити форму і таблицю
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 12, alignItems: "end" }}>
        <div>
          <label>Сума (через пробіл):</label>
          <input
            className="all-money"
            type="text"
            value={moneyInput}
            onChange={(e) => setMoneyInput(e.target.value)}
            placeholder="100 200 300"
            style={{ width: "100%", padding: 8, marginTop: 6 }}
            autoFocus
          />
        </div>
        <div>
          <button className="calc-total" type="button" onClick={handleCalcSum} style={{ padding: "8px 12px" }}>
            Додати (порахувати)
          </button>
          <p className="total">Сума = <span className="total-num">{sum}</span></p>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h2 className="name-group">Група</h2>
        <select className="select-group" value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="Пн 17:00">Пн 17:00</option>
          <option value="Вт 15:30">Вт 15:30</option>
          <option value="Вт 18:00">Вт 18:00</option>
          <option value="Ср 18:00">Ср 18:00</option>
          <option value="Чт 15:30">Чт 15:30</option>
          <option value="Сб 11:30">Сб 11:30</option>
          <option value="Сб 14:00">Сб 14:00</option>
          <option value="Сб 17:00">Сб 17:00</option>
        </select>
      </div>

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
        <p>Ко-тренерські:</p>
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

        <div className="wrapper-date" style={{ marginTop: 8 }}>
          {Array.from({ length: missedCount }).map((_, idx) => (
            <label key={idx} style={{ display: "block", marginBottom: 6 }}>
              Дата пропуску заняття
              <input type="date" className="missed-date" value={missedDates[idx] || ""} onChange={(e) => handleMissedDateChange(idx, e.target.value)} style={{ marginLeft: 8 }} />
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="create-table" type="button" onClick={handleCreateEntry}>Побудувати таблицю</button>
      </div>

      <div className="wrapper-table" style={{ marginTop: 18 }}>
        {entries.map((entry) => (
          <div key={entry.id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 10 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
            <div style={{ marginTop: 8 }}>
              <button onClick={() => handleRemoveEntry(entry.id)} type="button">X</button>
            </div>
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
