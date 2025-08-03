import styles from './app.module.css'
import { useEffect, useState } from 'react'

import { WORDS, type Challenge } from './utils/words'

import { Button } from './components/Button'
import { Input } from './components/Input'
import { Tip } from './components/Tip'
import { Letter } from './components/Letter'
import { Header } from './components/Header'
import { LettersUsed, type LettersUsedProps } from './components/LettersUsed'

export default function App() {
  const [letter, setLetter] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [lettersUsed, setLettersUsed] = useState<LettersUsedProps[]>([])
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>(
    'playing',
  )
  const [revealedLetters, setRevealedLetters] = useState<string[]>([])

  const maxAttempts = 10

  function handleRestartGame() {
    setAttempts(0)
    setLetter('')
    setLettersUsed([])
    setGameStatus('playing')
    setRevealedLetters([])
    startGame()
  }

  function startGame() {
    const index = Math.floor(Math.random() * WORDS.length)
    const randomWord = WORDS[index]
    setChallenge(randomWord)
  }

  function checkGameEnd(newRevealedLetters: string[], newAttempts: number) {
    if (!challenge) return

    // Verifica se todas as letras foram descobertas
    const allLettersRevealed = challenge.word
      .split('')
      .every((letter) => newRevealedLetters.includes(letter.toUpperCase()))

    if (allLettersRevealed) {
      setGameStatus('won')
      setTimeout(() => {
        alert('Parabéns! Você ganhou! 🎉')
      }, 100)
    } else if (newAttempts >= maxAttempts) {
      setGameStatus('lost')
      setTimeout(() => {
        alert(`Você perdeu! A palavra era: ${challenge.word} 😢`)
      }, 100)
    }
  }

  function handleConfirm() {
    if (!challenge || gameStatus !== 'playing') {
      return
    }

    if (!letter.trim()) {
      return alert('Insira uma letra!')
    }

    const value = letter.toUpperCase()
    const exists = lettersUsed.find(
      (used) => used.value.toUpperCase() === value,
    )

    if (exists) {
      return alert('Você já utilizou a letra ' + value)
    }

    // Verifica se a letra está na palavra
    const isCorrect = challenge.word.toUpperCase().includes(value)

    // Adiciona a letra à lista de letras usadas
    const newLettersUsed = [...lettersUsed, { value, correct: isCorrect }]
    setLettersUsed(newLettersUsed)

    let newAttempts = attempts
    let newRevealedLetters = [...revealedLetters]

    if (isCorrect) {
      // Se acertou, revela todas as ocorrências da letra
      newRevealedLetters = [...new Set([...revealedLetters, value])]
      setRevealedLetters(newRevealedLetters)
    } else {
      // Se errou, incrementa tentativas
      newAttempts = attempts + 1
      setAttempts(newAttempts)
    }

    setLetter('')

    // Verifica se o jogo terminou
    checkGameEnd(newRevealedLetters, newAttempts)
  }

  // Função para verificar se uma letra deve ser mostrada
  function shouldShowLetter(letter: string): boolean {
    return revealedLetters.includes(letter.toUpperCase())
  }

  useEffect(() => {
    startGame()
  }, [])

  if (!challenge) {
    return <div>Carregando...</div>
  }

  return (
    <div className={styles.container}>
      <main>
        <Header
          current={attempts}
          max={maxAttempts}
          onRestart={handleRestartGame}
        />
        <Tip tip={challenge.tip} />
        <div className={styles.word}>
          {challenge.word.split('').map((wordLetter, index) => (
            <Letter
              key={index}
              value={
                shouldShowLetter(wordLetter) ? wordLetter.toUpperCase() : ''
              }
            />
          ))}
        </div>

        <h4>Palpite</h4>

        <div className={styles.guess}>
          <Input
            autoFocus
            maxLength={1}
            placeholder="?"
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            disabled={gameStatus !== 'playing'}
          />

          <Button
            title="Confirmar"
            onClick={handleConfirm}
            disabled={gameStatus !== 'playing'}
          />
        </div>

        <LettersUsed data={lettersUsed} />

        {gameStatus === 'won' && (
          <div
            style={{ textAlign: 'center', marginTop: '20px', color: 'green' }}
          >
            <h3>🎉 Parabéns! Você ganhou! 🎉</h3>
          </div>
        )}

        {gameStatus === 'lost' && (
          <div style={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>
            <h3>😢 Você perdeu!</h3>
            <p>
              A palavra era: <strong>{challenge.word}</strong>
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
