import test from 'node:test';
import assert from 'node:assert/strict';
import {createActivityService,parseActivity,sendActivity} from '../server/github-activity.mjs';
const body={user:{contributionsCollection:{contributionCalendar:{weeks:[{contributionDays:[{date:'2026-10-18',contributionCount:3,contributionLevel:'FIRST_QUARTILE'}]}]}}},search:{issueCount:4,nodes:[]}};
test('calendar rejects malformed upstream counts and levels',()=>{
 assert.equal(parseActivity(body).total,3);
 const bad=structuredClone(body);bad.user.contributionsCollection.contributionCalendar.weeks[0].contributionDays[0].contributionCount=-1;
 assert.throws(()=>parseActivity(bad));
});
test('concurrent requests share one upstream call and credentials never enter the result',async()=>{
 const get=createActivityService();let calls=0;
 const fetcher=async(url,options)=>{calls++;assert.equal(options.headers.Authorization,'Bearer test-secret');return {ok:true,json:async()=>({data:body})};};
 const a=await Promise.all([get('test-secret',{fetcher}),get('test-secret',{fetcher})]);
 assert.equal(calls,1);assert.equal(a[0],a[1]);assert(!JSON.stringify(a).includes('test-secret'));
 await get('test-secret',{fetcher});assert.equal(calls,1);
});
test('an unconfigured service fails without disclosing a credential',async()=>{
 await assert.rejects(createActivityService()(undefined),/not configured/);
});


test('Vite activity setup does not return a middleware function as a post-install hook',async()=>{
 const {default:config}=await import('../vite.config.js');
 const activity=config({mode:'test'}).plugins.find(p=>p.name==='github-activity');
 let installed=0;const server={middlewares:{use(){installed++;return ()=>{throw new Error('Unexpected post-install hook');};}}};
 assert.equal(activity.configureServer(server),undefined);
 assert.equal(activity.configurePreviewServer(server),undefined);
 assert.equal(installed,2);
});
