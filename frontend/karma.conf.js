// For more information about this file see https://angular.io/config/extension-configuration
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "../out-tsc/spec",
    "types": [
      "jasmine",
      "node"
    ],
    "esModuleInterop": true,
    "emitDecoratorMetadata": true
  },
  "files": [
    "test.ts",
    "polyfills.ts"
  ],
  "include": [
    "**/*.spec.ts",
    "**/*.d.ts"
  ]
}
