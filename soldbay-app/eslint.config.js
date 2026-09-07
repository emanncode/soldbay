// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  // Ban direct Alert.alert usage outside the sanctioned cross-platform dialog
  // helper. Direct Alert.alert calls scatter behavior, skip the web fallback
  // (react-native-web's Alert is a no-op), and are hard to reason about, so
  // every dialog should go through src/lib/dialogs.ts instead.
  {
    plugins: {
      "no-direct-alert": {
        rules: {
          "ban-alert-import": {
            meta: {
              type: "problem",
              docs: {
                description:
                  "Disallow importing Alert from react-native outside src/lib/dialogs.ts",
              },
              messages: {
                alert: "Do not use Alert directly. Use helpfulDialog/confirmDialog from '@/lib/dialogs' instead.",
              },
              schema: [],
            },
            create(context) {
              const filename = context.getFilename();
              const isAllowed =
                /src[\\/]lib[\\/]dialogs\.(ts|tsx)$/.test(filename);
              if (isAllowed) return {};

              return {
                ImportSpecifier(node) {
                  if (node.imported && node.imported.name === "Alert") {
                    context.report({ node, messageId: "alert" });
                  }
                },
                ImportDefaultSpecifier(node) {
                  if (node.local && node.local.name === "Alert") {
                    context.report({ node, messageId: "alert" });
                  }
                },
              };
            },
          },
        },
      },
    },
    rules: {
      "no-direct-alert/ban-alert-import": "error",
    },
  },
]);

