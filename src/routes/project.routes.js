import { fetchAllProjects } from '#src/controllers/project.controller.js';
import express from 'express';


const projectRouter = express.Router();

projectRouter.get('/', fetchAllProjects);

export default projectRouter;