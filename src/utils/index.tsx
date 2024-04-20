export const setLocalStore = (key: string, value: any) => {
  if (typeof window !== "undefined") {
    // Your client-side code that uses window goes here
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getLocalStore = (key: string) => {
  if (typeof window !== "undefined") {
    const data = window.localStorage.getItem(key);
    if (!data) return null;

    return JSON.parse(data);
  }
};
