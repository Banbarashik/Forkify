import { TIMEOUT_SEC } from './config';

const rejectRequest = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request was rejected after ${s * 1000} seconds`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, recipe = undefined) {
  try {
    const fetchPRO = recipe
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(recipe),
        })
      : fetch(url);

    const res = await Promise.race([fetchPRO, rejectRequest(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (err) {
    throw err;
  }
};

/*
export const getJSON = async function (url) {
  try {
    // const fetchAPIData = fetch(url);
    const res = await Promise.race([fetch(url), rejectRequest(TIMEOUT_SEC)]);
    console.log(res);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, recipe) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (err) {
    throw err;
  }
};
*/
