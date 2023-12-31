import { Suspense, lazy } from "react";
import "./App.css";
import { useRouterStore } from "./hooks/router";
import HeaderBlock from "./layout/header";
import SiderBlock from "./layout/sider";
import { Layout, Spin, Tabs } from "@arco-design/web-react";
import Footer from "./layout/footer";

const Index = lazy(() => import("@/pages/index"));
const Playlist = lazy(() => import("@/pages/playlist/index"));
const Square = lazy(() => import("@/pages/square/index"));
const Music = lazy(() => import("@/pages/music/index"));
const Search = lazy(() => import("@/pages/search/index"));
const History = lazy(() => import("@/pages/history/index"));
const Download = lazy(() => import("@/pages/download/index"));

function App() {
  const { path } = useRouterStore();

  return (
    <Layout className="w-screen h-screen">
      <Layout.Sider>
        <SiderBlock />
      </Layout.Sider>
      <Layout>
        <Layout.Header className="h-16">
          <HeaderBlock />
        </Layout.Header>
        <Layout.Content>
          <Suspense fallback={<Spin />}>
            <Tabs
              className="h-full"
              destroyOnHide={false}
              activeTab={path}
              renderTabHeader={() => <></>}
            >
              <Tabs.TabPane key="/" title="/">
                <Index />
              </Tabs.TabPane>
              <Tabs.TabPane key="/square" title="/">
                <Square />
              </Tabs.TabPane>
              <Tabs.TabPane key="/search" title="/">
                <Search />
              </Tabs.TabPane>
              <Tabs.TabPane key="/history" title="/">
                <History />
              </Tabs.TabPane>
              <Tabs.TabPane key="/download" title="/" lazyload={false}>
                <Download />
              </Tabs.TabPane>
              <Tabs.TabPane key="/music" title="/" destroyOnHide>
                <Music />
              </Tabs.TabPane>
              <Tabs.TabPane key="/playlist" title="/" destroyOnHide>
                <Playlist />
              </Tabs.TabPane>
            </Tabs>
          </Suspense>
        </Layout.Content>
        <Layout.Footer className="h-20 shadow-inner">
          <Footer />
        </Layout.Footer>
      </Layout>
    </Layout>
  );
}

export default App;
