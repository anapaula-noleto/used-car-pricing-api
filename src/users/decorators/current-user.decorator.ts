import { createParamDecorator, ExecutionContext } from "@nestjs/common";
// Execution context === Request
// data: todos os argumentos que são passados para o decorator quando se utiliza ele
export const CurrentUser = createParamDecorator(
  // O createParamDecorator existe fora do sistema de injeção de dependência
  // então ele não pode pegar uma instância de UsersServices diretamente.
  // Por isso, é preciso criar um interceptor para resolver esse problema.
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
