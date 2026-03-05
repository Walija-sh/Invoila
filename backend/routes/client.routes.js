import express from 'express';
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
} from '../controllers/client.controller.js';

import protect from '../middlwares/protect.middleware.js';

const ClientRouter = express.Router();

ClientRouter.use(protect);

// create client
ClientRouter.post('/', createClient);

// get all clients of logged-in user
ClientRouter.get('/', getClients);

// get single client
ClientRouter.get('/:id', getClientById);

// update client
ClientRouter.put('/:id', updateClient);

// delete client
ClientRouter.delete('/:id', deleteClient);

export default ClientRouter;