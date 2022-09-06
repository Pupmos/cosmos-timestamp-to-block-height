import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import '@styles/globals.css'
import { Breadcrumb, Col, Layout, Menu, Row, Space, Typography } from 'antd';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import React from 'react';
import { Footer } from 'antd/lib/layout/layout';

const { Header, Content, Sider } = Layout;

const items1: MenuProps['items'] = ['1', '2', '3'].map(key => ({
  key,
  label: `nav ${key}`,
}));

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);

    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,

      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  },
);

function Application({ Component, pageProps }) {
  return <>
    <Layout className="layout" style={{ height: '100vh' }}>
      <Header>
        <Row>
          <Col>
            <Typography.Title level={4} style={{ marginTop: 15, color: 'white'}}>PUPMØS TOOLZ ❤️</Typography.Title>
          </Col>
        </Row>
      </Header>
      <Content>
        <Row justify='center'>
          <Col span={12}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              {/* <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item> */}
            </Breadcrumb>
            <div className="site-layout-content">
              <Component {...pageProps} />
            </div>
          </Col>
        </Row>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Pupmøs ©2022 ❤</Footer>
    </Layout>
    {/* <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={[]} />
        </Header>
        <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={[]}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <Layout>
              </Layout>
            </Content>
          </Layout>
      </Layout>
    </Layout> */}
  </>
}

export default Application
