import {defineConfig,loadEnv} from 'vite';
import tailwindcss from '@tailwindcss/vite';
import {execFileSync} from 'node:child_process';
import {sendActivity} from './server/github-activity.mjs';
export default defineConfig(({mode})=>{
 const env=loadEnv(mode,process.cwd(),'');
 let token=env.GITHUB_TOKEN||env.GH_TOKEN;
 // Local development reuses the existing sign-in; production reads its server secret.
 if(!token)try{token=execFileSync('gh',['auth','token'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}catch{}
 const install=server=>{server.middlewares.use('/api/github-activity',(request,response)=>{
  if(request.method!=='GET'){response.statusCode=405;response.setHeader('Allow','GET');return response.end();}
  return sendActivity(response,token);
 });};
 const activity={name:'github-activity',configureServer:install,configurePreviewServer:install};
 return {plugins:[tailwindcss(),activity],build:{chunkSizeWarningLimit:700,rollupOptions:{output:{manualChunks:{three:['three']}}}}};
});
