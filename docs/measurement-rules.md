# Measurement Rules

## Purpose

This document defines the first source-of-truth rules for the Bangladesh Land Area Calculator.

The app is intentionally designed around **profiles**, because land measurement values vary by region and context.

## Internal base unit

The app uses:

```text
1 square foot
```

as the internal base unit.

Every unit conversion is reduced to square feet first, then converted into the requested output unit.

## Core units

The current core units use the following formulas:

```text
1 Decimal = 1 Shotangsho = 435.6 square feet
1 Acre = 100 Decimal = 43,560 square feet
1 square meter = 10.7639104167 square feet
```

## Measurement profiles

### 1. Standard/Common 33-decimal Bigha

```text
1 Bigha = 33 Decimal
20 Katha = 1 Bigha
1 Katha = 1.65 Decimal
```

This is shown first because it appears in the Ministry of Land PDF and is widely used as a standard/common reference.

### 2. Regional 30-decimal Bigha

```text
1 Bigha = 30 Decimal
20 Katha = 1 Bigha
1 Katha = 1.5 Decimal
```

This is included because many local/regional uses treat 30 Shotangsho/Decimal as 1 Bigha.

### 3. 40-decimal Kani

```text
1 Kani = 40 Decimal
1 Kani = 20 Gonda
1 Gonda = 4 Kora
1 Kora = 3 Kranti
1 Kranti = 20 Til
```

The PDF includes formulas that reference 40 Shotok/Kani in one section.

### 4. 120-decimal Kani

```text
1 Kani = 120 Decimal
1 Kani = 20 Gonda
1 Gonda = 4 Kora
1 Kora = 3 Kranti
1 Kranti = 20 Til
```

The PDF also lists `120 Decimal = 1 Kani`, so this is kept as a separate profile rather than merged with the 40-decimal Kani rule.

### 5. 8-hat-nol Kani

```text
1 Kani = 17,280 square feet
1 Kani = 20 Gonda
1 Gonda = 4 Kora
1 Kora = 3 Kranti/Kontho
1 Kranti = 20 Til
```

The PDF includes this as an 8-hat-nol measurement formula.

## Known conflicts from the source

The source PDF includes formulas that do not perfectly agree with each other.

Example:

```text
1 Bigha = 33 Decimal
1 Decimal = 435.6 square feet
Therefore, 1 Bigha = 14,374.8 square feet
```

But the same source also includes:

```text
1 Bigha = 14,400 square feet
```

The difference is small but real. The app preserves these as transparent assumptions instead of silently forcing one answer.

## Legal disclaimer

This app is for calculation assistance and educational use. Land purchase, mutation, inheritance, dispute, tax, registry, or survey work should be verified against official records and by a qualified land professional/surveyor.
