/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

// I created an array of words for the Scramble game.
// I made sure the words do not contain spaces or special characters.
const DEFAULT_WORDS = [
  "react",
  "javascript",
  "browser",
  "storage",
  "monitor",
  "keyboard",
  "college",
  "student",
  "network",
  "screen"
];

// I set the maximum number of strikes before the game ends.
const MAX_STRIKES = 3;

// I set the number of passes the player starts with.
const STARTING_PASSES = 3;

// I created my main App component.
// I am starting with a simple heading first so I can confirm React is rendering properly.
function App() {
  const [words, setWords] = React.useState([]);
  const [currentWord, setCurrentWord] = React.useState("");
  const [scrambledWord, setScrambledWord] = React.useState("");
  const [guess, setGuess] = React.useState("");
  const [points, setPoints] = React.useState(0);
  const [strikes, setStrikes] = React.useState(0);
  const [passes, setPasses] = React.useState(STARTING_PASSES);
  const [message, setMessage] = React.useState("");
  const [gameOver, setGameOver] = React.useState(false);

// I check local storage first so the game can continue after a refresh.
React.useEffect(() => {
  const savedWords = localStorage.getItem("scrambleWords");
  const savedCurrentWord = localStorage.getItem("scrambleCurrentWord");
  const savedScrambledWord = localStorage.getItem("scrambleScrambledWord");
  const savedPoints = localStorage.getItem("scramblePoints");
  const savedStrikes = localStorage.getItem("scrambleStrikes");
  const savedPasses = localStorage.getItem("scramblePasses");
  const savedGameOver = localStorage.getItem("scrambleGameOver");
  const savedMessage = localStorage.getItem("scrambleMessage");

  if (
    savedWords &&
    savedCurrentWord &&
    savedScrambledWord &&
    savedPoints !== null &&
    savedStrikes !== null &&
    savedPasses !== null &&
    savedGameOver !== null
  ) {
    setWords(JSON.parse(savedWords));
    setCurrentWord(savedCurrentWord);
    setScrambledWord(savedScrambledWord);
    setPoints(Number(savedPoints));
    setStrikes(Number(savedStrikes));
    setPasses(Number(savedPasses));
    setGameOver(savedGameOver === "true");
    setMessage(savedMessage || "");
  } else {
    const shuffledWords = shuffle(DEFAULT_WORDS);
    const firstWord = shuffledWords[0];
    const remainingWords = shuffledWords.slice(1);

    setWords(remainingWords);
    setCurrentWord(firstWord);
    setScrambledWord(shuffle(firstWord));
  }
}, []);

// I save the game data so the player's progress stays after refreshing.
React.useEffect(() => {
  localStorage.setItem("scrambleWords", JSON.stringify(words));
  localStorage.setItem("scrambleCurrentWord", currentWord);
  localStorage.setItem("scrambleScrambledWord", scrambledWord);
  localStorage.setItem("scramblePoints", points);
  localStorage.setItem("scrambleStrikes", strikes);
  localStorage.setItem("scramblePasses", passes);
  localStorage.setItem("scrambleGameOver", gameOver);
  localStorage.setItem("scrambleMessage", message);
}, [words, currentWord, scrambledWord, points, strikes, passes, gameOver, message]);

  // I move to the next word after the current word has been used.
function moveToNextWord() {
  if (words.length === 0) {
    setCurrentWord("");
    setScrambledWord("");
    setGameOver(true);
    setMessage("Game over! You completed all the words.");
    return;
  }

  const nextWord = words[0];
  const remainingWords = words.slice(1);

  setCurrentWord(nextWord);
  setScrambledWord(shuffle(nextWord));
  setWords(remainingWords);
}

   // I check the player's guess and stop the page from refreshing.
  function handleSubmit(event) {
  event.preventDefault();

  if (guess.toLowerCase() === currentWord.toLowerCase()) {
    setPoints(points + 1);
    setMessage("Correct!");
    moveToNextWord();
  } else {
    const newStrikes = strikes + 1;
    setStrikes(newStrikes);

    if (newStrikes >= MAX_STRIKES) {
      setGameOver(true);
      setMessage("Incorrect. Game over!");
    } else {
      setMessage("Incorrect.");
    }
  }

  setGuess("");
}

 // I let the player skip the current word if they still have passes left.
function handlePass() {
  if (passes > 0) {
    setPasses(passes - 1);
    setMessage("Word passed.");
    moveToNextWord();
  }
}

// I restart the game and reset all the values.
function startNewGame() {
  const shuffledWords = shuffle(DEFAULT_WORDS);
  const firstWord = shuffledWords[0];
  const remainingWords = shuffledWords.slice(1);

  setWords(remainingWords);
  setCurrentWord(firstWord);
  setScrambledWord(shuffle(firstWord));
  setGuess("");
  setPoints(0);
  setStrikes(0);
  setPasses(STARTING_PASSES);
  setMessage("");
  setGameOver(false);
}

  return (
  <div>
    <h1>Scramble</h1>

    <p>Points: {points}</p>
    <p>Strikes: {strikes}</p>
    <p>Passes: {passes}</p>

    <h2>{scrambledWord}</h2>
  {!gameOver && (
   
  <form onSubmit={handleSubmit}>
    <input
      type="text"
      value={guess}
      onChange={(event) => setGuess(event.target.value)}
      placeholder="Type your guess"
    />
    <button type="submit">Guess</button>
  </form>
)}
 {!gameOver && (
  <button onClick={handlePass} disabled={passes === 0}>
    Pass
  </button>
)}

    <p>{message}</p>
    {gameOver && (
  <button onClick={startNewGame}>Play Again</button>
)}
  </div>
);
}

// I rendered my App component inside the root div in index.html.
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);