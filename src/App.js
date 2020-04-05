import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import './App.css'

function App() {
	return (
		<div className='App'>
			<header>Hi, you might be able to help me with a problem</header>
			<p>
				Here I will explain what I'm building and what I am trying to do. I have
				a React.js application receiving updates from the Twitch API via
				websockets (<code>socket.io</code>)
			</p>
			<p>
				Here I will explain the problem, the expected behavior, code, outputs,
				etc.
			</p>
			<p>Make me a code section</p>
			<div className='code'>
				<span>JavaScript</span>
				<SyntaxHighlighter language='javascript' style={docco}>
					{`let foo = 'bar'`}
				</SyntaxHighlighter>
			</div>
		</div>
	)
}

export default App

// code highlighting?
