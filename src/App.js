import React, { Component } from 'react';
import FineUploaderS3 from 'fine-uploader-wrappers/s3';
import Gallery from 'react-fine-uploader';
import PropTypes from 'prop-types'

import logo from './logo.svg';
import './App.css';
import 'react-fine-uploader/gallery/gallery.css';

class App extends Component {
  constructor(props) {
    super(props); 
     this.state = {
       folderName : '' ,
       filename: '',
       x: '', y: ''     
     }
    
  }
  componentDidMount(){
   this.iniFrame() 
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.filename !== this.state.filename
  }
  iniFrame() { 
    if ( window.location !== window.parent.location ) 
    { 
      this.onload() 
        // The page is in an iFrames 
        //document.write("The page is in an iFrame"); 
    }  
    else { 
      this.state.folderName = 'a/b/c'
      this.state.filename = 'AHSGSH'
      // this.setState({
      //   folderName: 'a/b/c',
      //   filename: 'AHSGSH'
      // });
        // The page is not in an iFrame 
        //document.write("The page is not in an iFrame"); 
    } 
} 
onload(){
  function bindEvent(element, eventName, eventHandler) {
    if (element.addEventListener) {
      element.addEventListener(eventName, eventHandler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + eventName, eventHandler);
    }
  } // Send a message to the parent
  
  
  var sendMessage = function sendMessage(msg) {
    // Make sure you are sending a string, and to stringify JSON
    window.parent.postMessage(msg, '*');
  };
  
  var results = document.getElementById('results'),
      messageButton = document.getElementById('message_button'); // Listen to messages from parent window
  
  bindEvent(window, 'message', function (e) {
    console.log(e.data,'success')
    var test = e.data
    var spl = test.split('.');
    console.log(spl) 
    //results.innerHTML = spl[0];
    
    if(e.data !== ''){
      this.setState({
        folderName: spl[0],
        filename: spl[1]
      });
      console.info(this.state.folderName);
      // var folderNameIframe = e.data.folderName
      // var Filename = e.data.filename
      // console.log(folderNameIframe, '1')
      // console.log(Filename, '2')
     
      // this.state.filename= folderNameIframe
    }
    // if(e.data.folderNameIframe !== undefined &&  e.data.filename !== undefined){
     
    // }
    
  }.bind(this)); // Send random message data on every button click
  
  bindEvent(messageButton, 'click', function (e) {
    var random = Math.random();
    sendMessage('' + random);
  });
  

}
  render() {
    const folderName = this.state.folderName;
    const fileName = this.state.filename;
    const divStyle = {
      display :'hidden'
    }
    const divStyle1 = {
      display :'none'
    }
    const uploader = new FineUploaderS3({
      options: {
        request: {
          endpoint: "https://canfineuploads.s3-ca-central-1.amazonaws.com",
          accessKey: "AKIAXVWCICU3VAAPCGL3"
        },
        signature: {
          endpoint: "https://gnfmtl8n6j.execute-api.ca-central-1.amazonaws.com/prod",
          version: 4
        },
        chunking: {
          enabled: true
        },
        objectProperties: {
          region: "ca-central-1",
          key: function(fileId) { 
            console.log(this.getName(fileId), 'hagshags')
            const NewFile = this.getName(fileId)
            // console.log(this.getFilenameParam(fileId) , 'fileID') 
            // console.log(fileId), 'sandeep') 
              console.log(this.getUuid(fileId), 'sandeep'); 
              //----------for fileName to be  Same as in  user or Admin System---------------- 
              // return folderName + '/' + NewFile;
              // ---For File name from  a variable----------- 
              return folderName + '/' + fileName;
          }  
        },
        callbacks: {
          onComplete: function(id, name, response) {
            if (response.success) {
            alert("UPLOAD SUCCESS")
            }
          } 
        }
      }
    })
    return (
      <div className="App">
        <h1 className="centered">Secure 'Serverless' File Uploads with AWS Lambda, S3, and Zappa</h1>
    <p><button  style={divStyle1} id="message_button"></button></p>
    <div style={divStyle} id="results"></div>
        <Gallery className="gallery" uploader={uploader}/>
        { this.state.filename }
      </div>
    );
  }
}

export default App;
