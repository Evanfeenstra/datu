# datu

```js

import {initialize, useDatu} from 'datu'

initialize(firebaseConfig)

function App(){
    const {messages, send, remove} = useDatu()
    return <main>

        {messages.map(m=>{
            return <Message {...m} />
        })}

        <TextInput onSend={text=> send({text})}>

    </main>
}

```