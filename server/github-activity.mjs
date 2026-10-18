const USER='hrideymarwah15',TTL=60000;
const query=`query Activity($login:String!,$from:DateTime!,$to:DateTime!){user(login:$login){contributionsCollection(from:$from,to:$to){contributionCalendar{weeks{contributionDays{date contributionCount contributionLevel}}}}}search(query:"author:hrideymarwah15 repo:jax-ml/jax is:pr is:merged",type:ISSUE,first:4){issueCount nodes{... on PullRequest{title number url mergedAt}}}}`;
export function parseActivity(data,now=new Date()){
 const levels=['NONE','FIRST_QUARTILE','SECOND_QUARTILE','THIRD_QUARTILE','FOURTH_QUARTILE'];
 const days=data?.user?.contributionsCollection?.contributionCalendar?.weeks?.flatMap(w=>w.contributionDays).map(d=>({date:d.date,count:d.contributionCount,level:levels.indexOf(d.contributionLevel)})).slice(-30);
 if(!days?.length||days.length>30||days.some(d=>!/^\d{4}-\d{2}-\d{2}$/.test(d.date)||!Number.isSafeInteger(d.count)||d.count<0||d.level<0))throw new Error('Invalid calendar');
 const jax=data.search;if(!Number.isSafeInteger(jax?.issueCount)||jax.issueCount<0)throw new Error('Invalid pull requests');
 return {username:USER,source:`https://github.com/${USER}`,fetchedAt:now.toISOString(),days,total:days.reduce((n,d)=>n+d.count,0),jax:{mergedCount:jax.issueCount,pullRequests:(jax.nodes||[]).filter(p=>p?.mergedAt&&/^https:\/\/github\.com\/jax-ml\/jax\/pull\/\d+$/.test(p.url)).map(({title,number,url,mergedAt})=>({title,number,url,mergedAt}))}};
}
export function createActivityService(){
 let cached=null,expires=0,pending=null;
 return async function activity(token,{fetcher=fetch,now=new Date()}={}){
  if(cached&&now.getTime()<expires)return cached;
  if(pending)return pending;
  if(!token)throw new Error('GitHub credential is not configured');
  pending=(async()=>{
   const from=new Date(now);from.setUTCDate(from.getUTCDate()-29);from.setUTCHours(0,0,0,0);
   const response=await fetcher('https://api.github.com/graphql',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json','User-Agent':'Hridey-Portfolio'},body:JSON.stringify({query,variables:{login:USER,from:from.toISOString(),to:now.toISOString()}}),signal:AbortSignal.timeout(10000)});
   if(!response.ok)throw new Error('GitHub activity unavailable');
   const body=await response.json();if(body.errors)throw new Error('GitHub activity unavailable');
   cached=parseActivity(body.data,now);expires=now.getTime()+TTL;return cached;
  })();
  try{return await pending;}finally{pending=null;}
 };
}
export const getActivity=createActivityService();
export async function sendActivity(response,token){
 try{
  const activity=await getActivity(token);response.setHeader('Content-Type','application/json');response.setHeader('Cache-Control','public, max-age=30, s-maxage=60, stale-while-revalidate=120');response.statusCode=200;response.end(JSON.stringify(activity));
 }catch{
  response.setHeader('Content-Type','application/json');response.setHeader('Cache-Control','no-store');response.statusCode=503;response.end(JSON.stringify({error:'Activity temporarily unavailable'}));
 }
}
