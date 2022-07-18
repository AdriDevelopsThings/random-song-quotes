import { useEffect, useState } from 'react';
import styled from 'styled-components';
import languages from './languages';
import quotes from './quotes';
import spotifyIcon from './spotify.svg';
import shuffleIcon from './shuffle.png';
import * as ackee from 'ackee-tracker'


const AppStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  padding: 1rem;
`
const Quote = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 2rem;
  box-sizing: border-box;
`

const QuoteLine = styled.h1`
  width: 75vw;
  text-align: center;
  margin: 0.5rem;
  font-size: 2.25em;
`
const SpotifyLink = styled.a`
  display: flex;
  justify-content: center;
  margin: 3rem;
`

const SpotifyIcon = styled.img`
  max-width: 50%;
  width: 30%;
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

const Shuffle = styled.div`
  position: fixed;
  bottom: 3vh;
  left: 3vw;
  cursor: pointer;
`

const ShuffleIcon = styled.img`
  max-width: 50%;
  width: 25%;
`

const getAlreadyUsedQuotes = () => sessionStorage.getItem('quotes') ? JSON.parse(sessionStorage.getItem('quotes')!) : []

const addAlreadyUsedQuote = (trackId: string) => {
  const quotes = getAlreadyUsedQuotes()
  if (!quotes.includes(trackId))
    quotes.push(trackId)
  sessionStorage.setItem('quotes', JSON.stringify(quotes))
}

const getRandomQuote = (language: string | null): { trackId: string, lang: string, quote: string } => {
  const alreadyUsedQuotes = getAlreadyUsedQuotes()
  const filteredQuotes = quotes.filter(quote => RegExp(language || '.*').test(quote.lang)).filter(quote => !alreadyUsedQuotes.includes(quote.trackId))
  if (filteredQuotes.length === 0 ) {
    sessionStorage.removeItem('quotes')
    return getRandomQuote(language)
  }
  const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)]
  addAlreadyUsedQuote(quote.trackId)
  return quote
}

const getQuoteById = (trackId: string) => {
  const filteredQuotes = quotes.filter(quote => quote.trackId === trackId)
  if (filteredQuotes.length === 1) {
    return filteredQuotes[0]
  }
}

function App() {
  if (process.env.NEXT_PUBLIC_ACKEE_UUID) {
    ackee.create('https://ackee.adridoesthings.com', { ignoreLocalhost: true, ignoreOwnVisits: false, detailed: true }).record('f9cadca5-2fd4-4c3c-b0a6-d5310d6bada3')
  }
  const [ language, setLanguge ] = useState(sessionStorage.getItem('language') || '.*')
  const [ quote, setQuote ] = useState({ trackId: '', lang: 'en', quote: ''})

  useEffect(() => {
    const pathname = window.location.pathname.slice(1).split('/')
    if (pathname) {
      setQuote(getQuoteById(pathname[pathname.length - 1])!)
    } else {
      setQuote(getRandomQuote(language))
    } 
  }, [])

  useEffect(() => setQuote(getRandomQuote(language)), [language])

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
        <Quote>{ quote.quote.split('\n').map((quoteStr, index) => <QuoteLine key={index}>{ quoteStr }</QuoteLine>)}</Quote>
        <SpotifyLink href={`https://open.spotify.com/track/${quote.trackId}`} target='_blank' rel='noreferrer'><SpotifyIcon src={spotifyIcon} alt='spotify icon'/></SpotifyLink>
      </AppStyle>
      <Shuffle>
        <ShuffleIcon src={shuffleIcon} onClick={e => setQuote(getRandomQuote(language))} />
      </Shuffle>
    </>
  );
}

export default App;
