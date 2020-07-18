export default (str: string) => {
  let newStr = str;
  if (str.includes(".")) {
    let number = 0;
    for (let letra of str) {
      if (letra == ".") number++;
    }

    for (let i = 0; i < number; i++) {
      newStr = newStr.replace(".", "@e8salg");
    }

    return encodeURIComponent(newStr);
  } else {
    return encodeURIComponent(str);
  }
};
