export const getData = () => {
  const data = [];
  const now = Date.now();
  const minute = 60 * 1000;

  // Генерируем 100 точек (по одной в минуту)
  for (let i = 0; i < 100; i++) {
    data.push({
      // Идем от прошлого к настоящему
      timestamp: now - (100 - i) * minute,
      cost: Math.floor(Math.random() * 100) + 50 // Случайное число 50-150
    });
  }
  return data;
};
