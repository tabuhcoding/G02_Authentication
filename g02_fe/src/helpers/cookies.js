import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const setCookie = (name, value, days) => {
  cookies.set(name, value, {
    path: '/', // Phạm vi áp dụng cookie
    maxAge: days * 24 * 60 * 60, // Thời gian sống (giây)
    secure: window.location.protocol === 'https:', // Chỉ cho phép qua HTTPS nếu có
    sameSite: 'none', // Hỗ trợ cross-origin cookies
  });
};

export const getCookie = (name) => {
  return cookies.get(name);
};

export const deleteCookie = (name) => {
  cookies.remove(name);
}