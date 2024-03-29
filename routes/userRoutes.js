const { register, login, update, findContact, getUserDataById, getUserDataByEmail, searchUserByQuery, getAllUsers } = require('../controllers/userController')

const router = require('express').Router();

router.post('/register', register);

router.post('/login', login);

router.post('/update', update);

router.post('/find', findContact);

router.post('/get-user-data', getUserDataById);

router.post('/get-auth', getUserDataByEmail);

router.post('/search', searchUserByQuery);

router.post('/get-all', getAllUsers);

module.exports = router