import React from 'react'
import { Form,DatePicker} from 'antd';
import moment from "moment";
const { MonthPicker, RangePicker } = DatePicker;

const  FormDate = (props) => { 
    function disabledDate(current) {
        //  console.log(props.disabledDate[1])
        if(props.disabledDate[0]=='true')
        {      let endCheck = true;
            let startCheck = true;
            if(props.disabledDate[1])
            {  
                
                endCheck= current && current < moment(props.disabledDate[1], "YYYY-MM-DD");
                let newdate=current && moment(new Date(), "YYYY-MM-DD") <= current  
                return  newdate || endCheck 
            }
        }
        //  console.log('disableddate')
        let yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
        return current && current < moment(yesterday,"YYYY-MM-DD");
    }
    function disabledDate1(current) {
        //    console.log('disableddate onee')
        let yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
        return current && current > moment(yesterday,"YYYY-MM-DD");
    }
        

        const disabledDate3 = current => {
            if (!dates || dates.length === 0) {
              return false;
            }
            const tooLate = dates[0] && current.diff(dates[0], 'days') > 7;
            const tooEarly = dates[1] && dates[1].diff(current, 'days') > 7;
            return tooEarly || tooLate;
          };
    return (
        <Form.Item  
            label={props.label} 
            name={props.name}
            rules={[{required:props.required,message:props.name + " must be filled."}]}
            >
            <DatePicker 
                className={props.className}
                disabledDate={(props.disabledDate && disabledDate) || (props.reverse && disabledDate1)}

                value={props.value}
                onChange={(date,dateString)=>props.onChange(props.name,{date,dateString})}
                disabled={props.disabled}
                defaultValue={props.defaultValue}
                placeholder={props.placeholder}
            />
        </Form.Item>
    )   
}
export default FormDate;