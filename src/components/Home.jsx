import React, { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link, useNavigate } from 'react-router-dom'
import {GoogleOAuthProvider} from  '@react-oauth/google'
import { GoogleLogin } from '@react-oauth/google'
import jwt_decode from 'jwt-decode'
import './style.css'
import './signup.css'
import Cookies from 'js-cookie'






export default function Home(props) {
const [userNameLogin , setUserNameLogion] = useState('')
const [passwordLogin,setPasswordLogin] = useState('')
const [userName,setUserName] = useState('')
const [password,setPassword] =useState('')
const [repeatPassword,setRepeatPassword] =useState('')
const [email,setEmail] =useState('')
const [activeTab, setActiveTab] = useState('sign-in');
const nav = useNavigate()

const signUp =  () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  if (userName.length < 4) {
    alert('User name needs to be at least 4 characters');
    return;
  }

  if (!emailRegex.test(email)) {
    alert('Invalid email');
    return; 
  }

  if (repeatPassword !== password) {
    alert('Passwords do not match');
    return;
  }

 
    if (userName === props.userName) {
      alert('This user name already exists');
      return;
    }

    // בדיקת קיום אימייל
    
    if (email === props.email) {
      alert('This email already exists');
    } else {
      props.addUsers(userName, password, repeatPassword, email);
      setActiveTab('sign-in');
    }
 
}

const signIn = () => {
  const userFound = props.users.find(val => userNameLogin === val.userName && passwordLogin === val.password);

  if (userFound) {
    // מצאנו משתמש, מעבר לדף המשתמש
    nav(`/user/${userFound.userName}`);
  } else {
    // המשתמש לא נמצא
    alert('User not found');
  }
};

// פונקציה להתנתקות משתמש


const handleUserNameChange = (e) => {
  setUserName(e.target.value);
};

const handlePasswordChange = (e) => {
  setPassword(e.target.value);
};

const handleRepeatPasswordChange = (e) => {
  setRepeatPassword(e.target.value);
};

const handleEmailChange = (e) => {
  setEmail(e.target.value);
};
const handleTabChange = (tab) => {
  setActiveTab(tab);
};



const [isLoggedIn, setIsLoggedIn] = useState(false);


const handleUserCheckboxChange = () => {
  const newValue = !isLoggedIn;
  setIsLoggedIn(newValue);
  localStorage.setItem('isUserLoggedIn', JSON.stringify(newValue));

  if (!newValue) {
    // המשתמש התנתק - מחיקת ה-Cookie של המשתמש
    Cookies.remove('currentUser');
    // ניתוב לדף הראשי
    nav('/');
  }
};
const handlePageLoad = () => {
  const currentUser = Cookies.get('currentUser');

  if (!isLoggedIn) {
    // המשתמש לא מחובר - ניתוב לדף הראשי
    nav('/');
  } else if (isLoggedIn && currentUser && window.location.pathname !== `/user/${currentUser}`) {
    // יש משתמש מחובר ורוצה לעבור לדף אחר - ניתוב לדף המשתמש המתאים
    nav(`/user/${currentUser}`);
  }
};

useEffect(() => {
  const storedValue = localStorage.getItem('isUserLoggedIn');
  if (storedValue) {
    setIsLoggedIn(JSON.parse(storedValue));
  }

  const storedUserName = localStorage.getItem('userNameLogin');
  if (storedUserName) {
    setUserNameLogion(storedUserName);
  }
}, []);

useEffect(() => {
  handlePageLoad();
}, [isLoggedIn]); 


const clientId = '79150934273-fh53e0snhcrtph21fb44r456imjbt8e6.apps.googleusercontent.com';

  return (
    <div >

<section className="hero">
    <div className="container text-center">
      <div className ="row">
        <div className="col-md-12">
         
        </div>
      </div>

     
      <h1 className='title'>PLAN YOUR TRADE FOR FREE </h1>
      <h2 className='title'>(Beta version)</h2>      
    
      <div className="col-md-12">

      

      
        <div className="login-wrap" >
	<div className="login-html">
		<input id="tab-1"  onChange={() => handleTabChange('sign-in')}   checked={activeTab === 'sign-in'} type="radio" name="tab" className="sign-in" /><label htmlFor="tab-1" className="tab">Sign In</label>
		<input id="tab-2"   onChange={() => handleTabChange('sign-up')}   checked={activeTab === 'sign-up'}  type="radio" name="tab" className="sign-up"/><label htmlFor="tab-2" className="tab">Sign Up</label>
		<div className="login-form">
			<div className="sign-in-htm">
				<div className="group">
        <label htmlFor="pass" className="label">Username</label>
					<input id="pass" onChange={(e)=>{setUserNameLogion(e.target.value)}} type="text" className="input"/>
				</div>
				<div className="group">
					<label htmlFor="pass" className="label">Password</label>
					<input id="pass" onChange={(e)=>{setPasswordLogin(e.target.value)}}  type="password" className="input" data-type="password"/>
				</div>
				<div className="group">
    <label id='labelCheck' > 
  <input style={{marginRight:'5px'}}
  type="checkbox"
  checked={isLoggedIn}
  onChange={handleUserCheckboxChange}
/>Keep me signed in</label>
    
				</div>
				<div className="group">
					<input id='btnSignin' onClick={()=>{signIn()}} type="submit" className="button" value="Sign In"/>
				</div>
				<div className="hr"></div>
				<div className="foot-lnk">
				<Link to={'/forget'}><a id='forget'  >Forgot Password?</a></Link>
				</div>

        <div id='signInDIV'>
      
        <GoogleOAuthProvider clientId={clientId}>
  <GoogleLogin  
    onSuccess={credentialResponse => {
      const details = jwt_decode(credentialResponse.credential);
      const { name, email } = details;

      props.addUsers(name, Math.random().toString(36).slice(-8), Math.random().toString(36).slice(-8), email);
      props.getName(name);
      nav(`/user/${name}`);
    }}

    onError={() => {
      console.log('login failed');
    }}
  />
</GoogleOAuthProvider>


</div>





			</div>
			<div className="sign-up-htm">
				<div className="group">
					<label htmlFor="pass" className="label">Username</label>
					<input onChange={handleUserNameChange}  id="pass" type="text" className="input"/>
				</div>
				<div className="group">
					<label htmlFor="pass" className="label">Password</label>
					<input id="pass" onChange={handlePasswordChange}   type="password" className="input" data-type="password"/>
				</div>
				<div className="group">
					<label htmlFor="pass" id='repet' style={{whiteSpace:'nowrap',position:'relative',left:'10px'}} className="label">Repeat Password</label>
					<input id="pass" onChange={handleRepeatPasswordChange}  type="password" className="input" data-type="password"/>
				</div>
				<div className="group">
					<label htmlFor="pass" style={{whiteSpace:'nowrap',position:'relative',left:'20px'}} className="label">Email Address</label>
					<input id="pass" onChange={handleEmailChange}  type="text" className="input"/>
				</div>
				<div className="group">
					<input onClick={()=>{signUp()}} type="submit" id='btnsignup' className="button" value="Sign Up"/>
          <h2  id='msg'></h2>
				</div>
				<div className="hr"></div>
				<div className="foot-lnk">
				
				</div>
			</div>
		</div>
	</div>
</div>

      
      </div>
    </div>

  </section>





    </div>
  )
}
