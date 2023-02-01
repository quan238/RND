export function calculateSocialInsurance(salary) {
  return salary * 0.08;
}

export function calculateMedicalInsurance(salary) {
  return salary * 0.015;
}

export function calculateTradeUnionFee(salary) {
  return salary * 0.01;
}

export function calculateUnemploymentInsurance(salary) {
  return salary * 0.001;
}

export function calculateSocial(salary) {
  return (
    calculateSocialInsurance(salary) +
    calculateMedicalInsurance(salary) +
    calculateTradeUnionFee(salary) +
    calculateUnemploymentInsurance(salary)
  );
}

export function calculateIncomeTax(salary) {
  let taxableIncome = salary - calculateSocial(salary);
  let taxAmount = 0;

  if (taxableIncome <= 5000000) {
    taxAmount = taxableIncome * 0.05;
  } else if (taxableIncome <= 10000000) {
    taxAmount = taxableIncome * 0.1 - 250000;
  } else if (taxableIncome <= 18000000) {
    taxAmount = taxableIncome * 0.15 - 750000;
  } else if (taxableIncome <= 32000000) {
    taxAmount = taxableIncome * 0.2 - 1650000;
  } else if (taxableIncome <= 52000000) {
    taxAmount = taxableIncome * 0.25 - 3250000;
  } else if (taxableIncome <= 80000000) {
    taxAmount = taxableIncome * 0.3 - 5850000;
  } else {
    taxAmount = taxableIncome * 0.35 - 9850000;
  }

  return taxAmount;
}

export function formatVNDCurrency(amount) {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export function formatCurrency(amount) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
