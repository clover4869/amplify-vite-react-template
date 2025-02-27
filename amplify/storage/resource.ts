import { defineFunction, defineStorage, secret } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "react-upload-file-with-url",
  triggers: {
    onUpload: defineFunction({
      entry: "./handle.ts",
    }),
  },
});
