import {useState, useEffect} from 'react'
import * as firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"

let store
const coll = 'messages'

export function useDatu(room) {
    const [messages, setMessages] = useState([])

    function add(m) {
        setMessages(current => {
            const msgs = [m, ...current]
            msgs.sort((a,b)=> {
                return ((b.ts&&b.ts.seconds)||0) - (a.ts&&a.ts.seconds)||0
            })
            return msgs
        })
    }
    function removed(id) {
        setMessages(current=> current.filter(m=> m.id!==id))
    }
    function onSnap(snap){
        snap.docChanges().forEach(c=>{
            const {doc, type} = c
            if (type==='added') add({...doc.data(),id:doc.id})
            if (type==='removed') removed(doc.id)
        })
    }

    function send(msg){
        if (typeof msg!=='object') return console.log('object plz')
        if (!store) return console.log('initialize first')
        return store.collection(coll).add({
            ...msg,
            ts: new Date(),
        })
    }
    function remove(id){
        if(!id) return console.log('id plz')
        if (!store) return console.log('initialize first')
        return store && store.collection(coll).doc(id).delete()
    }
    
    useEffect(() => {
        if(room) {
            store.collection(coll).where('room','==',room).onSnapshot(onSnap)
        } else {
            store.collection(coll).onSnapshot(onSnap)
        }
    }, [])
    
    return {
        messages, send, remove,
    }
}

export function initialize(firebaseConfig){
    firebase.initializeApp(firebaseConfig)
    store = firebase.firestore()
}
