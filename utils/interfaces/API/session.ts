export interface Session {
  idUser: string;
  email: string;
  tipoUsuario: string;
}
declare module "iron-session" {
  interface IronSessionData {
    user?: {
      idUser: string;
      email: string;
      tipoUsuario: string;
    };
  }
}
