import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateTransferStatementUserCase } from './CreateTransferStatementUserCase';
import { OperationType } from '../createStatement/CreateStatementController';

export class CreateTransferStatementController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;
    const { user_id } = request.params;

    const splittedPath = request.originalUrl.split('/')
    const type = splittedPath[splittedPath.length - 2] as OperationType;
    console.log(type)
    const createStatement = container.resolve(CreateTransferStatementUserCase);

    const statement = await createStatement.execute({
      sender_id,
      user_id,
      type: OperationType.TRANSFER,
      amount,
      description
    });

    return response.status(201).json(statement);
  }
}
