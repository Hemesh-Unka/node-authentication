export interface EndPoint {
  authorize: (request: Request, response: Response, next: NextFunction) => Promise<void>;
  method: (request: Request, response: Response, next: NextFunction) => Promise<void>;
}