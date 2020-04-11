import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import './App.css'

const clientSocketCode = `import React from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:3010')

const App = () => {
	React.useEffect(() => {
		socket.on('connect', () => {
			console.log('websocket connected to server')
			socket.emit('from-client', 'hello from client')
			socket.on('from-server', (data) => console.log(data))
		})
		return () => socket.off('from-server')
	}, [])

	return <div className='App' />
}

export default App
`

const serverSocketCode = `const express = require('express')
const http = require('http')
const io = require('socket.io')
const cors = require('cors')

const app = express()
app.use(cors())
const server = http.createServer(app)
const socket = io(server, { origins: '*:*' })

socket.on('connection', () => {
	console.log('websocket connected to client')

	socket.on('disconnect', () =>
		console.log('websocket disconnected from client'),
	)

	socket.on('from-client', (data) => {
		console.log(data)
	})

	socket.emit('from-server', 'hello from server')
})

server.listen(3010)

`

const CodeBlock = ({ title, code, language }) => {
	return (
		<div className='code'>
			<span>{title}</span>
			<SyntaxHighlighter
				customStyle={{ padding: '2em' }}
				language={language || 'javascript'}
				style={gruvboxDark}>
				{code}
			</SyntaxHighlighter>
		</div>
	)
}

function App() {
	return (
		<div className='App'>
			<header>
				<span id='title'>Hi, you might be able to help me with a problem</span>
				<span id='subtitle'>
					Concerning <code>React.js</code>, <code>Express.js</code>, and{' '}
					<code>Socket.io</code>
				</span>
			</header>
			<p>
				I have a simple <code>React.js</code> client communicating with a{' '}
				<code>Node.js</code> ( <code>Express.js</code> ) server via websockets ({' '}
				<code>Socket.io</code> ). The server is running on my local machine, and
				communicating with the client via <code>http://localhost:3010</code>.
				Below is the code for the client and the server:
			</p>
			<CodeBlock title='Client' code={clientSocketCode} />
			<CodeBlock title='Server' code={serverSocketCode} />
			<p>
				The client console displays <code>websocket connected to server</code>{' '}
				and <code>hello from server</code>. The server console displays{' '}
				<code>websocket connected to client</code>, but does not display{' '}
				<code>hello from client</code>. Is there an obvious reason why the
				server fails to do so? I would greatly appreciate any help with this
				problem. Please let me know if there's any other information I can
				provide to clarify the issue.
			</p>
			<p>♥️ Travis</p>
		</div>
	)
}

export default App

// code highlighting?
