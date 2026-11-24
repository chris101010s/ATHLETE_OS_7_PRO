import React,{useEffect,useState} from 'react';
import {View,Text,ScrollView,Pressable,ActivityIndicator,StatusBar,KeyboardAvoidingView,Platform,Alert} from 'react-native';
import {SafeAreaProvider,SafeAreaView} from 'react-native-safe-area-context';
import {AthleteProvider,useAthlete} from './src/data/context';
import {HomeScreen} from './src/screens/Home';
import {WeightScreen} from './src/screens/Weight';
import {GymScreen} from './src/screens/Gym';
import {InsightsScreen} from './src/screens/Insights';
import {MoreScreen} from './src/screens/More';
import {GlassBar,Title,Card,Button,Field,color,Muted} from './src/components/Design';
import {numberInput,validWeight} from './src/utils/metrics';
import {LinearGradient} from 'expo-linear-gradient';
import Svg,{Path,Circle,Line,Rect} from 'react-native-svg';
import * as DocumentPicker from 'expo-document-picker';
import {File} from 'expo-file-system';
import {parseAthleteBackup} from './src/data/validation';
const tabs=[['home','Heute'],['gym','Gym'],['weight','Gewicht'],['insights','Analyse'],['more','Mehr']] as const;
function TabIcon({name,active}:{name:string;active:boolean}){
 const ink=active?color.blue:'#8A97A8';const common={stroke:ink,strokeWidth:2,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
 return <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...common}>
 {name==='home'?<Path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>:
 name==='gym'?<><Line x1="6" y1="12" x2="18" y2="12"/><Path d="M4 7v10 M7 6v12 M17 6v12 M20 7v10"/></>:
 name==='weight'?<><Path d="M4 18V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><Path d="m9 12 3-4 3 4"/></>:
 name==='insights'?<><Rect x="3.5" y="12" width="4" height="8" rx="1"/><Rect x="10" y="7" width="4" height="13" rx="1"/><Rect x="16.5" y="3" width="4" height="17" rx="1"/></>:
 <><Circle cx="5" cy="12" r="1.6"/><Circle cx="12" cy="12" r="1.6"/><Circle cx="19" cy="12" r="1.6"/></>}
 </Svg>
}

function Onboarding(){const {data,update}=useAthlete();const [name,setName]=useState('');const [target,setTarget]=useState('');return <ScrollView contentContainerStyle={{flexGrow:1,justifyContent:'center',padding:26,backgroundColor:color.bg}} keyboardShouldPersistTaps="handled">
 <LinearGradient colors={['#E2EDFF','#F7F8FB']} style={{height:135,borderRadius:35,justifyContent:'center',alignItems:'center',marginBottom:30}}><Text style={{fontWeight:'900',fontSize:48,color:color.ink}}>A</Text><Text style={{fontSize:10,fontWeight:'800',letterSpacing:4,color:color.blue}}>ATHLETE OS</Text></LinearGradient>
 <Title sub="Dein persönliches Trainingssystem. Alles startet leer und bleibt auf deinem Gerät.">Built by you.</Title>
 <Card><Field label="Dein Name (optional)" value={name} onChangeText={setName} placeholder="Wie dürfen wir dich nennen?"/><Field label="Langfristiges Gewichtsziel (optional, kg)" value={target} onChangeText={setTarget} keyboardType="decimal-pad" placeholder="Du kannst das später eingeben"/>
 <Muted>Keine Demodaten. Keine automatische Vorgabe. Du kannst alle Ziele jederzeit anpassen oder weglassen.</Muted><View style={{marginTop:17}}><Button title="Meine App starten" onPress={()=>{const t=target.trim()?numberInput(target):null;if(t!==null&&!validWeight(t)){Alert.alert('Ziel prüfen','Bitte gültiges Gewicht eingeben oder leer lassen.');return}update(d=>({...d,profile:{name:name.trim(),targetKg:t,startingKg:null,onboarded:true}}))}}/></View></Card>
 <Text style={{textAlign:'center',marginTop:30,color:color.muted,fontSize:11}}>PRIVATE BY DEFAULT. NO ACCOUNT NEEDED.</Text>
 </ScrollView>}
function Main(){const {data,ready,fault,faultOrigin,replace,retrySave}=useAthlete();const [tab,setTab]=useState<string>('home');
 if(!ready)return <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:color.bg}}><ActivityIndicator color={color.blue}/><Text style={{color:color.muted,marginTop:13}}>Daten werden geladen …</Text></View>;
 if(fault)return <View style={{flex:1,padding:30,justifyContent:'center',backgroundColor:color.bg}}><Text style={{fontWeight:'800',fontSize:24,color:'#B44E49'}}>Speicherfehler</Text><Text style={{marginTop:15,marginBottom:14,color:color.ink}}>{fault}</Text><Muted>Deine gespeicherten Daten werden nicht automatisch gelöscht. Bei einem vorübergehenden Schreibfehler kannst du es erneut versuchen oder ein eigenes Backup einspielen.</Muted>{faultOrigin==='save'?<View style={{marginTop:18,marginBottom:8}}><Button secondary title="Speichern erneut versuchen" onPress={retrySave}/></View>:null}<View style={{marginTop:12}}><Button title="Backup zur Wiederherstellung auswählen" onPress={()=>void (async()=>{try{const result=await DocumentPicker.getDocumentAsync({type:['application/json','text/plain','application/octet-stream'],copyToCacheDirectory:true});if(result.canceled)return;const raw=await new File(result.assets[0].uri).text();const restored=parseAthleteBackup(raw);Alert.alert('Backup einspielen?', 'Die derzeitigen App-Daten werden durch dein gewähltes Backup ersetzt.',[{text:'Abbrechen',style:'cancel'},{text:'Wiederherstellen',onPress:()=>replace(restored)}]);}catch(e){Alert.alert('Backup konnte nicht gelesen werden',String((e as Error).message))}})()}/></View></View>;
 if(!data.profile.onboarded)return <Onboarding/>;
 return <View style={{flex:1,backgroundColor:color.bg}}><ScrollView key={tab} keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingHorizontal:19,paddingTop:24,paddingBottom:125}}>
 {tab==='home'?<HomeScreen go={setTab}/>:tab==='gym'?<GymScreen/>:tab==='weight'?<WeightScreen/>:tab==='insights'?<InsightsScreen/>:<MoreScreen/>}
 </ScrollView>
 <View style={{position:'absolute',bottom:0,left:0,right:0}}><GlassBar>{tabs.map(([key,label])=><Pressable accessibilityRole="tab" accessibilityState={{selected:tab===key}} onPress={()=>setTab(key)} key={key} style={{flex:1,alignItems:'center',paddingTop:4,paddingBottom:2,gap:2}}><TabIcon name={key} active={tab===key}/><Text style={{fontSize:10,fontWeight:tab===key?'800':'600',color:tab===key?color.blue:color.muted}}>{label}</Text></Pressable>)}</GlassBar></View>
 </View>
}
export default function App(){return <SafeAreaProvider><StatusBar barStyle="dark-content"/><SafeAreaView style={{flex:1,backgroundColor:color.bg}} edges={['top','bottom']}><AthleteProvider><Main/></AthleteProvider></SafeAreaView></SafeAreaProvider>}
