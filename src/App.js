import Header from './components/Header';
import Main from './components/Main';

function App(){
  return(
    <>
    <div>
      <div className='header'>
      <Header />
      </div>
      <div className='main'>
      <Main />
      </div>
      </div>
    </>
  );
}

export default App;