export default function PatAppointment(model) {
    const appointData = model.data.appointmentData;
    return (
      <div className="showtime-preview">
        {(appointData && appointData.exercise)?(
            <div>{appointData.exercise.name}</div>
        ):null}
        {
          (appointData && appointData.startDate)?(
            <div>
              {(new Date(appointData.startDate)).toLocaleTimeString()}
              {' - '}
              {(new Date(appointData.endDate)).toLocaleTimeString()}
          </div>
          ):""
        }
      </div>
    );
  }
  