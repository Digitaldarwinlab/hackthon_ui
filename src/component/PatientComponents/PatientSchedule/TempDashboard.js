import {React} from 'react'

import {Row,Col} from 'antd'
import './temp.css'
import Pie from '../Charts/ChartComponents/pie'
import pie_data1 from '../Charts/ChartData/data_pie.json'
import Line from '../Charts/ChartComponents/line'
import Bar from '../Charts/ChartComponents/bar'
import bar_data  from '../Charts/ChartData/data_bar.json'
import line_data1 from '../Charts/ChartData/data_line';
const TempDashboard =()=>{

return (
    <div  className="main-container">
        <div className="left-side">
        <div className="headers">
            <h2 className="basic-detail-heading"> Basic Detail</h2>
            <div className="upper-row">
                <Col className="border detail-col">
                    <p><b>Name :</b> Satwik Mishras</p>
                    
                </Col>
                <Col className="border detail-col">
                <p><b>Age :</b> 20</p> 
                </Col>
                <Col className="border detail-col" >
                <p><b>Gender :</b> Male</p>
                </Col>
                <Col className="border detail-col" >
                <p><b>Blood Group :</b> A+</p>
                </Col>
                <Col className="border detail-col">
                <p><b>Alergies :</b> No</p>
                </Col>
            </div>
        </div>

        <div className="status-exercise">
        <div class="row m-3">
        <h2>Exercise Status </h2>           
            </div> 
            <div className="exercises">
                <div className="border data">
                    Total exercises alloted :8
                </div>
                <div className="border data">
                    Total exercises Completed :5
                </div>
                <div className="border data">
                Total exercises pending :3
                </div>
            </div>
                   
                    
        </div>
    <div className="main-assesment">
      
        
        
        </div>
        <div class="row" style={{ height: 400}}>
                    <div class="col-6">
                        <Line data={line_data1} 
                        min={40} max={190}
                        ylegend={"Angles"}/>
                    </div>     
                    <div class="col-6">
                    <Bar data={bar_data}/>
                    </div> 
                </div> 
        </div>

        <div className="right-side">
             <button>Downloads PDf</button>
        </div>
        
    </div>
)

}

export default TempDashboard