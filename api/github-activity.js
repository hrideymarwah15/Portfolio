import {sendActivity} from '../server/github-activity.mjs';
export default function handler(request,response){
 if(request.method!=='GET'){response.statusCode=405;response.setHeader('Allow','GET');return response.end();}
 return sendActivity(response,process.env.GITHUB_TOKEN||process.env.GH_TOKEN);
}
