import { Spin,Modal} from 'antd';
import React from 'react';
export default function Loading() {
    return (
        <Modal 
          bodyStyle={{backgroundColor:"transparent"}}
          visible={true} 
          centered 
          footer={null}
          closable={false}
          width={0}
          >
          <Spin tip="Loading..." size="large">
          </Spin>
        </Modal>
    )
}
