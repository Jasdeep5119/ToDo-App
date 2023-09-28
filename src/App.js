import React, {useState, useEffect} from "react";
import List from "./components/List";
import Alert from "./components/Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if(list){
    return(list = JSON.parse(localStorage.getItem("list")));
  } else {
    return [];
  }
};

const App = () => {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIdEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({show: false, msg:"", type:""});

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify("list"));
  }, [list]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!name){
      showAlert(true, "danger", "Please Enter Value");
    }
    else if(name && isEditing) {
      setList(
        list.map((item) => {
          if(item.id === editID){
            return {...item, title: name}
          }
          return item
        })
      );
      setName("");
      setEditID(null);
      setIdEditing(false);
      showAlert(true, "success", "Value Changes");
    } else{
      showAlert (true, "success", "Item Added to the list");
      const newItem = {id: new Date().getTime().toString(), title: name};
      setList ([...list, newItem]);
      setName("");
    }
  };

  const showAlert = (show = false, type="", msg="") => {
    showAlert({show, type, msg});
  };

  const removeItem = (id) => {
    showAlert (true, "danger", "Item Removed");
    setList(list.filter ((item) => item.id !== id));
  };

  const editItem = (id) => {
    const editItem = list.find ((item) => item.id === id)
    setIdEditing(true);
    setEditID(id);
    setName(editItem.title);
  };

  const clearList = () => {
    showAlert(true, "danger", "Empty List");
    setList([]);
  };
  return(
    <section className="section-center">
      <form onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert}
        removeAlert={showAlert} list={list} />}
        <h3 style={{marginBottom:"1.5rem", textAlign:"center"}}>
          ToDo App
        </h3>
        <div className="list-form">
          <input 
          type="text"
          className="form-control"
          placeholder="Tasks todo..."
          onChange={(e)=> setName(e.target.value)}
          value={name}
          />
          <button type="submit" className="btn btn-success">
            {isEditing ? "Edit" : "Submit"}
          </button>
        </div>
      </form>
      {list.length>0 && (
        <div style={{marginTop:"2rem"}}>
          <List item = {list} removeItem= {removeItem} editItem={editItem} />
          <div className="text-center">
            <button className="btn btn-warning" onClick={clearList}>
              Clear Items
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default App;