import {useState} from 'react';
export default function App(){
 const [text,setText]=useState('');
 return <div style={{padding:20}}><h1>Location Generator</h1><textarea value={text} onChange={e=>setText(e.target.value)} rows={10} cols={50}/></div>
}