const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const Users = require('../models/userModel')

require('dotenv').config()
const projectId = process.env.PROJECT_ID;
const keyFilename = `.secret/gcp/${process.env.KEY_FILENAME}.json`;
const bucketName = process.env.BUCKET_NAME;

const storage = new Storage({
  projectId,
  keyFilename,
});

async function uploadImage(filePath, fileName) {
  try {
    const bucket = await storage.bucket(bucketName);
    const file = await bucket.upload(filePath, {
      destination: fileName,
    });
    const fileUrl = `https://storage.cloud.google.com/${bucketName}/${fileName}`;
    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

module.exports.uploadAvatar = async (req, res) => {
  if (req.file) {
    const _id = req.params.userId;
    const filePath = req.file.path;
    const fileType = req.file.mimetype.split('/')[1];
    const fileName = req.file.filename + `.${fileType}`;
    const response = await uploadImage(filePath, fileName)
    .then(async (url) => {
      fs.unlink(filePath, (err) => {
          if (err) { console.error('Error deleted file from back-end server.', err); };
      });
      if (url) {
        const updatedUser = await Users.updateOne({ _id }, {$set:{ avatar: url }});
        if (updatedUser.modifiedCount == 0) {
          res.status(500);
          return res.json({ mess: 'User update failed' })
        } else {
          const resUser = await Users.findOne({ _id });
          if (resUser) {
            res.status(200);
            return res.json({ success: true, message: 'Update success!', data: {user: resUser} });
          } else {
            res.status(500);
            return res.json({ success: false, message: 'Return updated user fail!' });
          };
        };
      };
    }).catch(err => {
      console.log(err);
      res.send({ success: false, message: 'Error uploading file!' });
    });
  } else res.send({ success: false, message: 'Error uploading file!' });
};
