import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import {useState, useEffect} from 'react'


function App() {

const [file, setFile] = useState();
const [title, setTitle] = useState("")
const [images, setImages] = useState([])
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

  return (
    <div className="App">
    <h1>Serverless React App</h1>
    <h2>{title}</h2>

    <form onSubmit={submit}>
      <input onChange={e => setFile(e.target.files[0])} type="file" accept="image/*"></input>
      <button type="submit">Submit</button>
    </form>
    {
      images.map(image => (
      <img key={image} src={image} alt=""/>
      ))

    }

    </div>
  );


}

export default App;
