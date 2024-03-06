const Users = require('../models/userModel')
const brcypt = require('bcrypt')

module.exports.register = async (req, res, next) => {
    try {
        const { email } = req.body;
        const emailCheck = await Users.findOne({ email });
        if (emailCheck) {
            res.status(403);
            return res.json({ mess: 'Account is already in used' });
        }
        // const hashedPassword = await brcypt.hash(password, 10)
        const user = await Users.create({ email })
        res.status(200)
        return res.json({ user })
    } catch (error) {
        next(error)
    }
}

module.exports.getAllUsers = async (req, res) => {
    const id = req.body;
    try {
        const findMe = await Users.find(id);
        if (findMe) {
            const userData = await Users.find({ _id: { $ne: id } });
            res.status(200).json([...userData]);
        } else {
            res.status(404).json({mess: "You don't have permission to get user data!"});
        }
    } catch (err) {
		res.status(500).json(err);
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const user = await Users.findOne({ userName });
        if (!user) {
            res.status(403);
            return res.json({ mess: 'Incorrect User Name' });
        }
        const passwordValidate = await brcypt.compare(password, user.password);
        if (!passwordValidate) {
            res.status(403);
            return res.json({ mess: 'Incorrect Password' });
        }
        user.password = '';
        res.status(200);
        return res.json({ user });
    } catch (err) {
        next(err);
    }
}

module.exports.update = async (req, res, next) => {
    try {
        const {
            email,
            userName,
            displayName,
            firstName,
            lastName,
            phoneNumber,
            birthday,
            gender,
            address,
            backgroundImage,
            avatar,
            bio,
            contact
        } = req.body;
        const getUserToUpdate = await Users.findOne({ email });
        if (!getUserToUpdate) {
            res.status(403);
            return res.json({ mess: 'User not exist' });
        }
        const updatedUser = await Users.updateOne({ email }, {$set:{
            userName: userName,
            displayName: displayName,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            birthday: birthday,
            gender: gender,
            address: address,
            backgroundImage: backgroundImage,
            avatar: avatar,
            bio: bio,
            contact: contact
        }});
        if (!updatedUser) {
            res.status(500);
            return res.json({ mess: 'User update failed' });
        }
        const user = await Users.findOne({ email });
        if (!user) {
            res.status(403);
            return res.json({ mess: 'Fail to return updated user' });
        }
        res.status(200);
        return res.json({ user });
    } catch (err) {
        next(err);
    }
}

module.exports.findContact = async (req, res) => {
    const userName = req.body;
    try {
        const contact = await Users.findOne(userName);
        res.status(200).json(contact);
    } catch (err) {
		res.status(500).json(err);
    }
}

module.exports.getUserDataById = async (req, res) => {
    const id = req.body;
    try {
        const userData = await Users.findOne(id);
        res.status(200).json(userData);
    } catch (err) {
		res.status(500).json(err);
    }
}

module.exports.getUserDataByEmail = async (req, res) => {
    const email = req.body;
    console.log('email', email)
    try {
        const user = await Users.findOne(email);
        res.status(200).json({user});
    } catch (err) {
		res.status(500).json(err);
    }
}

module.exports.searchUserByQuery = async (req, res) => {
    const q = req.body;
    try {
        const result = await Users.findOne(q);
        res.status(200).json(result);
    } catch (err) {
		res.status(500).json(err);
    }
}