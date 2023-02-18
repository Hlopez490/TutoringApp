import {useState, useEffect} from 'react'

function App() {

  const [initData, setData] = useState([{}])

  useEffect(() => {
    fetch("/reg").then(
      res => res.json()
    ).then(
      data =>{setData(data)}
    )
  }, [])


  return (
    <div className="App">
      <p>{initData.script}</p>
    </div>
  );
}

export default App;
