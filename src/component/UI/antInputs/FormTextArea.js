import React from 'react'
import {Form,Input} from "antd";
export default function FormTextArea(props) {
    return (
        <Form.Item label={props.label}  
            name={props.name}
            rules ={[{required:props.required, message: `${props.name} must be filled!`}]}
        >
        <Input.TextArea 
            className={props.className}
            name={props.name} 
            value={props.value}
            onChange={(e)=>{props.onChange(props.name,e.target.value)}}
            placeholder={props.placeholder}
            disabled={props.disabled}
            onBlur={props.onBlur}
            id="test-area-id"
            defaultValue={props.defaultValue?props.defaultValue:""}
        />
        </Form.Item>
    )
}