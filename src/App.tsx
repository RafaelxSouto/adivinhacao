import styles from './app.module.css'
import { Tip } from './components/Tip'
import { Header } from './components/Header'

export default function App() {
  function handleRestartGame() {
    alert('Gatilho executado!')
  }

  return (
    <div className={styles.container}>
      <main>
        <Header current={5} max={10} onRestart={handleRestartGame} />
        <Tip tip="Uma das Linguagens de programação mais utilizadas" />
      </main>
    </div>
  )
}
