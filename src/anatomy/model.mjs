export const clamp01 = value => Math.max(0, Math.min(1, value));
const smooth = value => { const x=clamp01(value); return x*x*(3-2*x); };
export const followCircular=(current,target,dt)=>{let delta=target-current;delta-=Math.round(delta);return (current+delta*(1-Math.exp(-Math.min(dt,.05)/.24))+1)%1;};
export const follow = (current,target,dt) => current+(target-current)*(1-Math.exp(-Math.min(dt,.05)/.24));

// Illustration time, not project telemetry. The same position drives the carrier and readout.
export function targetAt(kind, seconds) {
 const t=((seconds%12)+12)%12;
 if(kind==='brain')return {position:t/12,returning:false,paused:false};
 if(kind==='agency'){const station=Math.floor(t/4);return {position:(station+smooth((t%4)/2.4))/3,returning:false,paused:t%4>2.4};}
 if(t>=9)return {position:1-smooth((t-9)/2),returning:true,paused:false};
 if(kind==='graph'){
  if(t<3)return {position:.22*smooth(t/3),returning:false,paused:false};
  if(t<4.4)return {position:.22,returning:false,paused:true};
  return {position:.22+.78*smooth((t-4.4)/3.4),returning:false,paused:false};
 }
 if(t<1.1)return {position:0,returning:false,paused:false};
 if(t<3.7)return {position:.5*smooth((t-1.1)/2.6),returning:false,paused:false};
 if(t<4.9)return {position:.5,returning:false,paused:true};
 return {position:.5+.5*smooth((t-4.9)/2.6),returning:false,paused:false};
}
export function phaseAt(kind,position,{returning=false,paused=false}={}){
 const p=clamp01(position), station=Math.min(2,Math.round(p*2));
 if(kind==='brain'){const station=Math.floor(p*6)%6;return {station,label:['Recalling context','Planning the task','Reasoning through options','Using tools','Verifying the result','Recovering and learning'][station]};}
 if(kind==='roadmap')return {station,label:returning?'Refining the roadmap':p<.3?'Comparing skills':p<.65?'Resolving prerequisites':'Building the learning path'};
 if(kind==='medicine')return {station,label:returning?'Resetting the scanner':p<.3?'Reading the packaging':p<.65?'Extracting batch details':'Checking the records'};
 if(kind==='agency'){const sector=Math.round(p*3)%3;return {station:sector,label:['Receiving a brief','Delegating tasks','Reviewing output'][sector]};}
 if(returning)return {station,label:kind==='aero'?'Opening chamber':'Returning to depot'};
 if(kind==='graph')return {station,label:paused&&Math.abs(p-.22)<.025?'Route blocked':p>.94?'Delivery complete':p>.25?'Taking the bypass':'Leaving the depot'};
 const labels=kind==='agency'?['Receiving task','Assigning work','Checking output']:['Preparing the chamber','Approval gate','Verifying output'];
 return {station,label:labels[station]};
}

// A real approval pause: the carrier cannot pass the middle station unattended.
export function advanceTour(state,kind,dt,{automatic=false}={}){
 state.clock+=dt;
 if(state.clock>=12){state.clock%=12;state.approved=false;}
 if(!automatic&&kind==='aero'&&state.clock>=3.9&&state.clock<4.9&&!state.approved){state.clock=3.9;state.waiting=true;}
 else state.waiting=false;
 state.target=targetAt(kind,state.clock).position;
}
