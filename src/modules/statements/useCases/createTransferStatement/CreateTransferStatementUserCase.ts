import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { OperationType } from "../createStatement/CreateStatementController";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";

@injectable()
export class CreateTransferStatementUserCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) { }

  async execute({ user_id, sender_id, type, amount, description }: ICreateStatementDTO) {
    const sender = await this.usersRepository.findById(sender_id as string);

    if (!sender) {
      throw new CreateStatementError.UserNotFound();
    }

    const receive_user = await this.usersRepository.findById(user_id);

    if (!receive_user) {
      throw new CreateStatementError.UserNotFound();
    }
    /////////////
    if (type) {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id as string });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    }
    console.log("user_id", user_id)
    const statementSenderOperation = await this.statementsRepository.create({
      user_id: sender_id as string,
      sender_id: user_id,
      type,
      amount: amount * (-1),
      description
    });
    console.log('HHAHAH1')
    const statementReceiverOperation = await this.statementsRepository.create({
      user_id,
      sender_id,
      type,
      amount,
      description
    });

    return [statementSenderOperation, statementReceiverOperation];
  }
}
