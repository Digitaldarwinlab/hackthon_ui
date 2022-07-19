import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CircularBar = (props) => { 
    return (
        <div>
            <CircularProgressbar 
                styles={{
                    root:{
                        width:props.width?props.width:120
                    },
                    path:{
                        stroke:props.color
                    },
                    text: {
                        fill: 'black',
                        fontSize: '16px',
                    },
                    background:{fill:"#E6E6FA"}
                }}
                value={props.precentage}
                text={props.score}
            />
        </div>
    )
}
export default CircularBar;