/**
 * slot-dice-decoder.js
 *
 * Декодирует числовое значение Telegram Dice (1–64)
 * в комбинацию символов на трёх барабанах слот-машины.
 *
 * Никаких зависимостей. Никакого DOM. Только чистая математика.
 */

// Четыре возможных символа на каждом барабане.
// Порядок важен — он соответствует base-4 кодировке Telegram.
const SLOT_VALS = ['BAR', 'GRP', 'LEM', '777']; // BAR GRAPE LEMON 777

/**
 * Декодирует значение Telegram Dice в массив из трёх символов барабанов.
 *
 * Telegram кодирует результат слота как число от 1 до 64.
 * Внутри — это трёхзначное число в системе счисления с основанием 4 (base-4),
 * где каждый "разряд" — это индекс символа на одном барабане.
 *
 * Алгоритм:
 *   1. Вычитаем 1 → получаем диапазон [0, 63]
 *   2. Берём остаток от деления на 4 → индекс символа барабана
 *   3. Целочисленно делим на 4 → переходим к следующему барабану
 *   4. Повторяем 3 раза
 *
 * @param {number} diceValue - Целое число от 1 до 64 (значение Telegram Dice)
 * @returns {string[]} Массив из 3 символов: [барабан1, барабан2, барабан3]
 *
 * @example
 * decodeDice(1)  // → ['BAR', 'BAR', 'BAR']
 * decodeDice(22) // → ['GRP', 'GRP', 'GRP']
 * decodeDice(43) // → ['LEM', 'LEM', 'LEM']
 * decodeDice(64) // → ['777', '777', '777']
 * decodeDice(2)  // → ['GRP', 'BAR', 'BAR']
 */
function decodeDice(diceValue) {
    let n = diceValue - 1;
    const reels = [];

    for (let i = 0; i < 3; i++) {
        reels.push(SLOT_VALS[n % 4]);
        n = Math.floor(n / 4);
    }

    return reels; // [барабан1, барабан2, барабан3]
}

/**
 * Возвращает все 64 возможных комбинации барабанов.
 * Удобно для проверки и отладки.
 *
 * @returns {Array<{diceValue: number, reels: string[]}>}
 *
 * @example
 * getAllCombinations();
 * // [
 * //   { diceValue: 1,  reels: ['BAR','BAR','BAR'] },
 * //   { diceValue: 2,  reels: ['GRP','BAR','BAR'] },
 * //   ...
 * //   { diceValue: 64, reels: ['777','777','777'] },
 * // ]
 */
function getAllCombinations() {
    return Array.from({ length: 64 }, (_, i) => ({
        diceValue: i + 1,
        reels: decodeDice(i + 1),
    }));
}

/**
 * Ищет значение dice по заданной комбинации барабанов.
 * Полезно при отладке — "какое число даёт эту комбинацию?".
 *
 * @param {string} r1 - Символ барабана 1
 * @param {string} r2 - Символ барабана 2
 * @param {string} r3 - Символ барабана 3
 * @returns {number|null} Значение dice или null если комбинация невозможна
 *
 * @example
 * findDiceValue('777', '777', '777') // → 64
 * findDiceValue('BAR', 'BAR', 'BAR') // → 1
 * findDiceValue('BAR', 'GRP', 'LEM') // → null (такой комбинации нет)
 */
function findDiceValue(r1, r2, r3) {
    const target = [r1, r2, r3].join(',');
    for (let v = 1; v <= 64; v++) {
        if (decodeDice(v).join(',') === target) return v;
    }
    return null;
}

// ─── Экспорт ──────────────────────────────────────────────────────────────────

// Node.js / CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SLOT_VALS, decodeDice, getAllCombinations, findDiceValue };
}

// ES Modules
// export { SLOT_VALS, decodeDice, getAllCombinations, findDiceValue };