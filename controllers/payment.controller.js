const db = require("../models");
const { user } = require("../models");
const {
  handlePayslipData,
  getPayslipTemplateData,
} = require("../utils/payslip");
const { formatVNDCurrency } = require("../utils/index");
const Payment = db.payment;
const User = db.user;
const Job = db.job;
const UserFinancialInfo = db.userFinancialInfo;
const UserPersonalInfo = db.userPersonalInfo;
const Department = db.department;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const fs = require("fs");
const path = require("path");
const { PDFDocument, TextAlignment } = require("pdf-lib");
const { sendPayslipToUser } = require("../send-email");

// Create and Save a new Payment
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Payment
  const payment = {
    paymentType: req.body.paymentType,
    paymentMonth: req.body.paymentMonth,
    paymentDate: req.body.paymentDate,
    paymentFine: req.body.paymentFine,
    paymentAmount: req.body.paymentAmount,
    comments: req.body.comments,
    userId: req.body.userId,
  };

  const userData = await User.findOne({
    raw: true,
    nest: true,
    include: [
      {
        model: UserPersonalInfo,
      },
      {
        model: UserFinancialInfo,
      },
      {
        model: Department,
      },
      {
        model: Job,
        include: [
          {
            model: Payment,
          },
        ],
      },
    ],
    where: {
      id: req.body.userId,
    },
  });

  if (!userData) {
    res.status(400).send({
      message: "User Data Not Found!",
    });
    return;
  }
  Payment.create(payment).then(async (data) => {
    const payment = await Payment.findOne({
      where: { id: data.id },
      raw: true,
      nest: true,
      include: [
        {
          model: User,
          include: [
            {
              model: UserPersonalInfo,
            },
            {
              model: UserFinancialInfo,
            },
            {
              model: Department,
            },
            {
              model: Job,
            },
          ],
        },
      ],
    });
    const payslipTemplate = getPayslipTemplateData(payment);

    const readStream = await fs.readFileSync(
      path.resolve("./template/template_payslip.pdf")
    );
    const pdfDoc = await PDFDocument.load(readStream);

    const form = pdfDoc.getForm();
    const fields = pdfDoc
      .getForm()
      .getFields()
      .map((t) => t.getName());

    const payslipForm = handlePayslipData(payslipTemplate);
    for (const item of fields) {
      form.getTextField(item).setText(payslipForm[item]);
      form.getTextField(item).setAlignment(TextAlignment.Right);
      form.getTextField(item).setFontSize(8);
    }

    form.flatten();

    const buffer = await pdfDoc.save();

    const email = userData?.user_personal_info?.emailAddress;
    if (email) {
      sendPayslipToUser(
        email,
        "Payslip",
        {
          company: payslipTemplate?.companyName,
          month: payslipTemplate?.payrollCycle,
          year: "2023",
          employeeName: payslipTemplate?.employeeFullName,
          basicSalary: formatVNDCurrency(payslipTemplate?.contractSalary),
          totalEarnings: formatVNDCurrency(
            payslipTemplate?.paidSalaryThisMonth
          ),
          totalDeductions: formatVNDCurrency(payslipTemplate.personalIncomeTax),
          netPay: formatVNDCurrency(payslipTemplate?.paidSalaryThisMonth),
        },
        buffer
      );
    }

    res.send(data);
  });
};

exports.downloadFile = async (req, res) => {
  const id = req.params.id;
  const payment = await Payment.findOne({
    where: { id: id },
    raw: true,
    nest: true,
    include: [
      {
        model: User,
        include: [
          {
            model: UserPersonalInfo,
          },
          {
            model: UserFinancialInfo,
          },
          {
            model: Department,
          },
          {
            model: Job,
          },
        ],
      },
    ],
  });

  if (!payment) {
    res.status(500).send({
      message: "Not found payment " + id,
    });
    return;
  }

  const payslipTemplate = getPayslipTemplateData(payment);

  const readStream = await fs.readFileSync(
    path.resolve("./template/template_payslip.pdf")
  );
  const pdfDoc = await PDFDocument.load(readStream);

  const form = pdfDoc.getForm();
  const fields = pdfDoc
    .getForm()
    .getFields()
    .map((t) => t.getName());

  const payslipForm = handlePayslipData(payslipTemplate);
  for (const item of fields) {
    form.getTextField(item).setText(payslipForm[item]);
    form.getTextField(item).setAlignment(TextAlignment.Right);
    form.getTextField(item).setFontSize(8);
  }

  form.flatten();

  const buffer = await pdfDoc.save();

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Disposition", 'attachment; filename="payslip.pdf"');
  res.send(Buffer.from(buffer));
};

// Retrieve all Payments from the database.
exports.findAll = (req, res) => {
  Payment.findAll({
    include: [
      {
        model: User,
        include: [
          {
            model: UserFinancialInfo,
          },
          {
            model: UserPersonalInfo,
          },
          {
            model: Department,
          },
          {
            model: Job,
          },
        ],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving departments.",
      });
    });
};

exports.findAllByYear = (req, res) => {
  const year = req.params.id;
  Payment.findAll({
    where: sequelize.where(
      sequelize.fn("YEAR", sequelize.col("payment_month")),
      year
    ),
    attributes: [
      [sequelize.fn("monthname", sequelize.col("payment_month")), "month"],
      [sequelize.fn("sum", sequelize.col("payment_amount")), "expenses"],
    ],
    group: [sequelize.fn("month", sequelize.col("payment_month")), "month"],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving payments.",
      });
    });
};

//Retrieve all Payments By Organization Id
exports.findAllByJobId = (req, res) => {
  const organizationId = req.params.id;

  Payment.findAll({ where: { organizationId: organizationId } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving departments.",
      });
    });
};

// Find a single Payment with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Payment.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Payment with id=" + id,
      });
    });
};

exports.findAllByUser = (req, res) => {
  const id = req.params.id;
  console.log("123123123", id);
  Payment.findAll({
    where: { userId: id },
    include: [
      {
        model: User,
        include: [
          {
            model: UserFinancialInfo,
          },
          {
            model: UserPersonalInfo,
          },
          {
            model: Department,
          },
          {
            model: Job,
          },
        ],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err,
      });
    });
};

// Update an Payment by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Payment.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Payment was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Payment with id=${id}. Maybe Payment was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Payment with id=" + id,
      });
    });
};

// Delete an Payment with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Payment.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Payment was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Payment with id=${id}. Maybe Tutorial was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Payment with id=" + id,
      });
    });
};

// Delete all Payments from the database.
exports.deleteAll = (req, res) => {
  Payment.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Payments were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Payments.",
      });
    });
};

// Delete all Payments by Job Id.
exports.deleteAllByOrgId = (req, res) => {
  const jobId = req.params.id;

  Payment.destroy({
    where: { jobId: jobId },
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Payments were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Payments.",
      });
    });
};
