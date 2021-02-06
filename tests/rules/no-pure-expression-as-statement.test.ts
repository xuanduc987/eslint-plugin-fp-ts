import rule from "../../src/rules/no-pure-expression-as-statement";
import { ESLintUtils } from "@typescript-eslint/experimental-utils";
import path from "path";
import { stripIndent } from "common-tags";

const fixtureProjectPath = path.join(
  __dirname,
  "..",
  "fixtures",
  "fp-ts-project"
);

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    tsconfigRootDir: fixtureProjectPath,
    project: "./tsconfig.json",
  },
});

ruleTester.run("no-pure-expression-as-statement", rule, {
  valid: [
    {
      code: stripIndent`
        import { task } from "fp-ts"

        function ok() {
          return task.of(42)
        }
      `,
    },
    {
      code: stripIndent`
        import { task } from "fp-ts"

        function ok() {
          task.of(42)()
        }
      `,
    },
    {
      code: stripIndent`
        import { io } from "fp-ts"

        function ok() {
          io.of(42)()
        }
      `,
    },
  ],
  invalid: [
    {
      code: stripIndent`
        import { task } from "fp-ts"

        function woops() {
          task.of(42)
        }
      `,
      errors: [
        {
          messageId: "pureExpressionInStatementPosition",
        },
      ],
    },
    {
      code: stripIndent`
        import { task } from "fp-ts"

        function woops() {
          const x = task.of(42)
          x
        }
      `,
      errors: [
        {
          messageId: "pureExpressionInStatementPosition",
        },
      ],
    },
    {
      code: stripIndent`
        import { taskEither } from "fp-ts"

        function woops() {
          taskEither.of(42)
        }
      `,
      errors: [
        {
          messageId: "pureExpressionInStatementPosition",
        },
      ],
    },
    {
      code: stripIndent`
        import { io } from "fp-ts"

        function woops() {
          io.of(42)
        }
      `,
      errors: [
        {
          messageId: "pureExpressionInStatementPosition",
        },
      ],
    },
  ],
});
