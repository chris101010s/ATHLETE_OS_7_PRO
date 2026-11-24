import React,{useMemo} from 'react';
import {View,Text,Pressable} from 'react-native';
import {useAthlete} from '../data/context';
import {sortedWeight,dateKey,rollingWeight,estimatedOneRepMax} from '../utils/metrics';
import {Title,Card,Button,Section,Metric,Label,Muted,color,Empty} from '../components/Design';
import {TrendChart} from '../components/TrendChart';
import {weeklyAdherence,balanceSummary} from '../utils/advanced';
const QUOTES=[
 'Du brauchst keine perfekte Woche. Du brauchst den nächsten sauberen Satz.',
 'Ausreden verbrennen keine Kalorien. Bewegung schlägt Diskussion.',
 'Die Waage zählt Kilos. Der Trainingslog zählt Taten.',
 'Muskeln bauen sich nicht durch Wunschdenken. Logge dein Training.',
 'Wer sein Gewicht trackt, kämpft gegen Fakten statt Gefühle.',
 'Der Pausentimer ist für deine Muskeln. Nicht für endloses Scrollen.',
 'Technik zuerst. Ego hebt heute nicht mit.',
 'Satz für Satz. Woche für Woche. Kein Abkürzungs-Menü.',
 'Auch Profis haben Ruhetage. Aber keine Fantasie-Workouts.',
 'Ein ausgelassenes Training ist kein Weltuntergang. Wiederkommen ist der Job.',
 'Hör auf, nur den perfekten Plan zu suchen. Mach den nächsten Schritt.',
 'Neue Woche, gleicher Auftrag: dokumentieren statt diskutieren.',
 'Keiner wird athletisch vom Anschauen seiner Gym-Playlist.',
 'Wenn du keinen Bock hast, starte trotzdem mit dem Warm-up.',
 'Schlaf ist Recovery. Endloses Scrollen ist kein Trainingsplan.'
];
export function HomeScreen({go}:{go:(tab:string)=>void}){
 const {data,update}=useAthlete();const weights=sortedWeight(data.weights);const last=weights[weights.length-1];
 const logged=data.habitChecks[dateKey()]||[];const workouts=[...data.workouts].sort((a,b)=>b.finishedAt.localeCompare(a.finishedAt));
 const week=workouts.filter(w=>Date.now()-Date.parse(w.finishedAt)<7*86400000).length;
 const recentWeights=rollingWeight(weights).slice(-30);
 const plan=data.weeklyPlan.find(p=>p.day===new Date().getDay());const plannedName=plan?(plan.routineId?data.routines.find(r=>r.id===plan.routineId)?.name||'Freies Workout':'Freies Workout'):null;const adherence=weeklyAdherence(data);const recent=balanceSummary(data);
 const title=data.profile.name.trim()?`Hey, ${data.profile.name.trim()}`:'Dein Fortschritt.';
 return <View><Title sub="Ein Training nach dem anderen.">{title}</Title>
 <Card style={{backgroundColor:'#EDF4FF',borderColor:'#E0EAFE',marginBottom:14}}><Text style={{color:color.blue,fontSize:11,letterSpacing:2,fontWeight:'800'}}>DAILY COACH  /  ATHLETE OS</Text><Text style={{fontSize:23,fontWeight:'800',color:color.ink,letterSpacing:-.5,marginTop:12,lineHeight:31}}>{data.settings.coach?QUOTES[new Date().getDate()%QUOTES.length]:'Deine Gesundheit. Dein Tempo.'}</Text><Text style={{color:'#7C8EAD',marginTop:12,fontSize:12}}>SHOW UP · TRACK IT · PROGRESS</Text></Card>
 <View style={{flexDirection:'row',gap:10}}><Metric label="Gewicht" value={last?last.kg.toFixed(1):'–'} unit="kg"/><Metric label="Workouts · 7 Tage" value={String(week)} /></View>
 <Section title="Dein Fokus"/>
 {plannedName?<Card style={{backgroundColor:'#EBF7F0',borderColor:'#D1E9DC',marginBottom:11}}><Label>DEIN WOCHENPLAN · HEUTE</Label><Text style={{fontSize:19,fontWeight:'800',color:color.ink}}>{plannedName}</Text><Muted>{adherence.actual} Trainings in dieser Woche dokumentiert</Muted><View style={{marginTop:10}}><Button small title="Training öffnen" onPress={()=>go('gym')}/></View></Card>:null}
 <Card><View style={{flexDirection:'row',gap:10}}><View style={{flex:1}}><Label>Trainingsmodus</Label><Text style={{fontSize:17,color:color.ink,fontWeight:'800',marginBottom:12}}>{data.live?'Training fortsetzen':'Nächstes Workout starten'}</Text></View><Text style={{fontSize:35}}>⌁</Text></View><Button title={data.live?'Zum aktiven Workout':'Gym-Modus öffnen'} onPress={()=>go('gym')}/></Card>
 <Section title="Gewichtsverlauf" action={<Pressable onPress={()=>go('weight')}><Text style={{color:color.blue,fontWeight:'700'}}>Alle Daten →</Text></Pressable>}/>
 <Card><TrendChart points={recentWeights.map(x=>({date:x.date,value:x.average}))} target={data.profile.targetKg} height={170}/>{weights.length===0?<Muted>Trage deine erste Messung im Gewicht-Tab ein.</Muted>:null}</Card>
 <Section title="Gewohnheiten heute" action={<Pressable onPress={()=>go('more')}><Text style={{color:color.blue,fontWeight:'700'}}>Anpassen →</Text></Pressable>}/>
 <Card>{data.habits.length?data.habits.slice(0,5).map(h=><Pressable key={h.id} onPress={()=>{update(s=>{const day=dateKey();const done=s.habitChecks[day]||[];return {...s,habitChecks:{...s.habitChecks,[day]:done.includes(h.id)?done.filter(x=>x!==h.id):[...done,h.id]}}})}} style={{paddingVertical:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderColor:color.line}}><Text style={{fontSize:15,color:color.ink}}>{h.title}</Text><Text style={{fontWeight:'800',fontSize:17,color:logged.includes(h.id)?color.blue:color.muted}}>{logged.includes(h.id)?'✓':'○'}</Text></Pressable>):<Empty title="Keine Gewohnheiten" text="Erstelle eigene Tagesziele und hake sie ab."/>}</Card>
 <Section title="Leistung" action={<Pressable onPress={()=>go('insights')}><Text style={{color:color.blue,fontWeight:'800'}}>Performance →</Text></Pressable>}/>
 <View style={{flexDirection:'row',gap:10}}><Metric label="Gespeicherte Sätze" value={String(data.workouts.reduce((s,w)=>s+w.sets.length,0))}/><Metric label="Ausdauereinheiten" value={String(data.cardio.length)}/></View>
 <Card style={{marginTop:10}}><Label>LETZTE 28 TAGE</Label><Muted>{recent.sessions} Gym-Einheiten · {recent.totalSets} Arbeitssätze · {recent.cardioMin} Cardio-Minuten</Muted><View style={{marginTop:10}}><Button secondary small title="Ziele, Rekorde & Körpermaße" onPress={()=>go('insights')}/></View></Card>
 <View style={{height:12}}/>
 </View>
}
