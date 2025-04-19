import { Request } from 'express';


export interface CustomRequest extends Request {
  user?: any; // Attach the decoded Firebase user object
}
