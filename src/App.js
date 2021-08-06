import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Clarifai from 'clarifai';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';

const app= new Clarifai.App ({
  apiKey : '2b6b1edd2df54b76a512f83bd948b8dd'
});


class App extends Component{
  constructor(){                  //to set states
    super();
    this.state={
      input : '',
      imageUrl: '',
      box:{} ,             //this obj will receive the four dimension of the bounding box
      route: 'signin',
      isSignedIn : false                   
    }
  }

calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol : clarifaiFace.left_col * width ,
      topRow : clarifaiFace.top_row * height ,
      rightCol : width - (clarifaiFace.right_col * width),
      bottomRow : height - (clarifaiFace.bottom_row * height),
    }
}

displayFaceBox = (box) => {           //this fn will set the states for box obj 
  this.setState({box : box});
}

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input })
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState({isSignedIn : false})
    }
    else if(route === 'home'){
      this.setState({isSignedIn : true})
    }
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
      <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
      { this.state.route === 'home'
        ? <div>
            <Logo />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />  
          </div>
        :(
          this.state.route === 'signin'
            ? <Signin onRouteChange={this.onRouteChange} />
            : <Register onRouteChange={this.onRouteChange} />
          )
      }
      </div>
    );
}
}

export default App;
