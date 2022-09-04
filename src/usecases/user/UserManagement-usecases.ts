import * as UserRepository from "../../adapters/repository/user-repository";
import jsonwebtoken from "jsonwebtoken";
import { userInterface } from "@/utils/interfaces/db";
import { UsesCase_to_API_response } from "@/utils/interfaces/API/responsesInterface";
import * as uuid from "uuid";

interface TokenData {
  idUser: string;
  email: string;
  tipoUsuario: string;
}

async function RegisterUser(UserData: any) {
  const newUser = validateUserDb({ ...UserData, IdUser: uuid.v4() });
  const existUser = await UserRepository.ReadUserByEmail(newUser.Email);

  if (existUser) {
    return {
      message: "El usuario ya existe",
      data: {},
      status: 400
    };
  }

  return await UserRepository.createUser(newUser);
}

async function LoginUserReturnToken(
  email: string,
  password: string
): Promise<UsesCase_to_API_response> {
  try {
    let result = (await UserRepository.ReadUserByEmail(email)) as userInterface;

    if (result) {
      result = validateUserDb(result);

      if (result.Password === password) {
        const token = jsonwebtoken.sign(
          {
            idUser: result.IdUser,
            email: result.Email,
            tipoUsuario: result.TipoUsuario
          },
          process.env.SECRET_KEY as string
        );
        return {
          data: {
            token: token
          },
          message: "Login correcto",
          status: 200
        };
      } else {
        return {
          message: "Password incorrecto",
          data: null,
          status: 401
        };
      }
    } else {
      return {
        message: "Usuario no existe",
        data: null,
        status: 401
      };
    }
  } catch (error) {
    return {
      data: null,
      errorList: [error as string],
      status: 500,
      error: true,
      message: "Error interno"
    };
  }
}

async function LoginUserReturnUser(
  email: string,
  password: string
): Promise<UsesCase_to_API_response> {
  try {
    let result = (await UserRepository.ReadUserByEmail(email)) as userInterface;

    if (result) {
      result = validateUserDb(result);

      if (result.Password === password) {
        return {
          data: {
            idUser: result.IdUser,
            email: result.Email,
            tipoUsuario: result.TipoUsuario
          },
          message: "Login correcto",
          status: 200
        };
      } else {
        return {
          message: "Password incorrecto",
          data: null,
          status: 401
        };
      }
    } else {
      return {
        message: "Usuario no existe",
        data: null,
        status: 401
      };
    }
  } catch (error) {
    return {
      data: null,
      errorList: [error as string],
      status: 500,
      error: true,
      message: "Error interno"
    };
  }
}

async function GetUserById(id: string): Promise<userInterface> {
  const user: userInterface = (await UserRepository.ReadUser(
    id
  )) as userInterface;
  return user;
}

async function ChangePassword(
  email: string,
  password: string,
  newPassword: string
) {
  let result = (await UserRepository.ReadUser(email)) as userInterface;
  if (result) {
    result = validateUserDb(result);

    if (result.Password === password) {
      result.Password = newPassword;
      return await UserRepository.createUser(result);
    } else {
      throw new Error("Password incorrecto");
    }
  } else {
    throw new Error("Usuario no existe");
  }
}

function UpdateUser(IdUser: string, UserData: userInterface) {
  const updateUser = validateUserDb(UserData);
  updateUser.IdUser = IdUser;
  return UserRepository.UpdateUser(IdUser, updateUser);
}

function ValidateJWT(JWT: string): {
  tokenData: TokenData;
  validate: boolean;
} {
  const TokenData = jsonwebtoken.verify(JWT, process.env.SECRET_KEY as string);

  if (TokenData) {
    return {
      tokenData: TokenData as TokenData,
      validate: true
    };
  }
  return {
    tokenData: { idUser: "", email: "", tipoUsuario: "" },
    validate: false
  };
}

function validateUserDb(data: any): userInterface {
  return {
    Nombre: data.Nombre || "",
    Apellido: data.Apellido || "",
    Email: data.Email || "",
    Password: data.Password || "",
    TipoUsuario: data.TipoUsuario || "",
    IdUser: data.IdUser || "",
    Estado: data.Estado || ""
  };
}

export {
  RegisterUser,
  LoginUserReturnToken,
  LoginUserReturnUser,
  ChangePassword,
  UpdateUser,
  GetUserById
};
