import { useState } from "react";

const useDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    return {
        // 父组件需要调用的函数
        toggleDrawer,
        // 子组件自己内部维护的状态
        drawerProps: { isOpen }
    };
};

export default useDrawer;