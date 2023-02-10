exports.handlePayslipData = (payslipInformation) => {
  const keys = Object.keys(payslipInformation);
  let formData = {};
  for (const item of keys) {
    switch (item) {
      case "companyName":
      case "payrollCycle":
      case "employeeFullName":
      case "departmentName":
      case "employeeCode":
        formData = {
          ...formData,
          [item]: payslipInformation[item]
            ? payslipInformation[item].toString()
            : "null",
        };
        break;
      case "contractSalary":
      case "standardDays":
      case "paidDay":
      case "totalOTHoursLastMonth":
      case "totalOTPayCurrentMonth":
      case "numberOfDependents":
      case "personalAndDependentDeduction":
      case "paidSalaryThisMonth":
      case "phoneAllowance":
      case "covidSupport":
      case "bonusSalary":
      case "bonus":
      case "otherPayment":
      case "taxableOTPayment":
      case "severanceAllowance":
      case "nonTaxableAdjustment":
      case "nonTaxableOTPayment":
      case "totalNonTaxable":
      case "socialInsurance":
      case "medicalInsurance":
      case "unemploymentInsurance":
      case "tradeUnion":
      case "personalIncomeTax":
      case "PITRefundYear":
      case "paidToEmployeeAccount":
        formData = {
          ...formData,
          [item]:
            payslipInformation[item] === null
              ? "0"
              : payslipInformation[item].toLocaleString(),
        };
        break;
      default:
        formData = { ...formData, [item]: "null default" };
        break;
    }
  }

  return formData;
};

exports.getPayslipTemplateData = (payslipInformation) => {
  console.log(payslipInformation);
  const { fullName, id, department } = payslipInformation?.user ?? {};

  const user_financial_info = payslipInformation?.user.user_financial_info;
  const salaryBasic = user_financial_info.salaryBasic;
  console.log("user_financial_info", user_financial_info);
  return {
    payrollCycle: "October 2023",
    companyName: "SAS Company",
    employeeFullName: removeAccents(fullName),
    employeeCode: "EMP" + id,
    departmentName: department?.departmentName,
    contractSalary: salaryBasic,
    standardDays: 0,
    paidDay: 0,
    totalOTHoursLastMonth: 0,
    totalOTPayCurrentMonth: 0,
    numberOfDependents: 0,
    personalAndDependentDeduction: salaryBasic - calculateSocial(salaryBasic),
    paidSalaryThisMonth: user_financial_info.salaryGross,
    phoneAllowance: 0,
    covidSupport: 0,
    bonusSalary: 0,
    bonus: 0,
    otherPayment: 0,
    taxableOTPayment: 0,
    severanceAllowance: 0,
    nonTaxableAdjustment: 0,
    nonTaxableOTPayment: 0,
    totalNonTaxable: 0,
    socialInsurance: calculateSocialInsurance(salaryBasic),
    medicalInsurance: calculateMedicalInsurance(salaryBasic),
    unemploymentInsurance: calculateUnemploymentInsurance(salaryBasic),
    tradeUnion: 0,
    personalIncomeTax: calculateIncomeTax(salaryBasic),
    PITRefundYear: 0,
    paidToEmployeeAccount: user_financial_info.salaryNet,
  };
};

function removeAccents(str) {
  var AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ",
    "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ",
  ];
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
    var char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
}

function calculateSocialInsurance(salary) {
  return salary * 0.08;
}

function calculateMedicalInsurance(salary) {
  return salary * 0.015;
}

function calculateTradeUnionFee(salary) {
  return salary * 0.01;
}

function calculateUnemploymentInsurance(salary) {
  return salary * 0.001;
}

function calculateSocial(salary) {
  return (
    calculateSocialInsurance(salary) +
    calculateMedicalInsurance(salary) +
    calculateTradeUnionFee(salary) +
    calculateUnemploymentInsurance(salary)
  );
}

function calculateIncomeTax(salary) {
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
