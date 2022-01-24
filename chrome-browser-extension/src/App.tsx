import React from 'react';
import {Select, Button, Row, Col, Form, notification} from 'antd';
import './App.css';
import {Content} from "antd/es/layout/layout";

const { Option } = Select;

const domain = '.airslate.com';
const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};
function deleteCookie(cookie) {
  const protocol = cookie.secure ? 'https:' : 'http:';
  const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;

  return chrome.cookies.remove({
    url: cookieUrl,
    name: cookie.name,
    storeId: cookie.storeId,
  });
}

const removeDomainCookies = async () => {
  let cookiesDeleted = 0;

  try {
    const cookies = await chrome.cookies.getAll({ domain });

    if (cookies.length === 0) {
      return; // "No cookies found";
    }

    const cookiesForRemove = cookies.filter((cookieItem) =>
      cookieItem.name.startsWith('airslate-forward-variant-'),
    );
    const pending = cookiesForRemove.map(deleteCookie);
    await Promise.all(pending);
    cookiesDeleted = pending.length;
  } catch (error) {
    console.log(`Unexpected error: ${error.message}`);
  }
  console.log(`Deleted ${cookiesDeleted} cookie(s).`);
};

function App() {
  const [url, setUrl] = React.useState<chrome.tabs.Tab | null>(null);
  const [select, setSelect] = React.useState(null);
  const [apiData, setApiData] = React.useState(null);

  function onChange(value: any) {
    setSelect(value);
  }

  React.useEffect(() => {
    const url = 'https://prometey.airppm.com/api/v1/browser-extension/get-data';
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setApiData(data);
      });
  }, []);

  React.useEffect(() => {
    async function getCurrentTab() {
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      return tab;
    }

    getCurrentTab().then((tab) => {
      setUrl(tab);
    });
  }, []);

  const isAllReady = !!apiData;

  if (!isAllReady) {
    return null;
  }

  const handleClick = async () => {
    await removeDomainCookies();
    const selectedItem = apiData.find((item) => {
      console.log(item, select);
      return String(item.id) === String(select);
    });
    selectedItem.virtualEnvServices
      .filter((item) => {
        return item.service_github_tag !== null;
      })
      .forEach((virtualEnvService) => {
        chrome.cookies.set(
          {
            url: 'https://www.airslate-stage.xyz', // https://www.airslate-stage.xyz/
            path: '/',
            // domain: '.airlate.com',
            name: virtualEnvService.service_header,
            value: virtualEnvService.service_header_value,
          },
          () => {
            console.log(chrome.runtime.lastError);
            // TODO handle error
            // Contains details about the cookie that's been set. If setting failed for any reason, this will be "null",
            // and runtime.lastError will be set.
          },
        );
      });

      notification.info({
          message: 'Prometey',
          description: 'Cookie is Set',
      });
  };

  const handleClearCookiesClick = async () => {
    await removeDomainCookies();
      notification.info({
          message: 'Prometey',
          description: 'Cookie is Clear',
      });
  };

  return (
    <div className="App">
      <Content>
          <Form {...layout}  name="control-hooks">
              <Form.Item
                  name="Select virtual env"
                  label="Select virtual env"
                  rules={[
                      {
                          required: true,
                      },
                  ]}
              >
                  <Select
                      showSearch
                      placeholder="Select dev"
                      optionFilterProp="children"
                      listHeight={130}
                      maxTagCount={2}
                      onChange={onChange}
                      size={'large'}
                      filterOption={(input, option) => {
                          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                      }}
                  >
                      {apiData.map((item) => {
                          return (
                              <Option key={item.id} value={item.id}>
                                  {item.title}
                              </Option>
                          );
                      })}
                  </Select>
              </Form.Item>
              <Form.Item>
                  <Row>
                      <Col>
                          <Button type="primary" disabled={!select} onClick={handleClick}>
                              Set cookies
                          </Button>
                      </Col>
                      <Col>
                          <Button onClick={handleClearCookiesClick}>Clear cookies</Button>
                      </Col>
                  </Row>

              </Form.Item>
              <Form.Item>
                  <Col>
                      <Button onClick={window.close}>Close</Button>
                  </Col>
              </Form.Item>
          </Form>
      </Content>
    </div>
  );
}

export default App;
