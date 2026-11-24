import React,{createContext,useContext,useEffect,useState,useRef} from 'react';
import {AthleteData,emptyData} from './schema';
import {loadData,saveData} from './storage';
type Store={data:AthleteData;ready:boolean;fault:string|null;faultOrigin:'load'|'save'|null;update:(f:(d:AthleteData)=>AthleteData)=>void;replace:(d:AthleteData)=>void;retrySave:()=>void};
const Ctx=createContext<Store|null>(null);
export function AthleteProvider({children}:{children:React.ReactNode}) {
 const [data,setData]=useState<AthleteData>(emptyData);const [ready,setReady]=useState(false);const [fault,setFault]=useState<string|null>(null);const [faultOrigin,setFaultOrigin]=useState<'load'|'save'|null>(null);
 const revision=useRef(0);
 useEffect(()=>{loadData().then(d=>{if(revision.current===0)setData(d);setReady(true)}).catch(e=>{setFaultOrigin('load');setFault(String(e));setReady(true)})},[]);
 useEffect(()=>{if(!ready||fault)return;saveData(data).catch(e=>{setFaultOrigin('save');setFault(`Speichern fehlgeschlagen: ${String(e)}`)})},[data,ready,fault]);
 const update=(fn:(d:AthleteData)=>AthleteData)=>{revision.current++;setData(prev=>fn(prev))};
 const replace=(d:AthleteData)=>{revision.current++;setData(d);setFault(null);setFaultOrigin(null)};
 const retrySave=()=>{if(faultOrigin!=='save')return;setFault(null);setFaultOrigin(null)};
 return <Ctx.Provider value={{data,ready,fault,faultOrigin,update,replace,retrySave}}>{children}</Ctx.Provider>
}
export function useAthlete():Store{const x=useContext(Ctx);if(!x)throw new Error('Store fehlt');return x;}
