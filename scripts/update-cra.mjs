import {readFile,writeFile,rename,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {refreshUpdates} from '../worker/cra-updates.js';

export async function updateSnapshot(path, {now = Date.now(), refresh = refreshUpdates} = {}) {
  let previous;
  try {previous=JSON.parse(await readFile(path,'utf8'));} catch(error) {if(error.code !== 'ENOENT')throw error;}
  const month=new Date(now).toISOString().slice(0,7);
  if(previous?.attemptedAt?.slice(0,7) === month) return {changed:false,payload:previous};
  const payload=await refresh({previous,now});
  const current=new Date(now);
  payload.nextCheckAt=new Date(Date.UTC(current.getUTCFullYear(),current.getUTCMonth()+1,1,12)).toISOString();
  await mkdir(dirname(path),{recursive:true});
  await writeFile(path+'.tmp',JSON.stringify(payload,null,2)+'\n');await rename(path+'.tmp',path);
  return {changed:true,payload};
}
if(process.argv[1] === fileURLToPath(import.meta.url)) {
  const result=await updateSnapshot(fileURLToPath(new URL('../public/cra-updates.json',import.meta.url)));
  console.log(result.changed ? `Monthly CRA check: ${result.payload.status}; ${result.payload.items.length} headlines saved.` : 'This month is already checked. No CRA requests sent.');
}
