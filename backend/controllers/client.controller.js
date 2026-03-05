import Client from '../models/Client.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';



export const createClient = catchAsync(async (req, res, next) => {

  const { name, email, phone, company, address, notes } = req.body;

  if (!name || !email) {
    return next(new AppError('Name and email are required', 400));
  }

  const client = await Client.create({
    name,
    email,
    phone,
    company,
    address,
    notes,
    user: req.user._id
  });

  res.status(201).json({
    status: 'success',
    data: client
  });

});


export const getClients = catchAsync(async (req, res, next) => {

  const clients = await Client.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: clients.length,
    data: clients
  });

});


export const getClientById = catchAsync(async (req, res, next) => {

  const client = await Client.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!client) {
    return next(new AppError('Client not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: client
  });

});


export const updateClient = catchAsync(async (req, res, next) => {

  const client = await Client.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id
    },
    req.body,
    {
     returnDocument: 'after',
      runValidators: true
    }
  );

  if (!client) {
    return next(new AppError('Client not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: client
  });

});


export const deleteClient = catchAsync(async (req, res, next) => {

  const client = await Client.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!client) {
    return next(new AppError('Client not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Client deleted successfully'
  });

});

