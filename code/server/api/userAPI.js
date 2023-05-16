const UserManager = require("../bin/controller/UserManager");

const types = [
	"administrator",
	"manager",
	"customer",
	"supplier",
	"clerk",
	"qualityEmployee",
	"deliveryEmployee",
];

const { validationResult } = require("express-validator");

exports.getUserInfo = async function (req, res) {
	//returns current user information
	return res.status(200).json();
};

exports.getSuppliers = async function (req, res) {
	await UserManager.getAllSuppliers().then(
		(suppliers) => {
			const suppAPI = suppliers.map((s) => ({
				id: s.id,
				name: s.name,
				surname: s.surname,
				email: s.username,
			}));
			return res.status(200).json(suppAPI);
		},
		(error) => {
			return res.status(500).json({ error: "generic error" });
		}
	);
};

exports.getUsers = async function (req, res) {
	await UserManager.getAllUsers().then(
		(users) => {
			
			return res.status(200).json(users);
		},
		(error) => {
			return res.status(500).json({ error: "generic error" });
		}
	);
};

const possiblePostTypes = [
	"customer",
	"supplier",
	"customer",
	"supplier",
	"clerk",
	"qualityEmployee",
	"deliveryEmployee",
];

exports.postUserSchema = {
	name: {
		notEmpty: true
	},
	surname: {
		notEmpty: true
	},
	password: {
		notEmpty: true,
		isLength: {
			options: {min: 8}
		}
	},
	username: {
		notEmpty: true,
		isEmail: true,
	},
	type: {
		notEmpty: true,
		custom: {
			options: (value, { req, location, path }) => {
				if (possiblePostTypes.includes(value)) {
					return true;
				} else {
					return false;
				}
			},
		},
	},
};

exports.postUser = async function (req, res) {
	const name = req.body.name;
	const surname = req.body.surname;
	const password = req.body.password;
	const username = req.body.username;
	const type = req.body.type;

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			//errors: errors.array()
			error: "Validation of request body failed or attempt to create manager or administrator accounts",
		});
	}

	//Controlla che l'username non sia già stato preso!!!
	await UserManager.defineUser(name, surname, password, username, type).then(
		(result) => {
			return res.status(201).end();
		},
		(error) => {
			switch (error) {
				case "503":
					
					return res.status(503).json({ error: "generic error" });
				case "409 email type":
					return res
						.status(409)
						.json({
							error: "user with same mail and type already exists",
						});
				default:
					return res.status(503).json({ error: "generic error" });
			}
		}
	);
};

/* Not requested in api
exports.loginSchema = {
    username: {
        notEmpty: true,
        isEmail: true
    },
    password: {
        notEmpty: true
    }
}*/

exports.managerSessions = async function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	const user = await UserManager.login(username, password, "manager").then(
		(result) => {
			return res.status(200).json(result);
		},
		(error) => {
			return res.status(500).json({ error: "generic error" });
		}
	);
};

exports.customerSessions = async function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	const user = await UserManager.login(username, password, "customer").then(
		(result) => {
			return res.status(200).json(result);
		},
		(error) => {
			return res.status(500).json({ error: "generic error" });
		}
	);
};

exports.supplierSessions = async function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	const user = await UserManager.login(username, password, "supplier").then(
		(result) => {
			return res.status(200).json(result);
		},
		(error) => {
			return res.status(500).json({ error: "generic error" });
		}
	);
};

exports.clerkSessions = async function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	const user = await UserManager.login(username, password, "clerk").then(
		(result) => {
			return res.status(200).json(result);
		},
		(error) => {
			return res.status(500).json({ error: "generic error" });
		}
	);
};

exports.qualityEmployeeSessions = async function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	const user = await UserManager.login(username, password, "qualityEmployee").then(
		(result) => {
			return res.status(200).json(result);
		},
		(error) => {
			return res.status(500).json({ error: "generic error" });
		}
	);
};

exports.deliveryEmployeeSessions = async function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	const user = await UserManager.login(
		username,
		password,
		"deliveryEmployee"
	).then(
		(result) => {
			return res.status(200).json(result);
		},
		(error) => {
			return res.status(500).json({ error: "generic error" });
		}
	);
};

exports.logout = async function (req, res) {
	await UserManager.logout().then(
		(result) => {
			return res.status(200).end();
		},
		(error) => {
			return res.status(500).json({ error: "generic error" });
		}
	);
};

exports.putUserSchema = {
    username: {
        notEmpty: true,
        isEmail: true
    },
    oldType: {
		notEmpty: true,
		custom: {
			options: (value, { req, location, path }) => {
				if (possiblePostTypes.includes(value)) {
					return true;
				} else {
					return false;
				}
			},
		},
	},
    newType: {
        notEmpty: true,
        custom: {
            options: (value, {req, location, path}) => {
                if (types.includes(value)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    }
}

exports.putUser = async function (req, res) {

    const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			//errors: errors.array()
			error: "validation of request body or of username failed or attempt to modify rights to administrator or manager",
		});
	}
	const username = req.params.username;
    //oldType can't be manager or administrator
	const oldType = req.body.oldType;
	const newType = req.body.newType;

	await UserManager.modifyUser(username, oldType, newType).then(
		(result) => {
			return res.status(200).end();
		},
		(error) => {
			switch (error) {
				case "404":
					return res.status(404).json({ error: "wrong username or oldType fields or user doesn't exists)" });
                default: 
                    return res.status(503).json({error: "generic error"});
                
			}
		}
	);
};

exports.deleteUserSchema = {
    username: {
        notEmpty: true,
        isEmail: true
    },
    type: {
		notEmpty: true,
		custom: {
			options: (value, { req, location, path }) => {
				if (possiblePostTypes.includes(value)) {
					return true;
				} else {
					return false;
				}
			},
		},
	},
}

exports.deleteUser = async function(req,res) {
    const username = req.params.username;
    const type = req.params.type;

    const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			//errors: errors.array()
			error: "validation of username or of type failed or attempt to delete a manager/administrator",
		});
	}

    await UserManager.deleteUser(username, type).then(
        result => {

            return res.status(204).end();
        },
        error => {
            
            return res.status(503).json({error: "generic error"});
        }
    )


}
