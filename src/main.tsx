import "@arco-design/web-react/dist/css/arco.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import useUserStore from "./store/user";
import { getStore } from "./utils/store";
import { anonimousToken, getLikelist, loginStatus } from "./apis";

async function init() {
  const store = await getStore();
  const cookie = await store.get<string>("cookie");
  if (cookie) {
    useUserStore.setState({ cookie, isAnonimous: false });
    const { data } = await loginStatus();
    const res = await getLikelist(data.data.account.id);
    useUserStore.setState({ userInfo: data.data, listlist: res.data.ids });
  } else {
    const token = await anonimousToken();
    const cookie = token.data.cookie;
    useUserStore.setState({ cookie });
  }
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <>
      <App />
    </>
  );
}

init();
