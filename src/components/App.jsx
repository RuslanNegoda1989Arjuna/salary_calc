import React, { useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import "../index.css"; // CSS у src/

export const App = () => {
  // state
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

  // derived values
  const percentAmount = useMemo(() => (percentValue ? Math.ceil((sum * percentValue) / 100) : 0), [sum, percentValue]);
  const koTrainerSum = useMemo(() => koLessonsCount * costKoTrainer, [koLessonsCount]);
  const costAllMissed = useMemo(() => costOneLesson * missedCount, [costOneLesson, missedCount]);
  const totalIncome = useMemo(() => entries.reduce((acc, e) => acc + e.income, 0), [entries]);

  // handlers
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

  const handleGroupChange = (value) => {
    setGroup(value);
    handleClear(); // очищаємо форму при зміні групи
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

      {/* Група */}
      <div style={{ marginBottom: 12 }}>
        <h2 className="name-group">Група</h2>
        <select className="select-group" value={group} onChange={(e) => handleGroupChange(e.target.value)}>
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

      {/* Відсотки, заняття, ко-тренер */}
      <div style={{ display: "grid", gap: 12 }}>
        {/* Сума */}
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
      </div>

      {/* Побудова таблиць */}
      <div className="wrapper-table">
        {entries.map((entry) => (
          <div key={entry.id} className="entry-table">
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
            <div style={{ marginTop: 8 }}>
              <button onClick={() => handleRemoveEntry(entry.id)} type="button">X</button>
            </div>
          </div>
        ))}
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
