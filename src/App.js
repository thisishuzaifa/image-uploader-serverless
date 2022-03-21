import './App.css';
import axios from 'axios';
import {useState, useEffect} from 'react'
import {signUp, confirmUser} from './userAuth'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function App() {

const [file, setFile] = useState();
const [title, setTitle] = useState("")
const [images, setImages] = useState([])
const [userName, setUserName] = useState("")
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [page, setPage] = useState("confirm")
const [verified, setVerified] = useState("")

const submitSignup = async (e) => {
  e.preventDefault()
  console.log("signup" + userName + email + password)
  const user = await signUp(userName, password, email)
  console.log(user)
  setPage("confirm")
}

useEffect(() => {
  async function getTitle() {
    const titleResult = await axios.get('https://2r59gvz6q4.execute-api.ca-central-1.amazonaws.com/Dev/appdetails')
    const message = titleResult.data.message
    setTitle(message)

    const imagesResult = await axios.get('https://2r59gvz6q4.execute-api.ca-central-1.amazonaws.com/Dev/images')
    const images = imagesResult.data.images
    setImages(images)


  }
  getTitle()
}, [])

const submit = async event => {
  event.preventDefault();

  const urlResult = await axios.get('https://2r59gvz6q4.execute-api.ca-central-1.amazonaws.com/Dev/signedurl')
  const url = urlResult.data.url
  await axios.put(url, images, {headers: {'Content-Type': 'file.type'}})
  const imageUrl = url.split("?")[0]
  setImages([...images, imageUrl])


}

const submitConfirmEmail = async (e) => {
  e.preventDefault()

  const result = await confirmUser(userName, verified)
  console.log(result)
  if(result === "SUCCESS") {
    setPage("upload")
  }

  console.log("confirmed",verified)

}

  return (
    <div className="App">
    <h1>Serverless React App</h1>


    {page === "signup" &&
      <form onSubmit={submitSignup}>
        <input type="text" placeholder="username" onChange={e => setUserName(e.target.value)}/>
        <input type="text" placeholder="email" onChange={e => setEmail(e.target.value)}/>
        <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)}/>
        <button type="submit">Signup</button>
      </form>

    }
    {page === "confirm" &&
     <form onSubmit={submitConfirmEmail}>
     <input type="text" placeholder="username" onChange={e => setUserName(e.target.value)}/>
     <input onChange={e => setVerified(e.target.value)} type="text" placeholder="verify"/>
     <button type="submit">Confirm</button>
   </form>

    }

    {page === "home" &&
      <>
    <form onSubmit={submit}>
      <input type="file" onChange={e => setFile(e.target.files[0])}/>
      <button type="submit">Submit</button>
    </form>
    {
      images.map(image => (
      <img key={image} src={image} alt=""/>
      ))

    }
    </>
    }

    </div>
  );



}

export default App;
