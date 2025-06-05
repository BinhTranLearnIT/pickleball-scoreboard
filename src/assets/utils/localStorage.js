export const loadState = () => {
  try {
    const serialized = localStorage.getItem("pickleball");
    return serialized ? JSON.parse(serialized) : undefined;
  } catch {
    return undefined;
  }
};

export const saveState = debounce((state) => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem("pickleball", serialized);
  } catch (err) {
    console.error("Save error", err);
  }
}, 500);

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}
