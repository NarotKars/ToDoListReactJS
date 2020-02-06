import React from 'react';
import './App.css';
import cross from './cross.png';
import tick from './tick.png';
function TODO(props)
{
  return props.whatToDo;
}
let a=0,b=0;
class App extends React.Component {

  constructor(props) {
    super(props);
    this.setProperty=this.setProperty.bind(this);
    this.setToDoList=this.setToDoList.bind(this);
    this.delToDoList=this.delToDoList.bind(this);
    this.editList=this.editList.bind(this);
    this.EditProperty=this.EditProperty.bind(this);
    this.imageClick=this.imageClick.bind(this);
    this.state = {
          whatToDo:'',
          EditToDo:'',
          data: [],
      }
  }

  componentDidUpdate()
  {
    if(b<a)
    {
      const that = this;
      fetch("https://localhost:5001/ToDoList/")
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonStr) {
            that.setState({ data: jsonStr });
        }).catch((err)=>{console.log(err);})
        b++;
      }
  }

  componentDidMount()
  {
    const that = this;
    fetch("https://localhost:5001/ToDoList/")
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonStr) {
            that.setState({ data: jsonStr });
            for(var i=0;i<jsonStr.length;i++)
              {a++; b++;}
        }).catch((err)=>{console.log(err);})
  }

  setProperty(e)
  {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  EditProperty(e)
  {
    this.setState({
    [e.target.name]: e.target.value
    })
  }
  
  delToDoList = (id) =>
  {
    var url='https://localhost:5001/ToDoList/'+id;
          fetch(url ,{
            method: 'DELETE'
          }).catch((err)=>{console.log(err);})
    var deleted=[...this.state.data];
    const index=this.state.data.map(item => item.id).indexOf(id);
    deleted.splice(index,1);
    this.setState({
        data:[...deleted],
    })
  }
  setToDoList(e)
  {
    if(this.state.whatToDo!=="")
    {
      const todo ={
      whatToDo: this.state.whatToDo,
      Edit: "n",
      Completed: "n"
    }
    fetch('https://localhost:5001/ToDoList/', { 
      method: 'POST',
      body: JSON.stringify(todo), 
      headers:{ 'Content-Type': 'application/json' } })
      .catch(error => console.error('Error:', error))
      this.setState({
        update: true,
        whatToDo:"",
        data:[...this.state.data,todo]
      })
      }
      a++;
  }
  editList = (id) =>
  {
    var d=[...this.state.data];
    const index=this.state.data.map(item => item.id).indexOf(id);
    if(d[index].edit==="y"  && this.state.EditToDo!=="")
        d[index].whatToDo=this.state.EditToDo;
    if(d[index].edit==="n") d[index].edit="y";
    else d[index].edit="n";
    this.setState({
      EditToDo: d[index].whatToDo,
      data:[...d],
    })
    const todo={
      Id: d[index].id,
      whatToDo: d[index].whatToDo,
      edit: d[index].edit,
      Completed: d[index].completed
    }
    fetch('https://localhost:5001/ToDoList/', {
      method: 'PUT',
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json"
      }
    })
  }

  imageClick = (id) =>
  {
    var d=[...this.state.data];
    const index=this.state.data.map(item => item.id).indexOf(id);    
    console.log(d[index].completed);
    if(d[index].completed==="y") d[index].completed="n";
    else d[index].completed="y";
    console.log(d[index].completed);
    this.setState({
      data:[...d],
    })
  }

  render() {
      return (
          <div className="wrapper">
            <div className="App">
              <h1>To do list</h1>
              <input type="text" onChange={this.setProperty} name="whatToDo" value={this.state.whatToDo}></input>
              <button className="cbtn"  onClick={this.setToDoList}>CREATE</button>
            </div>
            <div>
              {
                this.state.data.map(item => {
                  if(item.edit==="y")
                  {
                    return (<div key={item.id} className="compStyle" >
                    <input type="text" onChange={this.EditProperty} name="EditToDo" value={this.state.EditToDo} className="editInput"></input> 
                    <button className="ebtn" onClick={()=>this.editList(item.id)}>SAVE</button>
                    <button className="btn" onClick={() => this.delToDoList(item.id)}>DELETE</button>
                  </div>)
                  }
                  else
                  {
                    if(item.completed==="y")
                    {
                      return (<div key={item.id} className="compStyle" >
                                  <img src={cross} alt="t~c" className="imgStyle" onClick={() => this.imageClick(item.id)}/>
                                  <span className="line-through"><TODO {...item} /></span>
                                  <button className="btn" onClick={() => this.delToDoList(item.id)}>DELETE</button>
                              </div>)
                    }
                    else
                    {
                      return (<div key={item.id} className="compStyle" >
                                  <img src={tick} alt="t~c" className="imgStyle" onClick={() => this.imageClick(item.id)}/>
                                  <span className="extraordinary"><TODO {...item} /></span>
                                  <button className="ebtn" onClick={()=>this.editList(item.id)}>EDIT</button>
                                  <button className="btn" onClick={() => this.delToDoList(item.id)}>DELETE</button>
                              </div>)
                    }
                  }
                })
              }
            </div>
          </div>
      )
  }
}

export default App;