import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Modal, Input } from 'antd';


const CommonModal: React.FC = forwardRef<any, any>((props, ref) => {
    const [open, setOpen] = useState(false);

    const [value, setValue] = useState('');



    useImperativeHandle(ref, () => {
        return {
            open: () => {
                setOpen(true);
            },
            close: () => {
                setOpen(false);
            }
        }
    })
    const handleOk = () => {
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return <Modal
        title="Basic Modal"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
    >
        <>
            {`Current value: ${value}`}
            <Input value={value} onChange={(e) => setValue(e.target.value)} />
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            {props?.children}
        </>

    </Modal>
})

export default CommonModal;