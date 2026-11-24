import React from 'react';
import {View,Text,useWindowDimensions} from 'react-native';
import Svg,{Path,Circle,Line,Text as SvgText,Rect} from 'react-native-svg';
import {color} from './Design';
import {dayNumber} from '../utils/metrics';
type Point={date:string,value:number};
export function TrendChart({points,height=190,target,unit='kg',line=color.blue}:{points:Point[],height?:number,target?:number|null,unit?:string,line?:string}){
 const {width}=useWindowDimensions();const w=Math.max(260,Math.min(width-70,560));const h=height;const margin={left:28,right:16,top:22,bottom:25};
 const clean=[...points].filter(p=>Number.isFinite(p.value)&&!!p.date).sort((a,b)=>a.date.localeCompare(b.date));
 if(!clean.length)return <View style={{height,alignItems:'center',justifyContent:'center'}}><Text style={{color:color.muted}}>Noch keine Messungen vorhanden.</Text></View>;
 const values=clean.map(p=>p.value);if(target!=null&&Number.isFinite(target))values.push(target);
 const mn=Math.min(...values),mx=Math.max(...values);const pad=Math.max(1,(mx-mn)*0.23);const lo=mn-pad,hi=mx+pad;
 const time=clean.map(p=>dayNumber(p.date));const xMin=time[0],xMax=time[time.length-1];
 const x=(d:number)=>margin.left+(xMax===xMin?.5:(d-xMin)/(xMax-xMin))*(w-margin.left-margin.right);
 const y=(v:number)=>margin.top+(hi-v)/(hi-lo)*(h-margin.top-margin.bottom);
 const path=clean.map((p,i)=>(i?'L':'M')+x(time[i]).toFixed(1)+','+y(p.value).toFixed(1)).join(' ');
 const baseline=h-margin.bottom;
 return <View><Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
   {[0,1,2,3].map(i=><React.Fragment key={i}><Line x1={margin.left} y1={margin.top+(baseline-margin.top)*i/3} x2={w-margin.right} y2={margin.top+(baseline-margin.top)*i/3} stroke="#E7ECF3" strokeDasharray="3 5"/><SvgText x={margin.left-4} y={margin.top+(baseline-margin.top)*i/3-4} fill="#97A2AF" fontSize={9} textAnchor="end">{(hi-(hi-lo)*i/3).toFixed(0)}</SvgText></React.Fragment>)}
   {target!=null&&Number.isFinite(target)?<><Line x1={margin.left} x2={w-margin.right} y1={y(target)} y2={y(target)} stroke="#9BA7B3" strokeDasharray="6 5"/><SvgText x={w-margin.right-3} y={y(target)-5} fontSize={9} textAnchor="end" fill="#788796">Ziel</SvgText></>:null}
   <Path d={path} fill="none" stroke={line} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
   {clean.map((p,i)=><Circle key={p.date+'_'+i} cx={x(time[i])} cy={y(p.value)} r={i===clean.length-1?5:3} stroke="white" strokeWidth={2} fill={line}/>)}
   <SvgText x={margin.left} y={h-6} fontSize={10} fill="#98A3B0">{clean[0].date.slice(5)}</SvgText>
   <SvgText x={w-margin.right} y={h-6} textAnchor="end" fontSize={10} fill="#98A3B0">{clean[clean.length-1].date.slice(5)}</SvgText>
 </Svg><Text style={{color:color.muted,fontSize:10,textAlign:'right',marginTop:-4}}>Messwerte in {unit} · zeitlich korrekte Abstände</Text></View>
}
