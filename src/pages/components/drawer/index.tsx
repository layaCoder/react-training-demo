import React, { useState } from 'react';
import { Button, Drawer } from 'antd';
import classNames from 'classnames';
import styles from './index.module.less';

const CommonDrawer: React.FC<any> = (props) => {
    const { isOpen, toggleDrawer } = props;
    const [active, setActive] = useState(false);


    return (
        <>
            <Drawer
                title="Basic Drawer"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={toggleDrawer}
                open={isOpen}
            >
                <p className={classNames({ [styles.drawerActive]: active })}>
                    {active ? '又红了' : '我黑了'}
                </p>
                <Button onClick={() => setActive(!active)} > toggleActive</Button>
                <p>Some contents...</p>
            </Drawer>
        </>
    );
};

export default CommonDrawer;