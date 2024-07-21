import { AccountClient } from "./proto/account_grpc_pb";
import { CreateUserInput, CreateUserPayload } from "./proto/account_pb";

export const createUser = (id: string, client: AccountClient): Promise<CreateUserPayload> => {
  return new Promise<CreateUserPayload>((resolve, reject) => {
    const request = new CreateUserInput();
    request.setId(id);

    client.createUser(request, (err, user) => {
      if (err) reject(err);
      else resolve(user);
    });
  });
};