import React from 'react'
import { Form, Input} from "antd";
const FormPassword = (props)=>{
    return (
        <Form.Item 
            label={props.label}
            name={props.name}
            rules ={[{required:props.required, message: `${props.name} must be filled!`}]}
        > 
            <Input.Password 
                value={props.value}
                name={props.name}
                onChange={(e)=>{props.onChange(props.name,e.target.value,props.index)}}
                placeholder={props.placeholder} 
                onBlur={props.onBlur}
                className={props.className}
                disabled={props.disabled}
                defaultValue={props.defaultValue}
            /> 
        </Form.Item> 
    )
}
export default FormPassword; 