# 🎰 Telegram Dice Decoder

Декодирует числовое значение Telegram Dice (1–64) в комбинацию символов на трёх барабанах слот-машины

---

## Как Telegram кодирует результат

Каждый барабан может показать один из **4 символов**:

| Индекс | Код   | Символ      |
|--------|-------|-------------|
| 0      | `BAR` | BAR         |
| 1      | `GRP` | Виноград 🍇 |
| 2      | `LEM` | Лимон 🍋    |
| 3      | `777` | Семёрка 7️⃣  |

Три барабана × 4 символа = **4³ = 64 возможных комбинации** — отсюда диапазон 1–64.

Число кодируется как **трёхзначное число в системе счисления с основанием 4 (base-4)**:

```
dice_value - 1  →  [индекс барабана 1, индекс барабана 2, индекс барабана 3]
```

### Алгоритм декодирования

```
n = dice_value - 1

барабан 1 = SLOT_VALS[ n % 4 ];      n = floor(n / 4)
барабан 2 = SLOT_VALS[ n % 4 ];      n = floor(n / 4)
барабан 3 = SLOT_VALS[ n % 4 ]
```

### Разбор примеров

**`dice_value = 1` → BAR BAR BAR**
```
n = 0
0 % 4 = 0 → BAR,   0 / 4 = 0
0 % 4 = 0 → BAR,   0 / 4 = 0
0 % 4 = 0 → BAR
Результат: ['BAR', 'BAR', 'BAR']
```

**`dice_value = 64` → 777 777 777 (ДЖЕКПОТ)**
```
n = 63
63 % 4 = 3 → 777,   63 / 4 = 15
15 % 4 = 3 → 777,   15 / 4 = 3
 3 % 4 = 3 → 777
Результат: ['777', '777', '777']
```

**`dice_value = 5` → BAR GRP BAR**
```
n = 4
4 % 4 = 0 → BAR,   4 / 4 = 1
1 % 4 = 1 → GRP,   1 / 4 = 0
0 % 4 = 0 → BAR
Результат: ['BAR', 'GRP', 'BAR']
```

---

## Установка

Скопируйте `telegram-l.js` в проект. Ничего устанавливать не нужно.

```js
// Node.js
const { decodeDice } = require('./telegram-l');

// Браузер
// <script src="telegram-l.js"></script>
```

---

### `decodeDice(diceValue)` → `string[]`

Основная функция. Принимает число от 1 до 64, возвращает массив из 3 символов.

```js
decodeDice(1);   // → ['BAR', 'BAR', 'BAR']
decodeDice(22);  // → ['GRP', 'GRP', 'GRP']
decodeDice(43);  // → ['LEM', 'LEM', 'LEM']
decodeDice(64);  // → ['777', '777', '777']
decodeDice(2);   // → ['GRP', 'BAR', 'BAR']
```

---

### `getAllCombinations()` → `Array`

Возвращает все 64 возможных комбинации. Удобно для отладки и построения таблицы выплат.

```js
getAllCombinations();
// [
//   { diceValue: 1,  reels: ['BAR', 'BAR', 'BAR'] },
//   { diceValue: 2,  reels: ['GRP', 'BAR', 'BAR'] },
//   ...
//   { diceValue: 64, reels: ['777', '777', '777'] },
// ]
```

---

### `findDiceValue(r1, r2, r3)` → `number | null`

Обратная операция — найти число dice по комбинации символов.

```js
findDiceValue('777', '777', '777');  // → 64
findDiceValue('BAR', 'BAR', 'BAR');  // → 1
findDiceValue('GRP', 'GRP', 'GRP');  // → 22
findDiceValue('LEM', 'LEM', 'LEM');  // → 43
findDiceValue('BAR', 'GRP', 'LEM');  // → null (такой комбинации нет)
```

---

## Все выигрышные комбинации

Из 64 вариантов только 4 дают три одинаковых символа:

| dice_value | Барабаны        |
|------------|-----------------|
| `1`        | BAR · BAR · BAR |
| `22`       | GRP · GRP · GRP |
| `43`       | LEM · LEM · LEM |
| `64`       | 777 · 777 · 777 |

Проверить самостоятельно:
```js
const wins = getAllCombinations()
    .filter(({ reels }) => reels[0] === reels[1] && reels[1] === reels[2]);

console.log(wins);
// [
//   { diceValue: 1,  reels: ['BAR','BAR','BAR'] },
//   { diceValue: 22, reels: ['GRP','GRP','GRP'] },
//   { diceValue: 43, reels: ['LEM','LEM','LEM'] },
//   { diceValue: 64, reels: ['777','777','777'] },
// ]
```
