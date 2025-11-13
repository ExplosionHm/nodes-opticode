import { fstat, writeFile } from "fs";
import { GoBuilderOptions, GoBuilder } from "./go/builder";

const options: GoBuilderOptions = {
  name: "My First Go Project",
};
const builder = new GoBuilder(options);

for (let i = 0; i < 2_000_000; i++) {
  const packageNode = builder.CreatePackageNode("main");
  const packageId = builder.SetNode(packageNode);

  const fmtNode = builder.CreateImportValueNode("fmt");
  const fmt = builder.SetNode(fmtNode);

  const strconvNode = builder.CreateImportValueNode("strconv");
  const strconv = builder.SetNode(strconvNode);

  const importNode = builder.CreateImportNode(fmt, strconv);
  const importId = builder.SetNode(importNode);

  builder.ConnectNodes(packageId, importId);
}

//builder.TestBuild(); // Just outputs what's in there
const now = Date.now();
const output = builder.Build();
console.log(`Build time: ${Date.now() - now}ms`);
console.log(output);
console.log(
  `size: ${(output.length / 1024 / 1024).toPrecision(4)}Mib (${(output.length / 1024).toPrecision(2)}Kib)`
);
let { signal } = new AbortController();
writeFile("nodes.opt", output, { signal }, (err) => {
  if (!err) return;
  console.error(err);
});
