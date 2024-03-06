const router = require('express').Router();
const multer = require('multer');

const { uploadAvatar } = require('../controllers/uploadController');

const storage = multer.diskStorage({
    destination: './uploads',
    limit: {
      fileSize: 100000
    }
  });

const uploadMiddleware = multer({ storage });

// upload avatar
router.post('/:userId', uploadMiddleware.single('file'), uploadAvatar)

module.exports = router