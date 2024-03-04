import React from 'react';
import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { useState,useEffect } from 'react';
import Table from './components/Table';
import Package1 from './components/Package1';
import Package2 from './components/Package2';
import Package3 from './components/Package3';
import Registr from './components/Registr';
import Home from './components/Home'
import Reshom from './components/Reshom';
import ForgetPassword from './components/ForgetPassword'
import { v4 as uuidv4 } from 'uuid';
import ResetPassword from './components/ResetPassword';


function App() {


  const defaultRow = {
    Ticker:'',
    Quantity:0,
    price:0,
    actualPrice:0,
    ExitPrice:0,
    StopLose:0,
    TotalCost:0,
    ExpectedProfit:0,
    ExpectedLose:0
  };

  

  const [startTime, setStartTime] = useState(null);
  const [users,setUsers] =useState([])
  const[firstName,setFirstName]=useState('')
    //rows
    //const [row,setRow]=useState(9)
  
    const [flag,setFlag]=useState(false)
  
    const [currentUser, setCurrentUser] = useState(null);
  
  //TickerArr
    const [Tickers, setTickers] = useState([defaultRow]);
      
    // localStorage row
    // Define a state variable for the row
    // const [row, setRow] = useState(() => {
    //   const storedRow = localStorage.getItem(`row_${firstName}`);
    //   return storedRow ? parseInt(storedRow) : 9;
    // });
    
    // // Update the row whenever it changes
    // useEffect(() => {
    //   localStorage.setItem(`row_${firstName}`, row.toString());
    // }, [row, firstName]);
      
  
    // useEffect(() => {
    //   // Save the value to localStorage whenever it changes
    //   localStorage.setItem(`user${firstName}`, row);
    // }, [row]);
     
    const [row, setRow] = useState(9)
    
  // Retrieve the stored row value from localStorage on component mount
  // useEffect(() => {
  //   const storedRow = localStorage.getItem(`row_${firstName}`);
  //   if (storedRow) {
  //     setRow(parseInt(storedRow));
  //   } else {
  //     setRow(9);
  //   }
  // }, [firstName]);
  
  // // Get user first name
  const getName = (n) => {
    setFirstName(n);
  };
  

  
  
  
  
    
  const [data,setData] = useState(null)
  

    // שומר את הנתונים בדפדפן
    const loadStateFromLocalStorage = () => {
      const storedState = localStorage.getItem('appState');
      if (storedState) {
        const state = JSON.parse(storedState);
        if (state && state.users) {
          setUsers(state.users);
          // check if currentUser exists in LocalStorage
          const currentUser = localStorage.getItem('currentUser');
          if (currentUser) {
            setCurrentUser(currentUser);
            // Load current user state if user exists
            loadUserStateFromLocalStorage(currentUser);
          } else {
            // handle case when no user exists in LocalStorage
          }
        }
      }
    };
    
    const saveStateToLocalStorage = () => {
      const state = {
        users,
        currentUser: currentUser,
      };
      localStorage.setItem('appState', JSON.stringify(state));
      localStorage.setItem('currentUser', currentUser);
    };
    
    const loadUserStateFromLocalStorage = (user) => {
      const storedState = localStorage.getItem(`appState_${user}`);
      if (storedState) {
        const state = JSON.parse(storedState);
        setTickers(state.tickers);
      }
    };
    
    const saveUserStateToLocalStorage = () => {
      const state = {
        tickers: Tickers,
      };
      localStorage.setItem(`appState_${currentUser}`, JSON.stringify(state));
    };
    
    useEffect(() => {
      loadStateFromLocalStorage();
    }, []);
    
    useEffect(() => {
      saveStateToLocalStorage();
      if (currentUser) {
        saveUserStateToLocalStorage();
      }
    }, [users, Tickers, currentUser,defaultRow]);
  

const addUsers = (u, p, r, e) => {
  const userData = {
    userName: u,
    password: p,
    repetPassword: r,
    email: e,
    id: uuidv4(),
    Tickers: [defaultRow],
  };

  // Update the users state with the new user
  setUsers([...users, userData]);
  setFlag(!flag);
};



//מוחקת שורות מהטבלה

const delRow = (username, rowIndex) => {
  const updatedUsers = [...users];
  const userIndex = updatedUsers.findIndex(user => user.userName === username);

  if(userIndex !== -1) {
    const updatedUser = { ...updatedUsers[userIndex] };
    if (rowIndex >= 0 && rowIndex < updatedUser.Tickers.length) {
      updatedUser.Tickers.splice(rowIndex, 1);
      if(updatedUser.Tickers.length === 0) {
        updatedUser.Tickers.push(defaultRow);
      }
      updatedUsers[userIndex] = updatedUser;
      setUsers(updatedUsers);
      localStorage.setItem('Users', JSON.stringify(updatedUsers));

      // Request to the server to delete the row
      fetch(`/delRows/users/${username}/rows/${rowIndex}`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => console.log(data.message))
      .catch(error => console.error('Error:', error));
    } else {
      console.log(`Row index ${rowIndex} not found for user ${username}`);
    }
  } else {
    console.log(`User ${username} not found`);
  }
}
const addTickers = (t, q,a, p, e, sl, index) => {
  const newTicker = {
    Ticker: String(t),
    Quantity: Number(q),
    price: Number(p),
    actualPrice:Number(a),
    ExitPrice: Number(e),
    stopLose: Number(sl),
    TotalCost: 0,
    ExpectedProfit: 0,
    ExpectedLose: 0,
  };

  // Check if the user already has tickers
  if (users[index] && users[index].Tickers && users[index].Tickers.length < row) {
    // If not, add the new ticker
    setUsers(currentUsers => {
      const updatedUsers = [...currentUsers];
      const currentUser = { ...updatedUsers[index] };
      currentUser.Tickers = [...currentUser.Tickers, newTicker];
      updatedUsers[index] = currentUser;
      return updatedUsers;
    });
  } else {
    // If yes, update the existing ticker
    setUsers(currentUsers => {
      const updatedUsers = [...currentUsers];
      const currentUser = { ...updatedUsers[index] };
      currentUser.Tickers[row - 1] = newTicker;
      updatedUsers[index] = currentUser;
      return updatedUsers;
    });
  }
};





const saveData = ()=>{
  setData([...data,Tickers])
  localStorage.setItem('Tickers', JSON.stringify(Tickers));
  localStorage.setItem('TickerValue', Tickers[0].Ticker);
  localStorage.setItem('inputValue', Tickers[0].Quantity.toString());
  localStorage.setItem('priceValue', Tickers[0].price.toString());
  localStorage.setItem('exitValue', Tickers[0].ExitPrice.toString());
  localStorage.setItem('stopValue', Tickers[0].StopLose.toString());

  
}
const deleteAll = (username) => {
  if (window.confirm("Are you sure you want to delete all rows?")) {
    const updatedUsers = [...users];
    const userIndex = updatedUsers.findIndex(user => user.userName === username);

    if (userIndex !== -1) {
      const updatedUser = { ...updatedUsers[userIndex] };
updatedUsers[userIndex] = updatedUser;
      updatedUser.Tickers = [defaultRow]; // reset the Tickers array to defaultRow
      updatedUsers[userIndex] = updatedUser;
      setUsers(updatedUsers);
      localStorage.setItem('Users', JSON.stringify(updatedUsers));

      // Sending the request to the server
   
      // Clearing the input values
      Tickers.forEach((val, index) => {
        
       
        document.getElementById(`quantity${index}`).value = '';
        document.getElementById(`Ticker${index}`).value = '';
        document.getElementById(`price${index}`).value = '';
        document.getElementById(`exit${index}`).value = '';
        document.getElementById(`stop${index}`).value = '';
      });
    } else {
      console.log(`User ${username} not found`);
    }
  }
};




const clearTable = () => {
  const defaultRow = {
    Ticker: '',
    Quantity: 0,
    price: 0,
    ExitPrice: 0,
    StopLose: 0,
    TotalCost: 0,
    ExpectedProfit: 0,
  };

  setTickers([defaultRow]);
  

  localStorage.setItem('Tickers', JSON.stringify([defaultRow]));
  localStorage.setItem('TickerValue', '');
  localStorage.setItem('inputValue', '');
  localStorage.setItem('priceValue', '');
  localStorage.setItem('exitValue', '');
  localStorage.setItem('stopValue', '');

 
  

};










  return (
    <div className="App">
   


    <BrowserRouter>
    <Routes>
    <Route  path='/' element = {<Home addUsers = {addUsers} users = {users} getName = {getName}      />}         />
    {users.map((val, index) => {

return <Route   path={`/user/${val.userName}`} element={<Table row={row} id = {val.id}  defaultRow = {defaultRow} userName = {val.userName} users={users} setFlag ={setFlag} index={index} Ticker = {val.Ticker} Quantity={val.Quantity} price={val.price} ExpectedLose={val.ExpectedLose} ExitPrice={val.ExitPrice} stopLose={val.stopLose} setUsers={setUsers} deleteAll={deleteAll} clearTable={clearTable} data={data} saveData={saveData} Tickers={val.Tickers} addTickers={addTickers} delRow={delRow} setTickers={setTickers} />} />
})}
{users.map((val, index) => {

return <Route    path={`/user/${val.userName}`} element={<Table row={row} id = {val.id}  defaultRow = {defaultRow} userName = {val.userName} users={users} setFlag ={setFlag} index={index} Ticker = {val.Ticker} Quantity={val.Quantity} price={val.price} ExpectedLose={val.ExpectedLose} ExitPrice={val.ExitPrice} stopLose={val.stopLose} setUsers={setUsers} deleteAll={deleteAll} clearTable={clearTable} data={data} saveData={saveData} Tickers={val.Tickers} addTickers={addTickers} delRow={delRow} setTickers={setTickers} />} />
})}
<Route path='/package1' element={<Package1 setRow={setRow} setTickers = {setTickers} Tickers = {Tickers}  clearTable = {clearTable}/>}/>
<Route path='/package2' element={<Package2 setRow={setRow}/>}/>
<Route path='/package3' element={<Package3 setRow={setRow}/>}/>
<Route path='/registr' element={<Registr  />}/>
{users.map((val,index)=>{
  return <Route path='/reshom' element={<Reshom userName = {val.userName}  users = {users}   />}/>

})}


<Route path='/forget'  element = {<ForgetPassword  users = {users}     />}           />



 <Route path={`/resetPassword`} element = {<ResetPassword   users = {users}        />}            />

</Routes>



</BrowserRouter>




    </div>
  );
}

export default App;