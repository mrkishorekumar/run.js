import firebase from "firebase/compat/app";
import { FieldValue } from "firebase/firestore";

export interface Codebase {
  code: string;
  createdAt?: FieldValue;
  fileName: string;
  isDelete: boolean;
  language: "js" | "ts";
  lastModifiedAt?: FieldValue;
  share: 0 | 1;
  star: 0 | 1;
  userId: string;
}

export const MASTER_DATA: Codebase = {
  code: "",
  createdAt: undefined,
  fileName: "",
  isDelete: false,
  language: "js",
  lastModifiedAt: undefined,
  share: 0,
  star: 0,
  userId: "",
};
