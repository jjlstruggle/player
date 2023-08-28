export function parseCount(count: number) {
  const newValue = ["", "", ""];
  let fr = 1000;
  let num = 3;
  let text1 = "";
  let fm = 1;
  while (count / fr >= 1) {
    fr *= 10;
    num += 1;
  }
  if (num <= 4) {
    // 千
    newValue[0] = Math.floor(count / 1000) + "";
    newValue[1] = "千";
  } else if (num <= 8) {
    // 万
    text1 = Math.floor(num - 4) / 3 > 1 ? "千万" : "万";
    fm = text1 === "万" ? 10000 : 10000000;
    if (count % fm === 0) {
      newValue[0] = Math.floor(count / fm) + "";
    } else {
      newValue[0] = (count / fm).toFixed(2) + "";
    }
    newValue[1] = text1;
  } else if (num <= 16) {
    // 亿
    text1 = (num - 8) / 3 > 1 ? "千亿" : "亿";
    text1 = (num - 8) / 4 > 1 ? "万亿" : text1;
    text1 = (num - 8) / 7 > 1 ? "千万亿" : text1;
    fm = 1;
    if (text1 === "亿") {
      fm = 100000000;
    } else if (text1 === "千亿") {
      fm = 100000000000;
    } else if (text1 === "万亿") {
      fm = 1000000000000;
    } else if (text1 === "千万亿") {
      fm = 1000000000000000;
    }
    if (count % fm === 0) {
      newValue[0] = Math.floor(count / fm) + "";
    } else {
      newValue[0] = (count / fm).toFixed(2) + "";
    }
    newValue[1] = text1;
  }
  if (count < 1000) {
    newValue[0] = count + "";
    newValue[1] = "";
  }
  return newValue.join("");
}

export function parseIndex(num: number) {
  return num < 10 ? "0" + num : "" + num;
}

export function parseTimeToString(time: number) {
  let m,
    s,
    _time = parseInt(String(time));
  if (_time % 60 === 0) {
    return parseIndex(_time / 60) + ":00";
  } else {
    m = parseInt((_time / 60) as unknown as string);
    s = _time - 60 * m;
    return parseIndex(m) + ":" + parseIndex(s);
  }
}
