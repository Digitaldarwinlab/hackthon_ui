const initialstate={
    "date": "2021-08-01",
    "id": "epsiode_id",
    "slot": 1,
    "status": "completed",
    "output_json": {
        "squats": {
            "Rep": {
                "set": 0,
                "rep_count": 0
            },
            "Left Shoulder(ver)": {
                "max_angle_perform": 0,
                "min_angle_perform": 0
            },
            "Right Shoulder(ver)": {
                "max_angle_perform": 0,
                "min_angle_perform": 0
            },
            "Left Elbow": {
                "max_angle_perform": 0,
                "min_angle_perform": 0
            },
            "Right Elbow": {
                "max_angle_perform": 0,
                "min_angle_perform": 0
            },
            "Left Hip": {
                "max_angle_perform": 0,
                "min_angle_perform": 0
            },
            "Right Hip": {
                "max_angle_perform": 0,
                "min_angle_perform": 0
            },
            "Left Knee": {
                "max_angle_perform": 0,
                "min_angle_perform": 0
            },
            "Right Knee": {
                "max_angle_perform": 0,
                "min_angle_perform": 0
            },
            "Left Shoulder(hor)": {
                "max_angle_perform": 0,
                "min_angle_perform": 0
            }
        },
        "lungs": {
            
            "Rep": {
                "set": 1,
                "rep_count": 4
            },
            "Left Shoulder(ver)": {
                "max_angle_perform": 0,
                "min_angle_perform": 0
            },
            "Right Shoulder(ver)": {
                "max_angle_perform":0,
                "min_angle_perform": 0
            },
            "Left Elbow": {
                "max_angle_perform": 0,
                "min_angle_perform": 0
            },
            "Right Elbow": {
                "max_angle_perform": 0,
                "min_angle_perform": 0
            },
            "Left Hip": {
                "max_angle_perform": .0,
                "min_angle_perform": 0
            },
            "Right Hip": {
                "max_angle_perform": 0,
                "min_angle_perform": 0
            },
            "Left Knee": {
                "max_angle_perform": 0,
                "min_angle_perform": 0
            },
            "Right Knee": {
                "max_angle_perform": 0,
                "min_angle_perform": 0
            },
            "Left Shoulder(hor)": {
                "max_angle_perform": 0,
                "min_angle_perform": 0
            }
        }
    }
}


export  const addCareplanData=(state=initialstate,action)=>{
    switch(action.type)
    {
        case  "AddData":
            return {
                "date": action.payload.date,
                "id": action.payload.episodeId,
                "slot": 1,
                "status": "completed",
                "output_json": {
                    "squats": {
                        "Rep": {
                            "set": action.payload.set,
                            "rep_count": action.payload.rep_count
                        },
                        "Left Shoulder(ver)": {
                            "max_angle_perform": 0,
                            "min_angle_perform": 0
                        },
                        "Right Shoulder(ver)": {
                            "max_angle_perform": 0,
                            "min_angle_perform": 0
                        },
                        "Left Elbow": {
                            "max_angle_perform": 0,
                            "min_angle_perform": 0
                        },
                        "Right Elbow": {
                            "max_angle_perform": 0,
                            "min_angle_perform": 0
                        },
                        "Left Hip": {
                            "max_angle_perform": 0,
                            "min_angle_perform": 0
                        },
                        "Right Hip": {
                            "max_angle_perform": 0,
                            "min_angle_perform": 0
                        },
                        "Left Knee": {
                            "max_angle_perform": 0,
                            "min_angle_perform": 0
                        },
                        "Right Knee": {
                            "max_angle_perform": 0,
                            "min_angle_perform": 0
                        },
                        "Left Shoulder(hor)": {
                            "max_angle_perform": 0,
                            "min_angle_perform": 0
                        }
                    },
                    "lungs": {
                        
                        "Rep": {
                            "set": 1,
                            "rep_count": 4
                        },
                        "Left Shoulder(ver)": {
                            "max_angle_perform": 0,
                            "min_angle_perform": 0
                        },
                        "Right Shoulder(ver)": {
                            "max_angle_perform":0,
                            "min_angle_perform": 0
                        },
                        "Left Elbow": {
                            "max_angle_perform": 0,
                            "min_angle_perform": 0
                        },
                        "Right Elbow": {
                            "max_angle_perform": 0,
                            "min_angle_perform": 0
                        },
                        "Left Hip": {
                            "max_angle_perform": .0,
                            "min_angle_perform": 0
                        },
                        "Right Hip": {
                            "max_angle_perform": 0,
                            "min_angle_perform": 0
                        },
                        "Left Knee": {
                            "max_angle_perform": 0,
                            "min_angle_perform": 0
                        },
                        "Right Knee": {
                            "max_angle_perform": 0,
                            "min_angle_perform": 0
                        },
                        "Left Shoulder(hor)": {
                            "max_angle_perform": 0,
                            "min_angle_perform": 0
                        }
                    }
                }
            }
    }
}
