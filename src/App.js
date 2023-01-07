import './App.css';
import React, {useState,useMemo,useEffect} from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from "@apollo/client";

// apollo client setup
const client = new ApolloClient({
  uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
  cache: new InMemoryCache()
})

var render = 0;

function App() {
  render++;
  const [heavyCount, setHeavyCount] = useState(0); //default state
  const [simpleCount, setSimpleCount] = useState(0); 
  const [text, setText] = useState(''); //default state
  const [fact, setFact] = useState(''); //default state
  const [character, setCharacter] = useState('');

  // const calculation = expensiveCalculation(heavyCount); //will run slow when state changes on text or simple counter
  const calculation = useMemo(() => expensiveCalculation(heavyCount), [heavyCount]); //will run quck when text changes
  
  console.log('App rendered with count', heavyCount)
  
  const valueChangeHandler = (event) => {
    setText(event.target.value)
  }

  const getNewCharacterHandler = () => {
    var id = getRandomArbitrary(1,50)
    console.log(id)
    //GraphQL
    client.query({
      query: gql`
          {
            person(personID: ${id}) {name, birthYear, homeworld {name}}
          }
      `
    })
    .then(res => setCharacter(res));
  }

  function getRandomArbitrary(min, max) {
    var result = (Math.random() * (max - min) + min).toString();
    return Math.floor(result)
  }

  useEffect(() => {
    console.log("API called...")
    //REST API
    fetch("https://catfact.ninja/fact")
      .then(resp => resp.json())
      .then(data => setFact(data));
  }, [heavyCount])

  return (
    <div className="App">
      <h1>React State Management & Hooks</h1>
      <div className="container">
        
        <div className="card">
          <h3>Page Renders</h3>
          <p className='counter'>{render}</p>
        </div>

        <div className="card">
          <h1>Cat Facts 🐈</h1>
          <h3>{fact.fact}</h3>
        </div>


        <div className="card">
          <h3>Heavy Counter</h3>
          {/* <p>Calculation: {calculation}</p> */}
          <p className='counter'>{heavyCount}</p>
          <div className='button-container'>
            <button onClick={() => setHeavyCount((c) => c + 1)}>
              +
            </button>
            <button className="btn-orange" onClick={() => setHeavyCount(0)}>
              Reset
            </button>
          </div>
        </div>

        <div className="card">
          <h3>Simple Counter</h3>
          <p className='counter'>{simpleCount}</p>
          <div className='button-container'>
            <button onClick={() => setSimpleCount((c) => c + 1)}>
              +
            </button>
            <button className="btn-red" onClick={() => setSimpleCount((c) => c <= 1 ? 0 : c-1)}>
              -
            </button>
          </div>
        </div>

        <div className="card">
          <h3>Text Input Example: </h3>
          <input type="text" onChange={valueChangeHandler}></input>
          <p>{text}</p>
        </div>

        <div className="card">
          <h1>Star Wars Character 🪐</h1>

          <div>{ character 
                ? <div>
                    <p>Name: {character.data.person.name}</p>
                    <p>Birth Year: {character.data.person.birthYear}</p>
                    <p>Homeworld: {character.data.person.homeworld.name}</p>
                  </div>
                : <div></div>}
              </div>

          <button onClick={getNewCharacterHandler}>
              Get New Random Character
            </button>
        </div>

        <div className="card next">
          <h3>Go to next page</h3>
        </div>

      </div>
    </div>
  );
}

const expensiveCalculation = (num) => {
  console.log('Computing heavy function with counter value', num);
  for (let i = 0; i < 2000000000; i++) {
    num += 1;
  }
  return num;
};


export default App;
