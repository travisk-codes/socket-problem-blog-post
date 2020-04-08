import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import './App.css'

const paragraph1 =
	'I have a simple React.js client communicating with a Node.js server via socket.io. When running from my local machine, the Node.js server is listening on port 7781 '

const paragraph2 =
	'The server also has Twitch API webhooks listening to follower and stream title changes, which are then emitted via socket.io. Specifically, Twitch credentials and a reverse-proxy webhook config are passed to a new webhook listener, which subscribes callbacks to the two different events.'

const paragraph3 =
	'Here is the true code for the React component, listening for each event hooked up to each webhook subscription.'

const clientSocketCode = `import React from 'react'
import socketIOClient from 'socket.io-client'

const socket = socketIOClient('http://localhost:7781')

const App = () => {
	const [someText, setSomeText] = React.useState('')
	React.useEffect(() => {
		const onDataChange = data => setSomeText(data)
		socket.on('dataChange', onDataChange)
		return () => socket.off('dataChange', onDataChange)
	})

	// ...
}
`

const serverSocketCode = `const express = require('express')
const http = require('http')
const io = require('socket.io')

const app = express()
const server = http.createServer(app)
const socket = io(server, { origins: '*:*' })

// ...

socket.on('connection', async socket => {
	let data // then get some data...
	socket.emit('dataChange', data)
})

server.listen(7781)
`

const serverWebhookCode = `const TwitchClient = require('twitch').default
const HelixFollow = require('twitch').HelixFollow
const HelixStream = require('twitch').HelixStream
const WebhookListener = require('twitch-webhooks').default

const { userId, clientId, secret } = require('./config')
const twitchClient = TwitchClient
	.withClientCredentials(clientId, secret)
const webhookConfig = {
	hostName: '1a2b3c4d.ngrok.io',
	port: 8090,
	reverseProxy: { port: 443, ssl: true },
}

// ...

const getWebhookSubscriptions = async () => {
	const listener = await WebhookListener
		.create(twitchClient, webhookConfig)
	listener.listen()
	const streamChangeSubscription = await listener
		.subscribeToStreamChanges(userId, onStreamChange)
	const followSubscription = await listener
		.subscribeToFollowsToUser(userId, onNewFollow)
}

const onStreamChange = (stream = HelixStream) => {
	if (stream) socket.emit('streamChange', stream)
}

const onFollow = (follow = HelixFollow) => {
	if (follow) socket.emit('follow', follow)
}

const subscriptions = getWebhookSubscriptions()

// ...
`

const clientSocketCode2 = `const App = () => {
	const [follow, setFollow] = React.useState('')
	const [stream, setStream] = React.useState('')
	React.useEffect(() => {
		socket.on('follow', data => setFollow(data))
		socket.on('streamChange', data => setStream(data))

		return () => {
			socket.off('follow', data => setFollow(data))
			socket.off('streamChange', data => setStream(data))
		})

	// ...
}
`

const nginxConfiguration = `server {

	server_name twitch-webhook.travisk.info;

	location / {
					proxy_pass http://localhost:8090;
					#proxy_http_version 1.1;
					#proxy_set_header Upgrade $http_upgrade;
					#proxy_set_header Connection 'upgrade';
					proxy_set_header Host $host;
					#proxy_cache_bypass $http_upgrade;
					proxy_redirect off;
					proxy_buffering off;
					proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
					proxy_set_header X-Forwarded-Ssl on;
	}
`

const CodeBlock = ({ title, code, language }) => {
	return (
		<div className='code'>
			<span>{title}</span>
			<SyntaxHighlighter
				customStyle={{ padding: '2em', borderRadius: '.5em' }}
				language={language || 'javascript'}
				style={atomOneDark}>
				{code}
			</SyntaxHighlighter>
		</div>
	)
}

function App() {
	return (
		<div className='App'>
			<header>Hi, you might be able to help me with a problem</header>
			<p>{paragraph1}</p>
			<CodeBlock title='Local Client' code={clientSocketCode} />
			<CodeBlock title='Local Server' code={serverSocketCode} />
			<p>{paragraph2}</p>
			<CodeBlock title='Local Server' code={serverWebhookCode} />
			<p>{paragraph3}</p>
			<CodeBlock title='Local Client' code={clientSocketCode2} />
			<p>
				The full code for the client can be found{' '}
				<a href='https://github.com/travisk-codes/twitch-overlay/blob/master/src/App.js'>
					here
				</a>{' '}
				and the full server code can be found{' '}
				<a href='https://github.com/travisk-codes/twitch-overlay/blob/master/server.js'>
					here
				</a>
				. When all of this is run from my local computer, serving the client
				over 7781 and using an ngrok address as a reverse proxy for the webhook
				over 8090, everything works fine. It is when I move the all this to my
				remote server that it no longer works. Here is my NGINX configuration
				for https://twitch-webhook.travisk.info, the address I'm using for the
				reverse proxy instead of ngrok:
			</p>
			<CodeBlock
				title='NGINX Config'
				code={nginxConfiguration}
				language='nginx'
			/>
		</div>
	)
}

export default App

// code highlighting?
