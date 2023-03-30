var path = require("path");

exports.checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
};

 const CURRENCY = {
  vietnam: { languageCode: "vi-VN", currency: "VND", symbol: "VNĐ" },
  cambodia: { languageCode: "kh-KH", currency: "KHR", symbol: "USD" },
  malaysia: { languageCode: "ms-MY", currency: "MYR", symbol: "MYR" },
};

exports.formatVNDCurrency=(amount)=> {
  const currency = CURRENCY["vietnam"];

  const style = currency.symbol ? "decimal" : "currency";

  const fNumber = currency
    ? new Intl.NumberFormat(currency.languageCode, {
        style,

        currency: currency.currency,
      }).format(amount)
    : new Intl.NumberFormat("vi-VN", {
        style,

        currency: "VND",
      }).format(amount);

  return !currency.symbol ? fNumber : `${fNumber} ${currency.symbol}`;
}