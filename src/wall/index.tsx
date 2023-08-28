import "@arco-design/web-react/dist/css/arco.css";
import ReactDOM from "react-dom/client";
import "../styles.css";
import App from "./app";

ReactDOM.createRoot(document.getElementById("wall") as HTMLElement).render(
  <App></App>
);
