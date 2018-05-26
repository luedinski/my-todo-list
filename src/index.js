import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

window.counter = 0;

class LogIn extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<p>BLA</p>);
  }
}

class ToDoList extends React.Component {
  constructor(props) {
    super(props);
    this.handleItemDone = this.handleItemDone.bind(this);
    this.handleItemDeleted = this.handleItemDeleted.bind(this);
    this.addItem = this.addItem.bind(this);
    this.state = {
      items: []
    };
  }

  componentDidMount() {
    // fetch("http://localhost:8080/peter/")
    fetch("http://localhost:8080/Horst/").then(r => {
      if (!r.ok) {
        throw Error(r.statusText);
      }
      return r;
    }).then(r => r.json()).then(data => this.setState({items: data})).catch(e => console.log(e.message))
  }

  handleItemDone(id) {
    // TODO: done state to backend
    this.setState((prevState) => ({
      items: prevState.items.map(
        (item) => item.id === id
        ? {
          name: item.name,
          id: item.id,
          done: !item.done
        }
        : item)
    }));
  }

  handleItemDeleted(id) {
    fetch("http://localhost:8080/task/" + id, {method: 'DELETE'}).then(r => {
      this.setState((prevState) => ({
        items: prevState.items.filter((item) => item.id !== id)
      }));
    })

  }

  addItem() {
    let input = document.getElementById('addTodo').value;
    let itemName = input.trim();
    if (itemName.length > 0) {
      fetch("http://localhost:8080/Horst/", {
        method: 'PUT',
        body: itemName, // data can be `string` or {object}!
        headers: new Headers({'Content-Type': 'application/json'})
      }).then(res => res.json()).catch(error => console.error('Error:', error)).then(data => {
        this.state.items.push({name: data.name, id: data.id, done: data.done});
        this.setState((prevState) => ({items: this.state.items}));
      })
    }
    document.getElementById('addTodo').value = "";
  }

  render() {
    let todoItems = this.state.items.filter((item) => !item.done).map((item) => <Item name={item.name} id={item.id} done={item.done} onDone={this.handleItemDone} onDelete={this.handleItemDeleted}/>);
    let doneItems = this.state.items.filter((item) => item.done).map((item) => <Item name={item.name} id={item.id} done={item.done} onDone={this.handleItemDone} onDelete={this.handleItemDeleted}/>);
    return (<div className="to-do-list">
      <h1>{this.props.name}</h1>
      <input id="addTodo" type="text"/>
      <button onClick={this.addItem}>+</button>
      <h2>To-Do</h2>
      <ul>{todoItems}</ul>
      <h2>Done</h2>
      <ul>{doneItems}</ul>
    </div>);
  }
}

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.handleDone = this.handleDone.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDone(e) {
    this.props.onDone(this.props.id);
  }

  handleDelete(e) {
    this.props.onDelete(this.props.id);
  }

  render() {
    let className = this.props.done
      ? 'done'
      : '';
    return <li key={this.props.id} className={className}>
      <a tabIndex="0" role="button" onClick={this.handleDone}>{this.props.name}</a>
      <button onClick={this.handleDelete}>X</button>
    </li>
  }
}

// ========================================

ReactDOM.render(
  // <LogIn />
  <ToDoList name="Meine Liste"/>, document.getElementById('root'));
