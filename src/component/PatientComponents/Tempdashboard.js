import {react,useEffect,useState} from 'react'
import './Tempdashboard.css'
import Line from './Charts/ChartComponents/line'
import data_line from './Charts/ChartData/data_line.json'
import StreamLine from './Charts/ChartComponents/streamline'
import stream_data from './Charts/ChartData/data_stream.json'
import VerticalBar from './Charts/ChartComponents/VerticalBar'
import  data_vertical_bar  from './Charts/ChartData/data_vertical_bar.json'
import { DatePicker, Space } from 'antd';
import Bar from "./Charts/ChartComponents/bar";
import {Row,Col} from 'antd'
import bar_data from './Charts/ChartData/data_bar';
import Pie from './Charts/ChartComponents/pie'
import pie_data1 from './Charts/ChartData/data_pie';
import VerticalBar2 from './Charts/ChartComponents/Verticalbar2'
import data_vertical_bar2 from './Charts/ChartData/data_vertical_bar2.json'
import line1_data from './Charts/ChartData/data_line.json'
import line2_data from './Charts/ChartData/data_line2.json'
import { Button, Radio,Switch,Select } from 'antd';
import { DownloadOutlined } from '@ant-design/icons'
import { Table, Tag } from 'antd';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { get_progress } from '../API/Progress/ProgressApi'
const { Option } = Select;
const Tempdashboard=()=>{

    var doc = new jsPDF();
   
        const [date,Setdate]=useState('20-09-2021')
        const [graphview,Setgraphview]=useState(true)
        const[minmaxgraphdata,Setminmaxgraphdata]=useState(data_vertical_bar)
        const [koosgraphdata,Setkoosgraphdata]=useState(bar_data)
        const [exercisecompletiondata,Setexercisecompletiondata]=useState(pie_data1)
        const [setcompletionratedata,Setsetcompletionratedata]=useState(data_vertical_bar2)
        const [targetminmaxdata,Settargetminmaxdata]=useState(line1_data)
        const [accuracygraphdata,Setaccuracygraphdata]=useState(line2_data)
        const [selectedexercise1,Setselectedexercise]=useState(0)
       

        useEffect( async()=>{
            const data=await get_progress(57)
            console.log('data  progress')
            console.log(data)

        })
        const dataSourcejpint =minmaxgraphdata.map((item,index)=>{
                return {
                    key: index,
                    Joint:item.Joints,
                    Min: item.Min,
                    Max:item.Max

                }
            })
          

         // console.log('mapping k baad')
       //   console.log(dataSourcejpint)
          //  console.log('minmaxtarget')
         //   console.log(targetminmaxdata)
            targetminmaxdata[0].data.map((item,index)=>{
                return  {
                       title:item.x,
                       dataIndex:item.x,
                       key:item.x
                   }
               })
              
            var targetminmaxcolumn=[
                
               
                {
                    title:'Type',
                    dataIndex:'Type',
                    key:'Type'
                }
            ]
            let temparray=targetminmaxdata[0].data.map((item)=>{
                    
                return {
                    
                    title :item.x,
                    dataIndex:item.x,
                    key :item.x
                
                }
            })
          //  console.log(temparray)
          
            targetminmaxcolumn=targetminmaxcolumn.concat(temparray)
          //  console.log('target min max columsn')
          //  console.log(targetminmaxcolumn)
            const targgetminmaxdatasource=[]

            

            targetminmaxdata.map((item,index)=>{
             
                item.data.map((item1,index1)=>{ 
                    for ( let j=0;j<targetminmaxcolumn.length;j++)
                {   
                                    targgetminmaxdatasource[targetminmaxcolumn[j].title]=item1.x
                }

                })
                
            })
                
         //   console.log(targgetminmaxdatasource)
            
           
            const kooscolumn=  [
                {
                  title: 'Koos',
                  dataIndex: 'Koos',
                  key: 'Koos',
                },
                {
                  title: 'Score',
                  dataIndex: 'Score',
                  key: 'Score',
                },
                
              ];
              const completioncolumn=  [
                {
                  title: 'Exercise Alloted',
                  dataIndex: 'Exercise_Alloted',
                  key: 'Exercise_Alloted',
                },
                {
                  title: 'Exercise Completed',
                  dataIndex: 'Exercise_Completed',
                  key: 'Exercise_Completed',
                },
                {
                    title: 'Exercise pending',
                    dataIndex: 'Exercise_pending',
                    key: 'Exercise_pending',
                  },
                
              ];

              const completiondatasource=[

                {
                    key :1,
                    Exercise_Alloted :'6',
                Exercise_Completed :'3',
                Exercise_pending :'3'
                    
                }
              ]

              const koosdatasource=koosgraphdata.map((item,index)=>{
                  return {

                    key :index,
                    Koos:item.koos,
                    Score :item.score
                  }
              })
          const columnsminmaxjoint = [
            {
              title: 'Joint',
              dataIndex: 'Joint',
              key: 'Joint',
            },
            {
              title: 'Min',
              dataIndex: 'Min',
              key: 'Min',
            },
            {
              title: 'Max',
              dataIndex: 'Max',
              key: 'Max',
            },
          ];

     

          const columnsetcompletionrate =[
            {
                title: 'Date',
                dataIndex: 'Date',
                key: 'Date',
              },
              {
                title: 'SetCompletionRate',
                dataIndex: 'SetCompletionRate',
                key: 'SetCompletionRate',
              }
          ]

          const Setcompletiondatasource=setcompletionratedata.map((item,index)=>{


            return {
                key :index,
                Date :item.Date,
                SetCompletionRate:item.SetCompletionRate
            }
          })
    const onDateChange=(date, dateString)=>{
        //console.log(dateString)
        Setdate(dateString)
    }
       

    function jointchange(e)
    {
        Setselectedexercise(e)
      //  console.log(minmaxgraphdata)
    }


    function make_pdf()
    {   
        if(graphview)
        {
            html2canvas(document.getElementById("tempdashboard")).then(canvas => {
                document.body.appendChild(canvas);  // if you want see your screenshot in body.
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                pdf.setFontSize(10);
                pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
                pdf.save("Patient-Data"); 
    
            })
        }
        else{
            alert('cannot download raw data')
        }
        
    }


    return (
        <div className="tempdashboard" id="tempdashboard">
          <Button type="primary" onClick={make_pdf}  className="pdf-button" id="pdf-button" shape="round" icon={<DownloadOutlined />} size={'medium'}>
          Download PDf
        </Button>
            <div className="header">
                <Row className="patientInfo">
                  
                    <Col span={2}>
                        
                    <p><b> Basic Info </b></p>
                        </Col>
                    <Col className="border p-2" span={4}>
                        
                        <p>Name :satwik Mishra</p>
                        </Col> 
                        
                        <Col   className="border p-2" span={4} >
                        <p>Contact Number : 7354099102</p>
                        
                        </Col> 
                        <Col  className="border p-2" span={4} >
                        <p> Gender : Male </p>
                        
                        </Col> 
                        <Col  className="border p-2" span={4} >
                        <p> Blood Group : A+</p>
                        
                        </Col>  
                        <Col  className="border p-2" span={4}>
                        <p> Allergies: None </p>
                        
                        </Col>  
                       
                </Row>
                <div className="episodeInfo">
                <Col  >
                        
                        <p> <b>Episode INfo </b></p>
                        </Col> 
                    <Col span={5}  className="border detail">
                        
                        <p>Episode Id :40</p>
                        </Col> 
                        <Col span={5} className="border detail">
                        <p> Referred Doctor : Dr. Rajiv</p>
                        
                        </Col>
                        <Col span={5} className="border detail">
                        
                        <p>Primary Complaint : Checkup</p>
                        </Col> 
                        <Col span={5} className="border detail">
                        <p> Episode Issue : High level problem</p>
                        
                        </Col> 
                       
                         
                </div>
              
            </div>

            <div className="assesment">
                <div className="switch-box">
            View Type: <Switch checkedChildren="Raw Data" unCheckedChildren="Graph" onChange={()=>Setgraphview(!graphview)} className="switch-data" id="switch-data"  />
            </div>
              <center>  <h1> <strong>{'Assesment  Analysis '}</strong></h1></center>
              <div className="border detail-assesment">
                        <p id="henry"> Diagnose Disease : Liver Infection</p>
                        
                        </div> 
                        <div className="border detail-assesment">
                        <p>Treatment PLanned : treatment</p>
                        
                        </div> 
              <Row className="assesment-main" id="tableclass" >
                  <Col    className="left-graph">
          {  graphview ?   <DatePicker className='date-picker' onChange={onDateChange}  placeholder="Select Date" /> : null   } 
                <div className="col"  style={{ height: 400,width:1000}}>
                   { graphview ?  <VerticalBar   data={minmaxgraphdata} date={date} /> : <Table size="small" className="min-max-table" columns={columnsminmaxjoint} dataSource={dataSourcejpint} />}
               
            </div>
            </Col>
            
            <Col    className="right-graph">
                <div className="col" style={{ height: 400,width:900,marginTop:20}}>
            {graphview ?    <Bar data={koosgraphdata} exercise={selectedexercise1}/> : null}
                 {graphview ?  <Select defaultValue="lucy" className="koos-joint-filter"  onChange={jointchange}>
      <Option value="Squat">Squat</Option>
      <Option value="Push ups">Push ups</Option>
      <Option value="disabled" disabled>
        Lunges
      </Option>
     
    </Select>
    :
    <Table size="small" className="koos-table" columns={kooscolumn} dataSource={koosdatasource} />
    }
            </div>
            
            </Col>
            
            
            </Row>
            
            </div>
            <div className="bottom-container">
                <center><h1><strong> Care Plan Analysis </strong> </h1></center>
            <div class="bottom-inner-container" style={{ height: 500}}>
                <div className="bottom-left-date-picker">
               { graphview ?  <DatePicker className='date-picker' onChange={onDateChange}  placeholder="Select Date" /> : null }
                </div>
              
                <div class="col pie-chart">
             
                <Row class="row-bottom m-3" style={{ height: 500}}>
                    <p className="date-completion">   {date}</p>
                <Col class="col" style={{ height: 500,width:500}}>
                 { graphview ?    <Pie data={exercisecompletiondata} /> :  <Table size="small" className="exercise-table" columns={completioncolumn} dataSource={completiondatasource} />}
                </Col> 
                <Col class="col"  style={{ height: 400,width:800,marginTop:20}}>
                    {graphview ?  <VerticalBar2 data={setcompletionratedata} /> :  <Table size="small" className="setcompletion-table" columns={columnsetcompletionrate} dataSource={Setcompletiondatasource} />}
                </Col> 
                </Row>
                
                </div>   
                
                   
                     
            </div>
            <div class="row" style={{ height: 400}}>
                
                    <div class="col-6">
                       {
                       
                       graphview
                       ?
                       <Line data={targetminmaxdata} 
                        min={40} max={190}
                        ylegend={"Angles"}/>
                        :
                        <Table size="small" className="setcompletion-table" columns={targetminmaxcolumn} />
                    }
                      
                    </div> 
                     
                    <div class="col-6">
                        {
                            graphview?

                            <Line data={accuracygraphdata} 
                        min={40} max={190}
                        ylegend={"Angles"}/>
                    :
                    null
                    }
                      
                    </div> 
                    
                </div>
            </div>
            
           
        </div>
    )

}


export default Tempdashboard;