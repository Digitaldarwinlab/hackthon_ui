import React from 'react'
import {  Select , Form } from "antd";

const { Option } = Select;

const FormSelect = (props) => {
    return (
        <>
            <Form.Item 
            label={props.label}
            name={props.name}
            rules ={[{required:props.required, message: `${props.name} must be filled!`}]}
        >
            <Select
                style={{ width: 200 }}
                placeholder={props.placeholder}
                onChange={(e)=>{props.onChange(props.name,e.target.value,props.index)}}
            >
            </Select>
        </Form.Item>
        </>
    )
}

export default FormSelect
