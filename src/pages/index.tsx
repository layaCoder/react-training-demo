import yayJpg from '../assets/yay.jpg';
import { useState, useEffect, useRef } from "react";
import CommonModal from './components/modal';
import CommonDrawer from './components/drawer';
import useDrawer from './components/drawer/useDrawer';
import { Button, Flex } from 'antd';


export default function HomePage() {

  // 类似于vue2的data
  const [count, setCount] = useState(0);

  // 自定义hooks

  useEffect(() => {
    console.log('count:', count);
    // 添加 timer计时器
    const timer = setTimeout(() => {
      setCount(count + 1);
    }, 2 * 1000);


    return () => {
      // 组件卸载时清除timer
      // 注意：useEffect返回的函数会在组件卸载时执行
      clearTimeout(timer);
    }
    // 监听count变化，首次渲染时执行,类似于vue2的watch
  }, [count]);

  const handleClick = () => {
    setCount(count + 1);
  };



  return (
    <div>
      <h2>Yay! Welcome to umi!</h2>
      <p>
        <img src={yayJpg} width="388" />
      </p>
      <p>
        To get started, edit <code>pages/index.tsx</code> and save to reload.
      </p>
      <Button type='primary' onClick={handleClick}>Count ++</Button>
      <p>You clicked {count} times</p>

    </div>
  );
}

