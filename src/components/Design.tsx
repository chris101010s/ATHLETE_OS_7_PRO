import React from 'react';
import {View,Text,Pressable,TextInput,StyleSheet,ViewStyle,TextStyle,KeyboardTypeOptions,Platform} from 'react-native';
import {GlassView,isGlassEffectAPIAvailable} from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
export const color={bg:'#FAFBFE',white:'#FFFFFF',ink:'#142033',muted:'#758599',line:'#E8EDF3',blue:'#2F6CE8',ice:'#EFF5FF',mint:'#D9F5E8',orange:'#FF8D5C'};
export function Title({children,sub}:{children:React.ReactNode,sub?:string}){return <View style={{marginBottom:22}}><Text style={styles.kicker}>ATHLETE OS  /  PERFORMANCE</Text><Text style={styles.title}>{children}</Text>{sub?<Text style={styles.sub}>{sub}</Text>:null}</View>}
export function Card({children,style}:{children:React.ReactNode;style?:ViewStyle}){return <View style={[styles.card,style]}>{children}</View>}
export function Label({children,style}:{children:React.ReactNode,style?:TextStyle}){return <Text style={[styles.label,style]}>{children}</Text>}
export function Muted({children,style}:{children:React.ReactNode,style?:TextStyle}){return <Text style={[styles.sub,style]}>{children}</Text>}
export function Metric({label,value,unit,style}:{label:string,value:string,unit?:string,style?:ViewStyle}){return <Card style={{flex:1,...style}}><Label>{label}</Label><Text style={styles.metric}>{value}<Text style={{fontSize:15,color:color.muted,fontWeight:'500'}}> {unit||''}</Text></Text></Card>}
export function Button({title,onPress,secondary=false,disabled=false,small=false,danger=false}:{title:string,onPress:()=>void,secondary?:boolean,disabled?:boolean,small?:boolean,danger?:boolean}){return <Pressable disabled={disabled} onPress={()=>{void Haptics.selectionAsync().catch(()=>{});onPress()}} style={[styles.button,secondary&&styles.secondary,small&&{paddingVertical:11,paddingHorizontal:15,minHeight:42},danger&&{backgroundColor:'#FCE7E5'},disabled&&{opacity:0.4}]}><Text style={[styles.buttonText,secondary&&{color:color.ink},danger&&{color:'#A43B31'}]}>{title}</Text></Pressable>}
export function Field({label,value,onChangeText,placeholder,keyboardType,style,multiline=false}:{label:string,value:string,onChangeText:(s:string)=>void,placeholder?:string,keyboardType?:KeyboardTypeOptions,style?:ViewStyle,multiline?:boolean}){return <View style={[{marginBottom:13},style]}><Label>{label}</Label><TextInput style={[styles.input,multiline&&{minHeight:80,textAlignVertical:'top'}]} value={value} onChangeText={onChangeText} placeholder={placeholder||'Eingeben'} placeholderTextColor="#ADB6C1" keyboardType={keyboardType} multiline={multiline} autoCorrect={false}/></View>}
export function Section({title,action}:{title:string,action?:React.ReactNode}){return <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:22,marginBottom:12}}><Text style={{fontSize:19,fontWeight:'700',color:color.ink,letterSpacing:-0.4}}>{title}</Text>{action}</View>}
export function Empty({title,text}:{title:string,text:string}){return <View style={{paddingVertical:24,alignItems:'center'}}><Text style={{fontSize:34,marginBottom:9}}>◌</Text><Text style={{fontSize:17,fontWeight:'700',color:color.ink}}>{title}</Text><Text style={{color:color.muted,textAlign:'center',lineHeight:21,marginTop:6}}>{text}</Text></View>}
export function Chip({text,active,onPress}:{text:string,active?:boolean,onPress:()=>void}){return <Pressable onPress={onPress} style={{paddingVertical:10,paddingHorizontal:14,borderRadius:50,backgroundColor:active?color.ink:color.white,borderWidth:1,borderColor:active?color.ink:color.line,marginRight:8,marginBottom:8}}><Text style={{color:active?'white':color.ink,fontSize:12,fontWeight:'700'}}>{text}</Text></Pressable>}
export function GlassBar({children}:{children:React.ReactNode}){const glass=Platform.OS==='ios'&&isGlassEffectAPIAvailable();return glass?<GlassView glassEffectStyle="regular" isInteractive style={styles.glass}>{children}</GlassView>:<View style={[styles.glass,{backgroundColor:'#FFFFFFF2'}]}>{children}</View>}
export const styles=StyleSheet.create({
 kicker:{fontSize:10,letterSpacing:2.3,color:color.blue,fontWeight:'800',marginBottom:7},
 title:{fontSize:34,letterSpacing:-1.6,fontWeight:'800',color:color.ink},
 sub:{fontSize:13,lineHeight:20,color:color.muted,marginTop:5},
 card:{backgroundColor:color.white,padding:19,borderRadius:23,borderWidth:1,borderColor:'#EBEFF5',shadowColor:'#6C819E',shadowOpacity:0.045,shadowRadius:15,shadowOffset:{width:0,height:6},elevation:1},
 label:{fontSize:11,letterSpacing:0.7,color:color.muted,fontWeight:'700',marginBottom:7,textTransform:'uppercase'},
 metric:{fontSize:29,fontWeight:'800',color:color.ink,letterSpacing:-1},
 button:{backgroundColor:color.ink,paddingVertical:15,paddingHorizontal:20,minHeight:51,justifyContent:'center',alignItems:'center',borderRadius:17},
 buttonText:{fontSize:14,fontWeight:'700',color:'#FFFFFF'},
 secondary:{backgroundColor:'#ECF0F6'},
 input:{borderWidth:1,borderColor:color.line,borderRadius:15,paddingHorizontal:14,paddingVertical:12,minHeight:48,color:color.ink,fontSize:16,backgroundColor:'#F8FAFC'},
 glass:{minHeight:68,borderRadius:27,marginHorizontal:15,marginBottom:6,paddingHorizontal:8,paddingVertical:7,flexDirection:'row',justifyContent:'space-around',alignItems:'center',overflow:'hidden',borderWidth:0.5,borderColor:'#E0E5EC'},
});
