import styles from './app.module.css'
import { useEffect, useState } from 'react'

import { WORDS, Challenge } from './utils/words'

import { Button } from './components/Button'
import { Input } from './components/Input'
import { Tip } from './components/Tip'
import { Letter } from './components/Letter'
import { Header } from './components/Header'
import { LettersUsed, LettersUsedProps } from './components/LettersUsed'

export default function App() {
  const [letter, setLetter] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [lettersUsed, setLettersUsed] = useState<LettersUsedProps>([])
  const [challenge, setChallenge] = useState<Challenge | null>(null)

  function handleRestartGame() {
    alert('Gatilho executado!')
  }

  function startGame() {
    const index = Math.floor(Math.random())
    const randomWord = WORDS[index]
    setChallenge(randomWord)

    setAttempts(0)
    setLetter('')
  }

  function handleConfirm() {
    if (!challenge) {
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
  }

  useEffect(() => {
    startGame()
  })
  if (!challenge) {
    return

    setLettersUsed((prevState) => [...prevState, { value, correct: false }])

    setLetter('')
  }

  return (
    <div className={styles.container}>
      <main>
        <Header current={attempts} max={10} onRestart={handleRestartGame} />
        <Tip tip="Uma das Linguagens de programação mais utilizadas" />
        <div className={styles.word}>
          {challenge.word.split('').map(() => (
            <Letter value="" />
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
          />

          <Button title="Confirmar" onClick={handleConfirm} />
        </div>

        <LettersUsed data={lettersUsed} />
      </main>
    </div>
  )
}
