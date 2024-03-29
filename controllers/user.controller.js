const db = require("../models");
const User = db.user;
const UserPersonalInfo = db.userPersonalInfo;
const UserFinancialInfo = db.userFinancialInfo;
const Department = db.department;
const Job = db.job;
const Payment = db.payment;
const Op = db.Sequelize.Op;
var path = require("path");

const bcrypt = require("bcrypt");
const upload = require("../upload");
const { sendMailChangePassword } = require("../send-email");

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  let hash = null;
  if (req.body.password) {
    hash = bcrypt.hashSync(req.body.password.toString(), 10);
  }

  // Create a User
  const user = {
    username: req.body.username,
    password: hash,
    fullName: req.body.fullname,
    role: req.body.role,
    active: true,
    departmentId: req.body.departmentId,
  };

  // Save User in the database
  User.findOne({
    where: { username: user.username },
  }).then((userExists) => {
    if (!userExists) {
      User.create(user)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User.",
          });
        });
    } else {
      res.status(403).send({
        message: "Username already exists",
      });
    }
  });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  User.findAll({
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
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the Users.",
      });
    });
};

// Retrieve all Users from the database.
exports.findTotal = (req, res) => {
  User.count()
    .then((data) => {
      res.send(data.toString());
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the Users.",
      });
    });
};

// Retrieve all Users from the database.
exports.findTotalByDept = (req, res) => {
  const id = req.params.id;

  User.count({
    where: { departmentId: id },
  })
    .then((data) => {
      res.send(data.toString());
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the Users.",
      });
    });
};

// Retrieve all Users by Department Id
exports.findAllByDeptId = (req, res) => {
  const departmentId = req.params.id;

  User.findAll({
    where: { departmentId: departmentId },
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
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving the Users from the Organization wiht Id:" +
            organizationId,
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findOne({
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
      id: id,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  if (req.body.password) {
    req.body.password = bcrypt(req.body.password, 10);
  }

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe Organization was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

exports.changePassword = (req, res) => {
  const id = req.params.id;

  if (!req.body.oldPassword || !req.body.newPassword) {
    res.status(400).send({
      message: "Please send oldPassword and newPassword!",
    });
    return;
  }

  User.findOne({
    where: { id: id },
    nest: true,
    raw: true,
    include: [
      {
        model: UserPersonalInfo,
      },
    ],
  }).then(async (user) => {
    if (user) {
      console.log(user);
      const email = user?.user_personal_info?.emailAddress;
      if (!email) {
        res.status(400).send({
          message: "You need to setup email in your account",
        });
        return;
      }

      if (bcrypt.compareSync(req.body.oldPassword, user.password)) {
        let hash = bcrypt.hashSync(req.body.newPassword, 10);
        console.log("hash", hash);
        let data = {
          password: hash,
        };
        await Promise.all([
          User.update(data, {
            where: { id: id },
          })
            .then(async (num) => {
              if (num == 1) {
                res.status(200).send({
                  message: "User was updated successfully.",
                });
              } else {
                res.send({
                  message: `Cannot update User with id=${id}. Maybe Organization was not found or req.body is empty!`,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send({
                message: "Error updating User with id=" + id,
              });
            }),
          sendMailChangePassword(email, "Change Password", {
            name: user.fullName,
          }),
        ]);
      } else {
        res.status(400).send({
          message: "Wrong Password",
        });
      }
    } else {
      res.status(400).send({
        message: "No such user!",
      });
    }
  });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe Tutorial was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Users.",
      });
    });
};

exports.deleteAllByDeptId = (req, res) => {
  const departmentId = req.params.id;

  User.destroy({
    where: { departmentId: departmentId },
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message:
          `${nums} Users of Organizations with id: ` +
          organizationId +
          ` were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Users.",
      });
    });
};

exports.uploadAvatar = (req, res) => {
  const id = req.params.id;

  upload(req, res, async (err) => {
    if (err) {
      res.status(400).send({ message: err });
    } else {
      if (req.file === undefined) {
        res.status(400).send({ message: "No file selected" });
      } else {
        await User.update(
          {
            avatar: req.file.filename,
          },
          {
            where: { id: id },
          }
        );

        res.status(200).send({
          message: "Avatar uploaded successfully",
          file: `uploads/${req.file.filename}`,
        });
      }
    }
  });
};

exports.getAvatar = async (req, res) => {
  // const file = req.params.filename;
  const id = req.params.id;

  const user = await User.findOne({
    where: { id: id },
    raw: true,
    nest: true,
  });

  if (!user) {
    res.status(400).send({ message: "Not found user " + id });
    return;
  }

  const file = user?.avatar;

  if (!file) {
    res.status(400).send({ message: "Not found avatar" });
    return;
  }

  const filePath = path.join(__dirname, "../uploads", file);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(400).send({ message: "Error retrieving file" + err.message });
    }
  });
};
