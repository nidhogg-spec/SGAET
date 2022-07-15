import * as UserRepository from "../Frameworks/repository/user-repository";
import jsonwebtoken from "jsonwebtoken";
import { userInterface } from "@/utils/interfaces/db";
import { nanoid } from "nanoid";

async function RegisterUser(UserData: any) {
  const newUser = validateUserDb({ ...UserData, IdUser: nanoid() });
  return await UserRepository.createUser(newUser);
}

async function LoginUser(email: string, password: string) {
  let result = (await UserRepository.ReadUser(email)) as userInterface;
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
        token
      };
    } else {
      throw new Error("Password incorrecto");
    }
  } else {
    throw new Error("Usuario no existe");
  }
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

export { RegisterUser, LoginUser, ChangePassword, UpdateUser };
