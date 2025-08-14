import yayJpg from '../assets/yay.jpg';
import { useState, useEffect, useRef } from "react";
import CommonModal from './components/modal';
import CommonDrawer from './components/drawer';
import useDrawer from './components/drawer/useDrawer';
import { Button, Flex } from 'antd';


export default function DecsPage() {

  // 自定义hooks
  const { toggleDrawer, drawerProps } = useDrawer();


  // 类似于vue2的refs
  // 在react中，refs主要用于获取dom节点或组件实例
  // 这里用ref来获取modal组件的实例
  const modalRef = useRef();


  const _toggleDrawer = () => {
    toggleDrawer();
  };

  return (
    <div>
      <h2>Yay! Welcome to umi!</h2>

      <Button type='primary' danger
        onClick={() => {
          // 调用modal组件的open方法
          modalRef.current?.open();
        }}
      >打开弹窗</Button>

      <div style={{ marginTop: 20 }}>
        <Button danger type='primary' onClick={_toggleDrawer}>打开抽屉</Button>
      </div>


      <CommonModal ref={modalRef}>
        {/** 类似vue2的slot */}
        <>
          <p>我是父组件content...</p>
        </>
      </CommonModal>

      <CommonDrawer toggleDrawer={toggleDrawer}  {...drawerProps} />
    </div>
  );
}

