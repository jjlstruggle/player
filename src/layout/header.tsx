import { login, searchSuggest } from "@/apis";
import { Suggest } from "@/interfaces/api";
import useUserStore from "@/store/user";
import { getStore } from "@/utils/store";
import {
  Button,
  Checkbox,
  Divider,
  Dropdown,
  Form,
  Grid,
  Input,
  Link,
  Menu,
  Message,
  Modal,
  Space,
} from "@arco-design/web-react";
import { IconUser } from "@arco-design/web-react/icon";
import { useAsyncEffect } from "ahooks";
import { useDeferredValue, useEffect, useState } from "react";

type Mode = "手机号登录" | "邮箱登录" | "扫码登录" | "验证码登录";
enum DATA {
  "playlists" = "歌单",
  "artists" = "歌手",
  "songs" = "单曲",
  "albums" = "专辑",
}

function Header() {
  const { isAnonimous, setCookie, setUserInfo, setIsAnonimous, userInfo } =
    useUserStore();
  const [loginModal, setLoginModal] = useState(false);
  const [mode, setMode] = useState<Mode>("手机号登录");
  const [searchText, setSearchText] = useState("");
  const [list, setList] = useState<Suggest>();
  const searchVal = useDeferredValue(searchText);

  const [form] = Form.useForm<{
    account: string;
    password: string;
    remember: boolean;
  }>();

  const handleLogin = async () => {
    await form.validate();
    const info = form.getFields();
    const res = await login(
      info.account!,
      info.password!,
      mode === "手机号登录"
        ? "phone"
        : mode === "验证码登录"
        ? "captcha"
        : "email"
    );

    setCookie(res.data.cookie);
    setUserInfo(res.data);
    setIsAnonimous(false);
    setLoginModal(false);
    let store = await getStore();
    await store.set("cookie", res.data.cookie);
    if (info.remember) {
      store.set("loginInfo", Object.assign(info, { type: mode }));
    } else {
      store.delete("loginInfo");
    }
    Message.success("登录成功!");
  };

  useAsyncEffect(async () => {
    const store = await getStore();

    const loginInfo = await store.get<{
      account: string;
      password: string;
      remember: boolean;
      type: Mode;
    }>("loginInfo");

    if (loginInfo) {
      const { type, ...f } = loginInfo;
      setMode(type);
      form.setFieldsValue(f);
    }
  }, []);

  useEffect(() => {
    if (searchVal) {
      searchSuggest(searchVal).then(({ data }) => {
        setList(data.result);
      });
    }
  }, [searchVal]);

  const droplist = list ? (
    <Menu>
      {list.order.map((key) => {
        const data = list[key];
        const title = DATA[key];
        return (
          <Menu.ItemGroup title={title}>
            {data.map((info) => (
              <Menu.Item key={String(info.id)}>{info.name}</Menu.Item>
            ))}
          </Menu.ItemGroup>
        );
      })}
    </Menu>
  ) : null;

  return (
    <div
      data-tauri-drag-region
      className="titlebar w-full h-16 border-solid border-t-0 border-x-0 border-b border-b-[var(--color-border)] flex items-center select-none px-10"
    >
      <Modal
        footer={null}
        title={mode}
        visible={loginModal}
        onCancel={() => setLoginModal(false)}
      >
        <Form form={form}>
          {mode === "手机号登录" ? (
            <>
              <Form.Item
                field="account"
                label="手机号:"
                rules={[{ required: true }]}
                placeholder="请输入手机号"
              >
                <Input />
              </Form.Item>
              <Form.Item
                field="password"
                label="密码:"
                rules={[{ required: true }]}
                placeholder="请输入密码"
              >
                <Input.Password />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 4 }}>
                <Grid.Row gutter={8}>
                  <Grid.Col span={6}>
                    <Form.Item field="remember">
                      <Checkbox>记住密码</Checkbox>
                    </Form.Item>
                  </Grid.Col>
                  <Grid.Col span={18}>
                    <Form.Item>
                      <div className="flex items-center">
                        <Link>验证码登录</Link>
                        <Divider type="vertical" />
                        <Link>邮箱登录</Link>
                        <Divider type="vertical" />
                        <Link>二维码登录</Link>
                      </div>
                    </Form.Item>
                  </Grid.Col>
                </Grid.Row>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 5 }}>
                <Space size="large">
                  <Button type="primary" onClick={handleLogin}>
                    登录
                  </Button>
                  <Button>注册</Button>
                </Space>
              </Form.Item>
            </>
          ) : mode === "邮箱登录" ? (
            <>
              <Form.Item
                field="account"
                label="邮箱:"
                rules={[{ required: true }]}
                placeholder="请输入邮箱"
              >
                <Input />
              </Form.Item>
              <Form.Item
                field="password"
                label="密码:"
                rules={[{ required: true }]}
                placeholder="请输入密码"
              >
                <Input.Password />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 4 }}>
                <Grid.Row gutter={8}>
                  <Grid.Col span={6}>
                    <Form.Item field="remember">
                      <Checkbox>记住密码</Checkbox>
                    </Form.Item>
                  </Grid.Col>
                  <Grid.Col span={18}>
                    <Form.Item>
                      <div className="flex items-center">
                        <Link>验证码登录</Link>
                        <Divider type="vertical" />
                        <Link>手机号登录</Link>
                        <Divider type="vertical" />
                        <Link>二维码登录</Link>
                      </div>
                    </Form.Item>
                  </Grid.Col>
                </Grid.Row>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 5 }}>
                <Space size="large">
                  <Button type="primary" onClick={handleLogin}>
                    登录
                  </Button>
                  <Button>注册</Button>
                </Space>
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                field="account"
                label="手机号:"
                rules={[{ required: true }]}
                placeholder="请输入手机号"
              >
                <Input />
              </Form.Item>
              <Form.Item
                field="password"
                label="验证码:"
                rules={[{ required: true }]}
                placeholder="请输入验证码"
              >
                <Input.Search searchButton="获取验证码" />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 4 }}>
                <Grid.Row gutter={8}>
                  <Grid.Col span={6}>
                    <Form.Item field="remember">
                      <Checkbox>记住密码</Checkbox>
                    </Form.Item>
                  </Grid.Col>
                  <Grid.Col span={18}>
                    <Form.Item>
                      <div className="flex items-center">
                        <Link>手机号登录</Link>
                        <Divider type="vertical" />
                        <Link>邮箱登录</Link>
                        <Divider type="vertical" />
                        <Link>二维码登录</Link>
                      </div>
                    </Form.Item>
                  </Grid.Col>
                </Grid.Row>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 5 }}>
                <Space size="large">
                  <Button type="primary" onClick={handleLogin}>
                    登录
                  </Button>
                  <Button>注册</Button>
                </Space>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
      <Dropdown trigger="click" droplist={droplist}>
        <Input.Search
          allowClear
          className="w-64"
          value={searchText}
          onChange={(val) => setSearchText(val)}
        />
      </Dropdown>
      <div className="ml-12 flex items-center">
        {isAnonimous ? (
          <>
            <IconUser
              className="cursor-pointer"
              onClick={() => {
                setLoginModal(true);
              }}
            />
            <div
              className="ml-2 cursor-pointer"
              onClick={() => {
                setLoginModal(true);
              }}
            >
              点击登录
            </div>
          </>
        ) : (
          <>
            <div className="rounded-full w-10 h-10 overflow-hidden">
              <img
                className="block w-full h-full"
                src={userInfo!.profile.avatarUrl}
              />
            </div>
            <div className="ml-2 cursor-pointer">
              {userInfo?.profile.nickname}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
