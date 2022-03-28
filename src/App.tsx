import { useState } from 'react';
import styled from 'styled-components';
import languages from './languages';
import quotes from './quotes';
import spotifyIcon from './spotify.svg';


const AppStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  padding: 1rem;
`

const Quote = styled.h1`
  width: 75vw;
  text-align: center;
  margin: 0.5rem;
  font-size: 2.5em;
`
const SpotifyLink = styled.a`
  justify-content: center;
  display: flex;
`

const SpotifyIcon = styled.img`
  position: absolute;
  bottom: 5%;
  width: 10vw;
`

const LanguageSelector = styled.div`
  position: absolute;
  top: 0%;
  left: 0%;
  user-select: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
`

const Languages = styled.ul`

`

const Language = styled.li`
  font-size: 1.25em;
  list-style-type: none;
  padding: 0;
  padding-right: 1rem;
  margin: 0;
  float: left;
  cursor: pointer;
`

const getRandomQuote = (language: string | null) => {
  const filteredQuotes = quotes.filter(quote => RegExp(language || '.*').test(quote.lang))
  return filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)]
}

const getQuoteById = (trackId: string) => {
  const filteredQuotes = quotes.filter(quote => quote.trackId === trackId)
  if (filteredQuotes.length === 1) {
    return filteredQuotes[0]
  }
}

function App() {
  const [ language, setLanguge ] = useState(sessionStorage.getItem('language') || '.*')

  let quote = null

  const pathname = window.location.pathname.slice(1).split('/')
  if (pathname) {
    quote = getQuoteById(pathname[pathname.length - 1])  
  }
  if (!quote) {
    quote = getRandomQuote(language)
  }

  return (
    <>
      <LanguageSelector>
        <Languages>
          { languages.map((lang, index) => <Language style={language === lang.code ? { textDecoration: 'underline' } : {}} key={index} onClick={() => {
            setLanguge(lang.code)
            sessionStorage.setItem('language', lang.code)
            }}><p>{lang.name}</p></Language>)}
        </Languages>
      </LanguageSelector>
      <AppStyle className='app'>
        { quote.quote.split('\n').map((quoteStr, index) => <Quote key={index}>{ quoteStr }</Quote>)}
        <SpotifyLink href={`https://open.spotify.com/track/${quote.trackId}`} target='_blank' rel='noreferrer'><SpotifyIcon src={spotifyIcon} alt='spotify icon'/></SpotifyLink>
      </AppStyle>
    </>
  );
}

export default App;
