import { systemLogInterface } from "@/utils/interfaces/db";
import Ajv, { JSONSchemaType } from "ajv";
const ajv = new Ajv();

export function validateCreateSystemLogBodyParam(
  value: unknown
): [
  Omit<
    systemLogInterface,
    "IdSystemLog" | "_id" | "Estado" | "CreatedAt" | "User"
  > | null,
  string | null | undefined,
  number
] {
  const schema: JSONSchemaType<
    Omit<
      systemLogInterface,
      "IdSystemLog" | "_id" | "Estado" | "CreatedAt" | "User"
    >
  > = {
    type: "object",
    required: ["Accion", "Descripcion"],
    properties: {
      Descripcion: {
        type: "string"
      },
      Accion: {
        type: "string"
      }
    },
    additionalProperties: false
  };
  try {
    const validate = ajv.compile(schema);

    if (validate(value)) {
      // data is MyData here
      return [value as any, null, 200];
    }
    return [
      null,
      validate.errors
        ?.flatMap((x) => `|${x.instancePath} - ${x.message}|`)
        .join(),
      400
    ];
  } catch (error) {
    return [null, `${error}`, 400];
  }
}
