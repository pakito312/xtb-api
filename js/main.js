import XAPI from 'xapi-node'
const mode="demo";
const userId="12734617"
const password="Stankovicandreja1"
const x = new XAPI({
    accountId: '(xStation5) accountID',
    password: '(xStation5) password',
    host: 'ws.xtb.com', // only for XTB accounts
    type: 'demo' // or demo
})

x.connect()

x.onReady(() => {
    console.log('Connection is ready')
    
    // Disconnect
    x.disconnect().then(() => console.log('Disconnected'))
})
x.onReject((e) => {
    console.error(e)
})