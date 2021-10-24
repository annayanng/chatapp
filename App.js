import logo from './logo.svg';
import './App.css';
import {useState} from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Message = ({content, author, date}) => {
  const d = new Date(date);
  return (
    <div className="msg">
      <span className="author">
        {author}
      </span> <br />
      <span className="time">
        {`${MONTHS[d.getMonth()]} ${d.getDate()} ${d.getHours()}:${d.getMinutes()}`}
      </span> <br />
      <span className="content">
        {content}
      </span>
    </div>
  );
};

function App() {
  const [msgs, setMsgs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);
  const [content, setContent] = useState("");

  return (
    <div className="container">
      <div className="login" style={{display: !logged ? "block" : "none"}}>
      <input type="text" className="username-field" value={username} onChange={(e) => setUsername(e.target.value)} /> <br />
      <input type="password" className="password-field" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="login-submit" onClick={async (e) => {
        const req = await fetch(`http://localhost:8000/accounts/login?username=${username}&password=${password}`, {
          mode: "cors",
          headers: {
          'Access-Control-Allow-Origin':'*'
          }
        });
        const json = await req.json();
        if (!json.error) {
          setLogged(true);
          const mReq = await fetch(`http://localhost:8000/messages/get`, {
            mode: "cors",
            headers: {
            'Access-Control-Allow-Origin':'*'
            }
          });
          const json2 = await mReq.json();
          setMsgs(json2.messages);
        }
      }}>Login</button>
      </div>
      <div className="content-area" style={{display: !logged ? "none" : "block"}}>
        <div className="messages">
          {msgs.map((m) => <Message content={m.content} author={m.username} date={m.date} />)}
        </div>
        <input type="text" className="msg-content" value={content} onChange={(e) => setContent(e.target.value)} />
        <button className="submit" onClick={async (e) => {
          if (!content.length) return;
          const req = await fetch(`http://localhost:8000/messages/create`, {
            method: "POST",
            mode: "cors",
            headers: {
              'Access-Control-Allow-Origin':'*',
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({content, username, password})
          });
          const json = await req.json();
          if (!json.error) setMsgs([...msgs, {content, username, date: Date.now()}]);
        }}>Submit</button>
      </div>
    </div>
  );
}

export default App;
