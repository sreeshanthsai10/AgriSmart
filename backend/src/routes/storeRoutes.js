const express = require('express');
const {
  createStore,
  getMyStore,
  getNearbyStores,
  getAllStores,
  deleteStore
} = require('../controllers/storeController');

const { protect } = require('../middleware/auth');

const router = express.Router(); 

//  CREATE / UPDATE STORE
router.post('/', protect, createStore);

//  GET MY STORE
router.get('/my', protect, getMyStore);

//  GET ALL STORES
router.get('/', getAllStores);

//  GET NEARBY STORES
router.get('/nearby', getNearbyStores);

//  DELETE STORE
router.delete('/:id', protect, deleteStore);

module.exports = router;