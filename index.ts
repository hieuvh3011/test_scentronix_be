import { findServer } from "./src/findServer";

async function main(){
  console.log(await findServer());
}

main();