import React, { Component } from "react";
import axios from "axios";
import './App.css';



class App extends Component {
  state = {
    data: [],
    data1: [],
    Name: null,
    Cluster: null,
    Datec: null,
    Location: null,
    Query: null,
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  };

  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever 
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getDataFromDb = () => {
    fetch("http://localhost:3001/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  putDataToDB = (Name, Cluster, Datec, Location, Query) => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("http://localhost:3001/api/putData", {
      id: idToBeAdded,
      Name: Name,
      Cluster: Cluster,
      Datec: Datec,
      Location: Location,
      Query: Query
    });
  };
 
  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id === idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("http://localhost:3001/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <ul>
          {data.length <= 0
            ? "NO DB ENTRIES YET"
            : data.map(dat => (
                <li style={{ padding: "10px" }} key={data.message}>
                  <span style={{ color: "blue" }}> id: </span> {dat.id} <br />
                  <span style={{ color: "blue" }}> Name: </span>
                  {dat.Name} <br />
                  <span style={{ color: "blue" }}> Cluster: </span>
                  {dat.Cluster} <br />
                  <span style={{ color: "blue" }}> Date: </span>
                  {dat.Datec} <br />
                  <span style={{ color: "blue" }}> Location: </span>
                  {dat.Location}<br/>
                  <span style={{ color: "blue" }}> Query: </span>
                  {dat.Query}
                </li>
              ))}
        </ul>
        <br/>
        

        <h3><center>Fill this form for heatmap</center></h3>
        <table border="0" width="200" align="center" class="demo-table">
        <tr>
        <td><b>Index Name:</b> </td> 
        <td>
        <input
          type="text"
          class="demoInputBox"
          onChange={e => this.setState({ Name: e.target.value })}
          placeholder="Enter Index Name"
        />
        </td> 
        </tr> 
        <tr>
        <td><b>Cluster name:</b></td>
        <td>
        <input
          type="text"
          class="demoInputBox"
          onChange={e => this.setState({ Cluster: e.target.value })}
          placeholder="Enter Cluster Name"
        />
        </td>  
        </tr>
        <tr>
        <td><b>Index type:</b> </td> 
        <td>
        <input
          type="text"
          class="demoInputBox"
          onChange={e => this.setState({ Datec: e.target.value })}
          placeholder="Enter Type"
        />
        </td> 
        </tr> 
        <tr>
        <td><b>Geographic Location:</b></td>
        <td>
        <input
          type="text"
          class="demoInputBox"
          onChange={e => this.setState({ Location: e.target.value })}
          placeholder="Enter Location"
        />
        </td>  
        </tr>
        <tr>
        <td><b>Query:</b></td>
        <td>
        <input
          type="text"
          class="demoInputBox"
          onChange={e => this.setState({ Query: e.target.value })}
          placeholder="Enter Query"
        />
        </td>  
        </tr>
        <tr>
        <td>
        <button class="btnRegister" onClick={() => this.putDataToDB(this.state.Name, this.state.Cluster, this.state.Datec, this.state.Location, this.state.Query)}>
        SUBMIT
        </button>
        </td>
        </tr>
        </table>
      
        <table border="0" width="200" align="center" class="demo_table">
          <div style={{ padding: "10px" }}>
            <input
              type="Number"
              class="demoInputBox"
              style={{ width: "200px" }}
              onChange={e => this.setState({ idToDelete: e.target.value })}
              placeholder="put id of item to delete here"
            />
            <button class="btnRegister" onClick={() => this.deleteFromDB(this.state.idToDelete)}>
              DELETE
            </button>
          </div>
          </table>  
      </div>
    );
  }
}

export default App;