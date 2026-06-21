import { useMemo, useState } from "react";
import {
  allUnitKeys,
  measurementProfiles,
  unitMeta,
  type MeasurementProfile,
  type UnitKey,
} from "./data/measurementProfiles";
import { breakdownSqft, canUseUnit, fromSqft, toSqft } from "./lib/area";
import { formatNumber } from "./lib/format";

type AppMode = "calculator" | "info";

const defaultInputProfile = measurementProfiles[0];

function getSourceBadge(profile: MeasurementProfile) {
  if (profile.sourceStatus === "source-backed") return "Source-backed";
  if (profile.sourceStatus === "regional-common") return "Regional";
  return "Needs sources";
}

function App() {
  const [mode, setMode] = useState<AppMode>("calculator");
  const [inputValue, setInputValue] = useState("1");
  const [fromUnit, setFromUnit] = useState<UnitKey>("decimal");
  const [inputProfileId, setInputProfileId] = useState(defaultInputProfile.id);

  const inputProfile =
    measurementProfiles.find((profile) => profile.id === inputProfileId) ?? defaultInputProfile;

  const parsedValue = Number(inputValue);

  const calculation = useMemo(() => {
    if (!inputValue.trim()) {
      return { sqft: null, error: "Enter a land area value." };
    }

    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      return { sqft: null, error: "Enter a valid positive number." };
    }

    try {
      return { sqft: toSqft(parsedValue, fromUnit, inputProfile), error: null };
    } catch (error) {
      return {
        sqft: null,
        error: error instanceof Error ? error.message : "Could not calculate the area.",
      };
    }
  }, [fromUnit, inputProfile, inputValue, parsedValue]);

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Bangladesh land measurement</p>
          <h1>Land Area Calculator</h1>
          <p className="hero-copy">
            Convert land area using standard and regional Bangladesh measurement systems. Results are grouped so
            conflicting local rules stay visible.
          </p>
        </div>

        <div className="mode-switch" aria-label="App mode">
          <button
            className={mode === "calculator" ? "active" : ""}
            onClick={() => setMode("calculator")}
            type="button"
          >
            Calculator
          </button>
          <button className={mode === "info" ? "active" : ""} onClick={() => setMode("info")} type="button">
            Info
          </button>
        </div>
      </section>

      {mode === "calculator" ? (
        <CalculatorMode
          inputValue={inputValue}
          setInputValue={setInputValue}
          fromUnit={fromUnit}
          setFromUnit={setFromUnit}
          inputProfileId={inputProfileId}
          setInputProfileId={setInputProfileId}
          inputProfile={inputProfile}
          sqft={calculation.sqft}
          error={calculation.error}
        />
      ) : (
        <InfoMode />
      )}
    </main>
  );
}

type CalculatorModeProps = {
  inputValue: string;
  setInputValue: (value: string) => void;
  fromUnit: UnitKey;
  setFromUnit: (unit: UnitKey) => void;
  inputProfileId: string;
  setInputProfileId: (id: string) => void;
  inputProfile: MeasurementProfile;
  sqft: number | null;
  error: string | null;
};

function CalculatorMode({
  inputValue,
  setInputValue,
  fromUnit,
  setFromUnit,
  inputProfileId,
  setInputProfileId,
  inputProfile,
  sqft,
  error,
}: CalculatorModeProps) {
  const selectedUnitAvailable = canUseUnit(inputProfile, fromUnit);

  return (
    <>
      <section className="calculator-card">
        <div className="field-grid">
          <label>
            <span>Area value</span>
            <input
              inputMode="decimal"
              min="0"
              type="number"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Example: 1"
            />
          </label>

          <label>
            <span>Input unit</span>
            <select value={fromUnit} onChange={(event) => setFromUnit(event.target.value as UnitKey)}>
              {allUnitKeys.map((unit) => (
                <option key={unit} value={unit}>
                  {unitMeta[unit].label} / {unitMeta[unit].labelBn}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Input measurement rule</span>
            <select value={inputProfileId} onChange={(event) => setInputProfileId(event.target.value)}>
              {measurementProfiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="input-note">
          <strong>Input basis:</strong> {inputProfile.subtitle}
        </div>

        {!selectedUnitAvailable && (
          <div className="warning">
            This input rule does not define <strong>{unitMeta[fromUnit].label}</strong>. Choose a matching rule or
            use Decimal, Shotangsho, square feet, square meter, or Acre.
          </div>
        )}

        {error && <div className="warning">{error}</div>}
      </section>

      {sqft !== null && (
        <>
          <section className="summary-grid">
            <SummaryCard label="Decimal / Shotangsho" value={formatNumber(sqft / 435.6)} />
            <SummaryCard label="Square feet" value={formatNumber(sqft, 2)} />
            <SummaryCard label="Square meter" value={formatNumber(sqft / 10.7639104167097)} />
            <SummaryCard label="Acre" value={formatNumber(sqft / 43560, 6)} />
          </section>

          <section className="results-section">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">Grouped results</p>
                <h2>Different measurement systems</h2>
              </div>
              <p className="muted">Standard/common group appears first.</p>
            </div>

            <div className="profile-grid">
              {measurementProfiles.map((profile) => (
                <ProfileResultCard key={profile.id} profile={profile} sqft={sqft} />
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="summary-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function ProfileResultCard({ profile, sqft }: { profile: MeasurementProfile; sqft: number }) {
  const breakdown = breakdownSqft(sqft, profile);

  return (
    <article className={`profile-card ${profile.kind}`}>
      <div className="profile-card-header">
        <div>
          <span className="badge">{getSourceBadge(profile)}</span>
          <h3>{profile.title}</h3>
          <p>{profile.subtitle}</p>
        </div>
      </div>

      <div className="unit-result-list">
        {profile.highlightedUnits.map((unit) => {
          const value = fromSqft(sqft, unit, profile);
          return (
            <div className="unit-result" key={unit}>
              <span>
                {unitMeta[unit].label}
                <small>{unitMeta[unit].labelBn}</small>
              </span>
              <strong>{formatNumber(value)}</strong>
            </div>
          );
        })}
      </div>

      <div className="breakdown">
        <span className="breakdown-title">Traditional breakdown</span>
        <div className="breakdown-parts">
          {breakdown.map((part) => (
            <span key={part.unit}>
              <strong>{formatNumber(part.value, part.isRemainder ? 3 : 0)}</strong> {unitMeta[part.unit].shortLabel}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function InfoMode() {
  return (
    <section className="info-layout">
      <article className="info-card large">
        <p className="eyebrow">Data model</p>
        <h2>Why grouped results?</h2>
        <p>
          Bangladesh land measurement is not always uniform. A Bigha may be treated as 33 Decimal in one context and
          30 Decimal in another. Kani also appears with multiple formulas. This app keeps those differences visible by
          grouping calculations into measurement profiles.
        </p>
        <p>
          The app currently uses square feet as the internal base unit. Every input is converted to square feet first,
          then converted into each selected measurement profile.
        </p>
      </article>

      <div className="profile-table">
        {measurementProfiles.map((profile) => (
          <article className="info-card" key={profile.id}>
            <div className="profile-card-header compact">
              <span className="badge">{getSourceBadge(profile)}</span>
              <h3>{profile.title}</h3>
            </div>
            <ul>
              {profile.assumptions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <article className="info-card large">
        <h2>Accuracy note</h2>
        <p>
          This tool is for calculation assistance. Legal, registry, mutation, inheritance, tax, survey, or purchase
          decisions should be checked against official records and by a qualified land professional.
        </p>
      </article>
    </section>
  );
}

export default App;
